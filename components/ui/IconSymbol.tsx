// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  house: "home",
  "camera.fill": "camera",
  camera: "camera",
  "list.bullet": "list",
  "list.bullet.rectangle.fill": "list",
  "bag.fill": "shopping-bag",
  bag: "shopping-bag",
  "creditcard.fill": "credit-card",
  creditcard: "credit-card",
  "dollarsign.circle.fill": "monetization-on",
  "chart.line.uptrend.xyaxis": "trending-up",
  "bolt.fill": "flash-on",
  sparkles: "auto-awesome",
  xmark: "close",
  "xmark.circle": "cancel",
  trash: "delete",
  checkmark: "check",
  "checkmark.circle": "check-circle",
  "checkmark.circle.fill": "check-circle",
  "checkmark.seal": "verified",
  "arrow.up.circle": "keyboard-arrow-up",
  "arrow.down.circle": "keyboard-arrow-down",
  "arrow.up.right": "north-east",
  "arrow.down.right": "south-east",
  "dollarsign.circle": "monetization-on",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
