import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { api, Product, User } from "@/lib/api";
import * as FileSystem from "expo-file-system";

export type ScannedItem = Product & {
  uri?: string; // For backwards compatibility
  timestamp: number;
  purchased?: boolean; // For backwards compatibility
  sold?: boolean; // For backwards compatibility
};

type Store = {
  user: User | null;
  items: ScannedItem[];
  loading: boolean;
  error: string | null;

  // User Management
  initializeUser: (email: string, fullName?: string) => Promise<void>;

  // Product Management
  loadItems: () => Promise<void>;
  addItem: (uri: string) => Promise<void>;
  updateItem: (id: string, data: Partial<ScannedItem>) => Promise<void>;
  markPurchased: (id: string, pricePaid: number) => Promise<void>;
  markSold: (id: string, priceSold: number) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearItems: () => void;

  // Utility
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      items: [],
      loading: false,
      error: null,

      // User Management
      initializeUser: async (email: string, fullName?: string) => {
        try {
          set({ loading: true, error: null, items: [] }); // Clear items when initializing
          const { user } = await api.createOrGetUser(email, fullName);
          set({ user, loading: false });
          // Note: loadItems() is called separately by the UI after user is set
        } catch (error) {
          console.error("Failed to initialize user:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to initialize user",
            loading: false,
          });
        }
      },

      // Product Management
      loadItems: async () => {
        const { user } = get();
        if (!user) return;

        try {
          set({ loading: true, error: null, items: [] }); // Clear items before loading
          const { products } = await api.getProducts(user.id);
          const items = products.map(
            (product): ScannedItem => ({
              ...product,
              // Convert price fields from strings to numbers
              estimatedPrice: product.estimatedPrice
                ? Number(product.estimatedPrice)
                : null,
              pricePaid: product.pricePaid ? Number(product.pricePaid) : null,
              priceSold: product.priceSold ? Number(product.priceSold) : null,
              timestamp: new Date(product.createdAt).getTime(),
              // Backwards compatibility: sold items should also be marked as purchased
              purchased:
                product.status === "PURCHASED" || product.status === "SOLD",
              sold: product.status === "SOLD",
            })
          );
          set({ items, loading: false });
        } catch (error) {
          console.error("Failed to load items:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to load items",
            loading: false,
          });
        }
      },

      addItem: async (uri: string) => {
        const { user } = get();
        if (!user) {
          console.error("No user available");
          return;
        }

        // Generate temporary ID for optimistic update
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        const timestamp = Date.now();

        // 1. Immediately add item with just the image (optimistic update)
        const placeholderItem: ScannedItem = {
          id: tempId,
          userId: user.id,
          imageUrl: uri, // Use local URI initially
          title: "", // Empty initially - will show loading state
          description: "", // Empty initially - will show loading state
          condition: "",
          genre: "",
          estimatedPrice: null,
          priceCount: 0,
          status: "SCANNED",
          pricePaid: null,
          priceSold: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          purchasedAt: null,
          soldAt: null,
          timestamp,
          purchased: false,
          sold: false,
          uri, // Keep original URI for backwards compatibility
        };

        set((state) => ({
          items: [placeholderItem, ...state.items],
          loading: true,
          error: null,
        }));

        try {
          // 2. Convert image to base64 and send to backend
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const base64WithPrefix = `data:image/jpeg;base64,${base64}`;

          // Send to backend for analysis
          const result = await api.describeImage(base64WithPrefix, user.id);

          // 3. Update the item with real data from API
          set((state) => ({
            items: state.items.map((item) =>
              item.id === tempId
                ? {
                    ...item,
                    id: result.id, // Replace temp ID with real ID
                    imageUrl: result.imageUrl, // Replace local URI with cloud URL
                    title: result.title,
                    description: result.description,
                    condition: result.condition,
                    genre: result.genre,
                    estimatedPrice: result.estimatedPrice
                      ? Number(result.estimatedPrice)
                      : null,
                    priceCount: result.priceCount,
                  }
                : item
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to add item:", error);

          // Remove the placeholder item on error
          set((state) => ({
            items: state.items.filter((item) => item.id !== tempId),
            error:
              error instanceof Error ? error.message : "Failed to add item",
            loading: false,
          }));
        }
      },

      updateItem: async (id, data) => {
        try {
          set({ loading: true, error: null });

          // Update in database
          const { product } = await api.updateProduct(id, data);

          // Update local state
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    ...data,
                    updatedAt: product.updatedAt,
                  }
                : item
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to update item:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to update item",
            loading: false,
          });

          // Still update local state as fallback
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, ...data } : item
            ),
          }));
        }
      },

      markPurchased: async (id, pricePaid) => {
        try {
          set({ loading: true, error: null });
          const { product } = await api.updateProductStatus(
            id,
            "PURCHASED",
            pricePaid
          );

          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: "PURCHASED",
                    pricePaid,
                    purchased: true,
                    purchasedAt: product.purchasedAt,
                    updatedAt: product.updatedAt,
                  }
                : item
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to mark purchased:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to mark purchased",
            loading: false,
          });
        }
      },

      markSold: async (id, priceSold) => {
        try {
          set({ loading: true, error: null });
          const { product } = await api.updateProductStatus(
            id,
            "SOLD",
            priceSold
          );

          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: "SOLD",
                    priceSold,
                    sold: true,
                    soldAt: product.soldAt,
                    updatedAt: product.updatedAt,
                  }
                : item
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to mark sold:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to mark sold",
            loading: false,
          });
        }
      },

      deleteItem: async (id) => {
        try {
          set({ loading: true, error: null });
          await api.deleteProduct(id);

          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to delete item:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete item",
            loading: false,
          });
        }
      },

      clearItems: () => set({ items: [] }),

      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "quickflip-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);
