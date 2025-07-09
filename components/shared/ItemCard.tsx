import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, Layout, Shadows, Spacing, Typography } from '@/constants/Design';
import { calculateProfit, calculateProfitPercentage, formatDate, formatPrice } from '@/lib/utils';
import { ScannedItem } from '@/store';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ItemCardProps {
  item: ScannedItem;
  editMode?: boolean;
  onDelete?: (id: string) => void;
  children?: React.ReactNode;
  variant?: 'scanned' | 'purchased' | 'sold';
}

export function ItemCard({
  item,
  editMode = false,
  onDelete,
  children,
  variant = 'scanned',
}: ItemCardProps) {
  const profit = calculateProfit(item.priceSold, item.pricePaid);
  const profitPercentage = calculateProfitPercentage(item.priceSold, item.pricePaid);

  const renderBadges = () => {
    const badges = [];
    
    if (variant === 'sold') {
      badges.push(
        <View key="sold" style={styles.soldBadge}>
          <IconSymbol name="checkmark.circle.fill" size={16} color={Colors.surface} />
          <Text style={styles.soldBadgeText}>SOLD</Text>
        </View>
      );
    }
    
    if (profit !== null) {
      badges.push(
        <View 
          key="profit" 
          style={[
            styles.profitBadge,
            { backgroundColor: profit >= 0 ? Colors.success : Colors.error }
          ]}
        >
          <Text style={styles.profitBadgeText}>
            {profit >= 0 ? '+' : ''}${Math.abs(profit).toFixed(0)}
          </Text>
        </View>
      );
    }
    
    return badges;
  };

  const renderCondition = () => {
    if (!item.condition) return null;
    
    return (
      <View style={styles.conditionContainer}>
        <IconSymbol name="checkmark.seal" size={14} color={Colors.success} />
        <Text style={styles.conditionText}>{item.condition}</Text>
      </View>
    );
  };

  return (
    <View style={styles.itemCard}>
      {/* Delete Button - Only show in edit mode */}
      {editMode && onDelete && (
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { backgroundColor: '#CC0000' },
          ]}
          onPress={() => onDelete(item.id)}
        >
          <IconSymbol name="xmark" size={14} color={Colors.surface} />
        </Pressable>
      )}

      {/* Item Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.uri }} style={styles.itemImage} />
        
        {variant === 'scanned' && (
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        
        {renderBadges()}
      </View>

      {/* Item Content */}
      <View style={styles.itemContent}>
        {item.title && (
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
        )}

        {item.description && variant === 'scanned' && (
          <Text style={styles.itemDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}

        {renderCondition()}

        {/* Estimated Price for Scanned Items */}
        {variant === 'scanned' && item.estimatedPrice != null && (
          <View style={styles.priceInfoContainer}>
            <View style={styles.priceRow}>
              <IconSymbol name="dollarsign.circle" size={16} color={Colors.success} />
              <Text style={styles.priceText}>
                Est. Value: {formatPrice(item.estimatedPrice)}
              </Text>
            </View>
          </View>
        )}

        {/* Sold Date for Sold Items */}
        {variant === 'sold' && (
          <Text style={styles.soldDate}>Sold on {formatDate(item.timestamp)}</Text>
        )}

        {/* Custom Content */}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
    overflow: 'hidden',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: Layout.itemCardImageHeight,
    backgroundColor: Colors.surfaceSecondary,
  },
  timestampContainer: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.overlay,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  timestamp: {
    ...Typography.footnoteMedium,
    color: Colors.surface,
  },
  soldBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  soldBadgeText: {
    ...Typography.footnoteSemibold,
    color: Colors.surface,
  },
  profitBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  profitBadgeText: {
    ...Typography.footnoteSemibold,
    color: Colors.surface,
  },
  itemContent: {
    padding: Spacing.lg,
  },
  itemTitle: {
    ...Typography.subheading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  itemDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  conditionText: {
    ...Typography.captionMedium,
    color: Colors.success,
  },
  priceInfoContainer: {
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  priceText: {
    ...Typography.captionSemibold,
    color: Colors.success,
  },
  soldDate: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
});