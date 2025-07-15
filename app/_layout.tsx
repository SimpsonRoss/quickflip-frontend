// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useStore } from "@/store";

export default function RootLayout() {
  const initializeUser = useStore((state) => state.initializeUser);
  const loadItems = useStore((state) => state.loadItems);
  const user = useStore((state) => state.user);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      // ALWAYS initialize user on app start to ensure they exist in DB
      console.log("App starting - forcing user initialization...");
      initializeUser("test@quickflip.com", "Test User")
        .then(() => {
          console.log("User initialization completed, loading items...");
          loadItems();
        })
        .catch((error) => {
          console.error("User initialization failed:", error);
        });
      setHasInitialized(true);
    }
  }, [hasInitialized, initializeUser, loadItems]);

  return (
    <Stack>
      {/* Main tab layout */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
