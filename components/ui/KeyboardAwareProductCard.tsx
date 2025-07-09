import React from "react";
import { View, ViewStyle } from "react-native";

interface KeyboardAwareProductCardProps {
  style?: ViewStyle;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  children: React.ReactNode;
}

export const KeyboardAwareProductCard: React.FC<
  KeyboardAwareProductCardProps
> = ({ style, focused, onFocus, onBlur, children }) => {
  return (
    <View
      style={[
        style,
        focused && {
          shadowRadius: 12,
          shadowOpacity: 0.2,
          elevation: 8,
        },
      ]}
      onTouchStart={onFocus}
      onTouchEnd={onBlur}
    >
      {children}
    </View>
  );
};

export default KeyboardAwareProductCard;
