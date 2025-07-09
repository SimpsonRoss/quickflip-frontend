import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Design';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface PriceInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onConfirm: () => void;
  label: string;
  buttonText: string;
  buttonIcon?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PriceInput({
  value,
  onChangeText,
  onConfirm,
  label,
  buttonText,
  buttonIcon = 'checkmark',
  placeholder = '0.00',
  disabled = false,
}: PriceInputProps) {
  const isDisabled = disabled || !value;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor={Colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
            editable={!disabled}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && !isDisabled && { opacity: 0.8 },
            isDisabled && styles.buttonDisabled,
          ]}
          onPress={onConfirm}
          disabled={isDisabled}
        >
          <IconSymbol name={buttonIcon} size={16} color={Colors.surface} />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.captionSemibold,
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
  },
  dollarSign: {
    ...Typography.bodySemibold,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  buttonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  buttonText: {
    ...Typography.captionSemibold,
    color: Colors.surface,
  },
});