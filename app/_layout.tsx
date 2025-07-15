// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { supabase } from "@/lib/supabase";
import AuthScreen from "./auth";

export default function RootLayout() {
  const initializeUser = useStore((state) => state.initializeUser);
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const signOut = useStore((state) => state.signOut);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Check if user is already signed in with Supabase
    const checkAuthState = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // User is authenticated, initialize them in our system
          const email = session.user.email!;
          const fullName = session.user.user_metadata?.full_name || "";
          await initializeUser(email, fullName);
        }

        setHasInitialized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setHasInitialized(true);
      }
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        await signOut();
      } else if (event === "SIGNED_IN" && session?.user) {
        const email = session.user.email!;
        const fullName = session.user.user_metadata?.full_name || "";
        await initializeUser(email, fullName);
      }
    });

    checkAuthState();

    return () => subscription.unsubscribe();
  }, [initializeUser, signOut]);

  // Show loading or auth screen if not authenticated
  if (!hasInitialized || !isAuthenticated) {
    return hasInitialized ? <AuthScreen /> : null;
  }

  return (
    <Stack>
      {/* Main tab layout */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
