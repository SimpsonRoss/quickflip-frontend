// app/_layout.tsx
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <Stack>
        {/* Main tab layout */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </KeyboardProvider>
  );
}
