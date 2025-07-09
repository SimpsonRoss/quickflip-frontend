// (tabs)/_layout.tsx
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#45c5c8",
        tabBarInactiveTintColor: "#FFFFFF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#0b1c38",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: Platform.OS === "ios" ? 90 : 85,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name={focused ? "house.fill" : "house"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scanned"
        options={{
          title: "Scanned",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name={focused ? "list.bullet.rectangle.fill" : "list.bullet"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 32 : 28}
              name={focused ? "camera.fill" : "camera"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="purchased"
        options={{
          title: "Purchased",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name={focused ? "bag.fill" : "bag"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sold"
        options={{
          title: "Sold",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name={focused ? "creditcard.fill" : "creditcard"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
