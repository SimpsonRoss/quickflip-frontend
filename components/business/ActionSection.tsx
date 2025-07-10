import { IconSymbol } from '@/components/ui/IconSymbol';
import {
    BorderRadius,
    Colors,
    createButtonStyle,
    Spacing,
    Typography,
} from '@/constants/theme';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
} from 'react-native';

interface ActionSectionProps {
  type: 'purchase' | 'sale';
  value: string;
  onValueChange: (value: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function ActionSection({
  type,
  value,
  onValueChange,
  onConfirm,
  disabled = false,
  style,
}: ActionSectionProps) {
  const labels = {
    purchase: {
      title: 'Purchase Price',
      button: 'Confirm',
      icon: 'checkmark' as const,
    },
    sale: {
      title: 'Sale Price',
      button: 'Sell',
      icon: 'checkmark' as const,
    },
  };

  const config = labels[type];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{config.title}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={Colors.textSecondary}
            value={value}
            onChangeText={onValueChange}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            createButtonStyle('primary', 'medium'),
            pressed && { opacity: 0.8 },
            disabled && styles.buttonDisabled,
          ]}
          onPress={onConfirm}
          disabled={disabled}
        >
          <IconSymbol name={config.icon} size={16} color={Colors.textInverse} />
          <Text style={styles.buttonText}>{config.button}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  label: {
    ...Typography.captionSemiBold,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 40,
  },
  dollarSign: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  input: {
    ...Typography.body,
    flex: 1,
    paddingVertical: Spacing.sm,
  },
  buttonText: {
    ...Typography.button,
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});