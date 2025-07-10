import { IconSymbol } from '@/components/ui/IconSymbol';
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from '@/constants/theme';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface SummaryCardData {
  icon: string;
  iconColor: string;
  value: string;
  label: string;
  subtext?: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface SummaryCardsProps {
  cards: SummaryCardData[];
  style?: ViewStyle;
}

export function SummaryCards({ cards, style }: SummaryCardsProps) {
  return (
    <View style={[styles.container, style]}>
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </View>
  );
}

function SummaryCard({
  icon,
  iconColor,
  value,
  label,
  subtext,
  backgroundColor,
  borderColor,
}: SummaryCardData) {
  return (
    <View
      style={[
        styles.card,
        backgroundColor && { backgroundColor },
        borderColor && { borderColor, borderWidth: 1 },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${iconColor}15` },
        ]}
      >
        <IconSymbol name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.value, iconColor !== Colors.textPrimary && { color: iconColor }]}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
      {subtext && (
        <Text style={[styles.subtext, iconColor !== Colors.textPrimary && { color: iconColor }]}>
          {subtext}
        </Text>
      )}
    </View>
  );
}

interface DetailRowData {
  label: string;
  value: string;
  valueColor?: string;
}

interface SummaryDetailProps {
  title?: string;
  rows: DetailRowData[];
  style?: ViewStyle;
}

export function SummaryDetail({ title, rows, style }: SummaryDetailProps) {
  return (
    <View style={[styles.detailContainer, style]}>
      {title && <Text style={styles.detailTitle}>{title}</Text>}
      {rows.map((row, index) => (
        <View key={index} style={styles.detailRow}>
          <Text style={styles.detailLabel}>{row.label}</Text>
          <Text
            style={[
              styles.detailValue,
              row.valueColor && { color: row.valueColor },
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

// Helper functions for common summary configurations
export const createPurchasedSummary = (
  totalPaid: number,
  totalResale: number
): SummaryCardData[] => {
  const totalProfit = totalResale - totalPaid;
  
  return [
    {
      icon: 'creditcard',
      iconColor: Colors.primary,
      value: `$${totalPaid.toFixed(2)}`,
      label: 'Total Invested',
    },
    {
      icon: 'dollarsign.circle',
      iconColor: Colors.success,
      value: `$${totalResale.toFixed(2)}`,
      label: 'Est. Value',
    },
    {
      icon: totalProfit >= 0 ? 'arrow.up.circle' : 'arrow.down.circle',
      iconColor: totalProfit >= 0 ? Colors.success : Colors.error,
      value: `$${totalProfit.toFixed(2)}`,
      label: 'Potential Profit',
      borderColor: 'rgba(52, 199, 89, 0.2)',
    },
  ];
};

export const createSoldSummary = (
  totalRevenue: number,
  totalProfit: number,
  profitMargin: number
): SummaryCardData[] => [
  {
    icon: 'dollarsign.circle.fill',
    iconColor: Colors.success,
    value: `$${totalRevenue.toFixed(2)}`,
    label: 'Total Revenue',
    borderColor: Colors.success,
  },
  {
    icon: totalProfit >= 0 ? 'chart.line.uptrend.xyaxis' : 'chart.line.downtrend.xyaxis',
    iconColor: totalProfit >= 0 ? Colors.success : Colors.error,
    value: `$${totalProfit.toFixed(2)}`,
    label: 'Total Profit',
    subtext: `${profitMargin >= 0 ? '+' : ''}${profitMargin.toFixed(1)}% margin`,
    borderColor: Colors.primary,
  },
];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    alignItems: 'center',
    ...Shadows.card,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    ...Typography.bodySemiBold,
    fontSize: 18,
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.label,
    textAlign: 'center',
  },
  subtext: {
    ...Typography.label,
    fontSize: 10,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  detailContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  detailTitle: {
    ...Typography.captionSemiBold,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    ...Typography.caption,
  },
  detailValue: {
    ...Typography.captionSemiBold,
  },
});