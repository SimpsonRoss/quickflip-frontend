import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Design';
import { StyleSheet, Text, View } from 'react-native';

interface SummaryCardProps {
  title: string;
  value: string;
  iconName: string;
  iconColor: string;
  backgroundColor?: string;
  borderLeftColor?: string;
  valueColor?: string;
  subtitle?: string;
  subtitleColor?: string;
}

export function SummaryCard({
  title,
  value,
  iconName,
  iconColor,
  backgroundColor = Colors.surface,
  borderLeftColor,
  valueColor = Colors.text,
  subtitle,
  subtitleColor = Colors.textSecondary,
}: SummaryCardProps) {
  return (
    <View style={[
      styles.summaryCard,
      { backgroundColor },
      borderLeftColor && { borderLeftWidth: 4, borderLeftColor },
    ]}>
      <View style={styles.summaryIconContainer}>
        <IconSymbol name={iconName} size={20} color={iconColor} />
      </View>
      <Text style={[styles.summaryValue, { color: valueColor }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{title}</Text>
      {subtitle && (
        <Text style={[styles.summarySubtitle, { color: subtitleColor }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    ...Typography.subheading,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    ...Typography.footnoteMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  summarySubtitle: {
    ...Typography.footnoteSemibold,
    marginTop: 2,
    textAlign: 'center',
  },
});