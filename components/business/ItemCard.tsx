import { IconSymbol } from '@/components/ui/IconSymbol';
import { KeyboardAwareProductCard } from '@/components/ui/KeyboardAwareProductCard';
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from '@/constants/theme';
import { ScannedItem } from '@/store';
import { ReactNode } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

interface ItemCardProps {
  item: ScannedItem;
  variant: 'scanned' | 'purchased' | 'sold';
  isEditMode?: boolean;
  onDelete?: (id: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  children?: ReactNode;
  style?: ViewStyle;
}

export function ItemCard({
  item,
  variant,
  isEditMode = false,
  onDelete,
  onFocus,
  onBlur,
  focused = false,
  children,
  style,
}: ItemCardProps) {
  const profit =
    item.priceSold != null && item.pricePaid != null
      ? item.priceSold - item.pricePaid
      : item.estimatedPrice != null && item.pricePaid != null
      ? item.estimatedPrice - item.pricePaid
      : null;

  const renderBadges = () => {
    switch (variant) {
      case 'sold':
        return (
          <>
            <View style={styles.soldBadge}>
              <IconSymbol name="checkmark.circle.fill" size={16} color="#FFFFFF" />
              <Text style={styles.soldBadgeText}>SOLD</Text>
            </View>
            {profit !== null && (
              <View
                style={[
                  styles.profitBadge,
                  { backgroundColor: profit >= 0 ? Colors.success : Colors.error },
                ]}
              >
                <Text style={styles.profitBadgeText}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(0)}
                </Text>
              </View>
            )}
          </>
        );
      case 'purchased':
        return profit !== null ? (
          <View
            style={[
              styles.profitBadge,
              { backgroundColor: profit >= 0 ? Colors.success : Colors.error },
            ]}
          >
            <Text style={styles.profitBadgeText}>
              {profit >= 0 ? '+' : ''}
              {profit.toFixed(0)}
            </Text>
          </View>
        ) : null;
      case 'scanned':
        return (
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const CardWrapper = variant === 'scanned' ? View : KeyboardAwareProductCard;
  const cardProps = variant === 'scanned' 
    ? { style: [styles.card, style] }
    : { 
        style: [styles.card, style], 
        focused, 
        onFocus, 
        onBlur 
      };

  return (
    <CardWrapper {...cardProps}>
      {/* Delete Button */}
      {isEditMode && onDelete && (
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { backgroundColor: '#CC0000' },
          ]}
          onPress={() => onDelete(item.id)}
        >
          <IconSymbol name="xmark" size={14} color="#FFFFFF" />
        </Pressable>
      )}

      {/* Item Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.uri }} style={styles.itemImage} />
        {renderBadges()}
      </View>

      {/* Item Content */}
      <View style={styles.itemContent}>
        <ItemTitle item={item} />
        <ItemMetadata item={item} variant={variant} />
        {children}
      </View>
    </CardWrapper>
  );
}

function ItemTitle({ item }: { item: ScannedItem }) {
  return (
    <Text style={styles.itemTitle} numberOfLines={2}>
      {item.title || 'Untitled Item'}
    </Text>
  );
}

function ItemMetadata({ item, variant }: { item: ScannedItem; variant: string }) {
  switch (variant) {
    case 'sold':
      return (
        <Text style={styles.soldDate}>
          Sold on {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      );
    case 'purchased':
    case 'scanned':
      return item.condition ? (
        <View style={styles.conditionContainer}>
          <IconSymbol name="checkmark.seal" size={14} color={Colors.success} />
          <Text style={styles.conditionText}>
            {variant === 'scanned' ? 'Condition: ' : ''}
            {item.condition}
          </Text>
        </View>
      ) : null;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    ...Shadows.card,
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
    ...Shadows.medium,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.surfaceSecondary,
  },
  soldBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  soldBadgeText: {
    ...Typography.labelMedium,
    color: Colors.textInverse,
  },
  profitBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  profitBadgeText: {
    ...Typography.labelMedium,
    color: Colors.textInverse,
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
    ...Typography.label,
    color: Colors.textInverse,
  },
  itemContent: {
    padding: Spacing.lg,
  },
  itemTitle: {
    ...Typography.bodySemiBold,
    marginBottom: Spacing.sm,
  },
  soldDate: {
    ...Typography.caption,
    marginBottom: Spacing.md,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  conditionText: {
    ...Typography.captionMedium,
    color: Colors.success,
  },
});