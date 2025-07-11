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
      if (!user) {
        // No user found, create one
        initializeUser("test@quickflip.com", "Test User");
      } else {
        // User already exists (from AsyncStorage), load their items
        loadItems();
      }
      setHasInitialized(true);
    }
  }, [user, hasInitialized, initializeUser, loadItems]);

  return (
    <Stack>
      {/* Main tab layout */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
