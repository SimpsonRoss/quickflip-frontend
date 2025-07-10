import { IconSymbol } from '@/components/ui/IconSymbol';
import {
    BorderRadius,
    Colors,
    Spacing,
    Typography,
} from '@/constants/theme';
import { ScannedItem } from '@/store';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
} from 'react-native';

interface PriceSectionProps {
  item: ScannedItem;
  variant: 'scanned' | 'purchased' | 'sold';
  editMode?: boolean;
  localValues?: {
    pricePaid?: string;
    priceSold?: string;
    estimatedPrice?: string;
  };
  onValueChange?: (field: string, value: string) => void;
  style?: ViewStyle;
}

export function PriceSection({
  item,
  variant,
  editMode = false,
  localValues = {},
  onValueChange,
  style,
}: PriceSectionProps) {
  const renderEstimatedPrice = () => {
    if (!item.estimatedPrice || !item.priceCount) return null;

    let confidence: 'Low' | 'Medium' | 'High' = 'Low';
    const count = item.priceCount;
    if (count >= 5 && count <= 10) confidence = 'Medium';
    else if (count > 10) confidence = 'High';

    const confidenceColor = Colors.confidence[confidence.toLowerCase() as keyof typeof Colors.confidence];

    return (
      <View style={styles.priceInfoContainer}>
        <View style={styles.priceRow}>
          <IconSymbol name="dollarsign.circle" size={16} color={Colors.success} />
          <Text style={styles.priceText}>
            Est. Value: ${item.estimatedPrice.toFixed(2)}
          </Text>
        </View>
        <View style={styles.confidenceRow}>
          <View
            style={[
              styles.confidenceBadge,
              { backgroundColor: `${confidenceColor}15` },
            ]}
          >
            <View
              style={[
                styles.confidenceDot,
                { backgroundColor: confidenceColor },
              ]}
            />
            <Text
              style={[
                styles.confidenceText,
                { color: confidenceColor },
              ]}
            >
              {confidence} confidence
            </Text>
          </View>
          <Text style={styles.salesCountText}>
            ({item.priceCount} sales)
          </Text>
        </View>
      </View>
    );
  };

  const renderFinancialSummary = () => {
    if (variant === 'scanned') return null;

    const profit = item.priceSold != null && item.pricePaid != null
      ? item.priceSold - item.pricePaid
      : item.estimatedPrice != null && item.pricePaid != null
      ? item.estimatedPrice - item.pricePaid
      : null;

    const profitPercentage = item.pricePaid && profit !== null
      ? (profit / item.pricePaid) * 100
      : 0;

    return (
      <View style={styles.financialContainer}>
        <View style={styles.financialRow}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>
              {variant === 'sold' ? 'Cost' : 'Paid'}
            </Text>
            {editMode ? (
              <PriceInput
                value={localValues.pricePaid || ''}
                onChangeText={(text) => onValueChange?.('pricePaid', text)}
              />
            ) : (
              <Text style={styles.financialValue}>
                ${item.pricePaid?.toFixed(2) ?? '—'}
              </Text>
            )}
          </View>

          <View style={styles.financialDivider} />

          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>
              {variant === 'sold' ? 'Sold For' : 'Est. Value'}
            </Text>
            {editMode ? (
              <PriceInput
                value={variant === 'sold' 
                  ? (localValues.priceSold || '') 
                  : (localValues.estimatedPrice || '')
                }
                onChangeText={(text) => 
                  onValueChange?.(
                    variant === 'sold' ? 'priceSold' : 'estimatedPrice', 
                    text
                  )
                }
              />
            ) : (
              <Text 
                style={[
                  styles.financialValue, 
                  { color: variant === 'sold' || variant === 'purchased' ? Colors.success : Colors.textPrimary }
                ]}
              >
                ${variant === 'sold' 
                  ? item.priceSold?.toFixed(2) ?? '—'
                  : item.estimatedPrice?.toFixed(2) ?? '—'
                }
              </Text>
            )}
          </View>
        </View>

        {profit !== null && (
          <View style={styles.profitSummaryContainer}>
            <View style={styles.profitSummaryRow}>
              <View style={styles.profitSummaryLeft}>
                <Text style={styles.profitSummaryLabel}>
                  {variant === 'sold' ? 'Net Profit' : 'Potential Profit'}
                </Text>
                <View style={styles.profitPerformanceContainer}>
                  <IconSymbol
                    name={profit >= 0 ? 'arrow.up.right' : 'arrow.down.right'}
                    size={12}
                    color={profit >= 0 ? Colors.success : Colors.error}
                  />
                  <Text
                    style={[
                      styles.profitPerformanceText,
                      { color: profit >= 0 ? Colors.success : Colors.error },
                    ]}
                  >
                    {profitPercentage >= 0 ? '+' : ''}
                    {profitPercentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.profitSummaryValue,
                  { color: profit >= 0 ? Colors.success : Colors.error },
                ]}
              >
                ${profit.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {variant === 'scanned' && renderEstimatedPrice()}
      {variant !== 'scanned' && renderFinancialSummary()}
    </View>
  );
}

function PriceInput({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) {
  return (
    <View style={styles.editInputWrapper}>
      <Text style={styles.dollarSign}>$</Text>
      <TextInput
        style={styles.editInput}
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  priceInfoContainer: {
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  priceText: {
    ...Typography.bodySemiBold,
    color: Colors.success,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    ...Typography.caption,
  },
  salesCountText: {
    ...Typography.caption,
  },
  financialContainer: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
  },
  financialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.base,
  },
  financialLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  financialValue: {
    ...Typography.bodySemiBold,
  },
  editInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dollarSign: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  editInput: {
    ...Typography.body,
    flex: 1,
    paddingVertical: Spacing.xs,
    textAlign: 'center',
  },
  profitSummaryContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  profitSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitSummaryLeft: {
    flex: 1,
  },
  profitSummaryLabel: {
    ...Typography.captionMedium,
    marginBottom: Spacing.xs,
  },
  profitPerformanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  profitPerformanceText: {
    ...Typography.caption,
  },
  profitSummaryValue: {
    ...Typography.bodySemiBold,
    fontSize: 18,
  },
});