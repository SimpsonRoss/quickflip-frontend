import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { describeImage } from '@/lib/openai';

export type ScannedItem = {
  id: string;
  uri: string;
  timestamp: number;
  title?: string;
  description?: string;
  estimatedPrice?: number | null;
  priceCount?: number;
  condition?: string;
  purchased?: boolean;
  pricePaid?: number;
  sold?: boolean;
  priceSold?: number;
};

type Store = {
  items: ScannedItem[];
  addItem: (uri: string) => Promise<void>;
  updateItem: (id: string, data: Partial<ScannedItem>) => void;
  markPurchased: (id: string, pricePaid: number) => void;
  markSold: (id: string, priceSold: number) => void;
  clearItems: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      items: [],

      addItem: async (uri: string) => {
        const id = `${Date.now()}-${Math.random()}`;
        const timestamp = Date.now();

        set((state) => ({
          items: [...state.items, { id, uri, timestamp }],
        }));

        try {
          const {
            title,
            description,
            condition,
            estimatedPrice,
            priceCount,
          } = await describeImage(uri);

          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    title,
                    description,
                    condition,
                    estimatedPrice,
                    priceCount,
                  }
                : item
            ),
          }));
        } catch (err) {
          console.warn('describeImage() failed:', err);
        }
      },

      updateItem: (id, data) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),

      markPurchased: (id, pricePaid) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, purchased: true, pricePaid } : item
          ),
        })),

      markSold: (id, priceSold) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, sold: true, priceSold } : item
          ),
        })),

      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'quickflip-scanned-items',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
