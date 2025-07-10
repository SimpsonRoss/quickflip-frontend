import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface EmptyStateProps {
  iconName: string;
  title: string;
  description: string;
  iconColor?: string;
  style?: ViewStyle;
}

export function EmptyState({
  iconName,
  title,
  description,
  iconColor = Colors.textSecondary,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <IconSymbol name={iconName} size={48} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    ...Typography.heading,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});