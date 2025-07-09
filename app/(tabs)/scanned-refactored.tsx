import { EmptyState } from '@/components/shared/EmptyState';
import { ItemCard } from '@/components/shared/ItemCard';
import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Design';
import { useEditMode } from '@/hooks/useEditMode';
import { useItemActions } from '@/hooks/useItemActions';
import { getConfidenceLevel } from '@/lib/utils';
import { useStore } from '@/store';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannedScreen() {
  const allItems = useStore((state) => state.items);
  const scannedItems = allItems.filter((i) => !i.purchased && !i.sold);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  
  const { editMode, toggleEditMode } = useEditMode(scannedItems, {});
  const { handleDelete, handleConfirmPurchase, handleClearScannedItems } = useItemActions();

  const handleConfirm = (id: string) => {
    const priceText = priceInputs[id];
    if (handleConfirmPurchase(id, priceText)) {
      setPriceInputs((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const renderScannedItemContent = (item: any) => {
    const isLoading = !item.title || !item.description;
    const confidence = getConfidenceLevel(item.priceCount);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Analyzing item...</Text>
        </View>
      );
    }

    return (
      <View style={styles.scannedContent}>
        {item.priceCount != null && (
          <View style={styles.confidenceRow}>
            <View style={[styles.confidenceBadge, { backgroundColor: `${confidence.color}15` }]}>
              <View style={[styles.confidenceDot, { backgroundColor: confidence.color }]} />
              <Text style={[styles.confidenceText, { color: confidence.color }]}>
                {confidence.level} confidence
              </Text>
            </View>
            <Text style={styles.salesCountText}>({item.priceCount} sales)</Text>
          </View>
        )}

        {/* Purchase Input Section */}
        <View style={styles.purchaseSection}>
          <Text style={styles.purchaseLabel}>Purchase Price</Text>
          <View style={styles.purchaseInputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={Colors.textSecondary}
                value={priceInputs[item.id] ?? ''}
                onChangeText={(text) =>
                  setPriceInputs((prev) => ({ ...prev, [item.id]: text }))
                }
              />
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && { opacity: 0.8 },
                !priceInputs[item.id] && styles.confirmButtonDisabled,
              ]}
              onPress={() => handleConfirm(item.id)}
              disabled={!priceInputs[item.id]}
            >
              <IconSymbol name="checkmark" size={16} color={Colors.surface} />
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title="Scanned Items"
        itemCount={scannedItems.length}
        badgeColor={Colors.primary}
        editMode={editMode}
        onEditPress={toggleEditMode}
      />

      <FlatList
        data={scannedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            editMode={editMode}
            onDelete={handleDelete}
            variant="scanned"
          >
            {renderScannedItemContent(item)}
          </ItemCard>
        )}
        ListEmptyComponent={
          <EmptyState
            iconName="camera"
            title="No Scanned Items"
            description="Use the Camera tab to scan items and they will appear here"
          />
        }
        contentContainerStyle={
          scannedItems.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Clear All Button */}
      {editMode && scannedItems.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.floatingClearButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleClearScannedItems}
          >
            <IconSymbol name="trash" size={20} color={Colors.surface} />
            <Text style={styles.floatingClearButtonText}>Clear All</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    paddingTop: 0,
  },
  emptyListContainer: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: 0,
  },
  scannedContent: {
    gap: Spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
    ...Typography.footnoteMedium,
  },
  salesCountText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  purchaseSection: {
    gap: Spacing.sm,
  },
  purchaseLabel: {
    ...Typography.captionSemibold,
    color: Colors.text,
  },
  purchaseInputContainer: {
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
  priceInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  confirmButtonText: {
    ...Typography.captionSemibold,
    color: Colors.surface,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  floatingClearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderRadius: 25,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  floatingClearButtonText: {
    ...Typography.bodySemibold,
    color: Colors.surface,
  },
});