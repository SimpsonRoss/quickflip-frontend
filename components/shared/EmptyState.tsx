import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Design';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  iconName: string;
  title: string;
  description: string;
  iconColor?: string;
}

export function EmptyState({
  iconName,
  title,
  description,
  iconColor = Colors.textSecondary,
}: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <IconSymbol name={iconName} size={48} color={iconColor} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});