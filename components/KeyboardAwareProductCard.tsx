import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface KeyboardAwareProductCardProps {
  children: React.ReactNode;
  style?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export const KeyboardAwareProductCard: React.FC<KeyboardAwareProductCardProps> = ({
  children,
  style,
  onFocus,
  onBlur,
  focused = false,
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const cardRef = useRef<View>(null);
  const [cardPosition, setCardPosition] = useState(0);
  
  // Animated values for highlighting
  const highlightOpacity = useSharedValue(focused ? 1 : 0);
  const cardScale = useSharedValue(1);
  const cardElevation = useSharedValue(focused ? 8 : 4);
  
  // Handle keyboard events
  useKeyboardHandler({
    onStart: (event) => {
      'worklet';
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.height);
      
      // Measure card position when keyboard starts showing
      cardRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setCardPosition(pageY);
      });
    },
    onMove: (event) => {
      'worklet';
      setKeyboardHeight(event.height);
    },
    onEnd: (event) => {
      'worklet';
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    },
  });

  // Update highlight animation when focused state changes
  useEffect(() => {
    highlightOpacity.value = withSpring(focused ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
    
    cardScale.value = withSpring(focused ? 1.02 : 1, {
      damping: 15,
      stiffness: 150,
    });
    
    cardElevation.value = withTiming(focused ? 8 : 4, {
      duration: 200,
    });
  }, [focused, highlightOpacity, cardScale, cardElevation]);

  // Calculate if card needs to be moved up
  const shouldMoveUp = isKeyboardVisible && focused && cardPosition > 0;
  const targetY = shouldMoveUp ? Math.max(0, screenHeight - keyboardHeight - 200) : 0;
  const translateY = shouldMoveUp ? targetY - cardPosition : 0;

  // Animated styles
  const highlightStyle = useAnimatedStyle(() => {
    return {
      opacity: highlightOpacity.value,
      transform: [{ scale: cardScale.value }],
      elevation: cardElevation.value,
      shadowOpacity: cardElevation.value / 20,
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(translateY, { damping: 20, stiffness: 100 }) },
        { scale: cardScale.value },
      ],
    };
  });

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <Animated.View
      ref={cardRef}
      style={[styles.container, style, cardStyle]}
      pointerEvents="box-none"
    >
      {/* Highlight overlay */}
      <Animated.View style={[styles.highlight, highlightStyle]} />
      
      {/* Glow effect */}
      {focused && (
        <Animated.View style={[styles.glow, highlightStyle]} />
      )}
      
      {/* Content */}
      <View style={styles.content}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TextInput) {
            const textInputChild = child as React.ReactElement<any>;
            return React.cloneElement(textInputChild, {
              onFocus: (e: any) => {
                handleFocus();
                textInputChild.props.onFocus?.(e);
              },
              onBlur: (e: any) => {
                handleBlur();
                textInputChild.props.onBlur?.(e);
              },
            });
          }
          return child;
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  highlight: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: '#3864bb',
    borderRadius: 20,
    opacity: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#3864bb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  glow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(56, 100, 187, 0.2)',
    borderRadius: 24,
    opacity: 0,
  },
  content: {
    position: 'relative',
    zIndex: 2,
  },
});

export default KeyboardAwareProductCard;