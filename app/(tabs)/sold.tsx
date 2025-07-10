
import React, { useState } from 'react';
import { useStore } from '@/store';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { ItemCard } from '@/components/business/ItemCard';
import { PriceSection } from '@/components/business/PriceSection';
import { SummaryCards, createSoldSummary, SummaryDetail } from '@/components/business/SummaryCards';
import { useEditMode } from '@/hooks/useEditMode';
import { useItemActions } from '@/hooks/useItemActions';
import { useKeyboardAwareCards } from '@/hooks/useKeyboardAwareCards';

export default function SoldScreen() {
  const allItems = useStore((state) => state.items);
  const items = allItems.filter((i) => i.sold);
  
  const { editMode, localValues, updateLocalValue, toggleEditMode, exitEditMode } = useEditMode(items);
  const { handleDelete, handleSaveEdit } = useItemActions();
  const { handleCardFocus, handleCardBlur, isCardFocused } = useKeyboardAwareCards();

  // Calculate analytics
  const totalRevenue = items.reduce((sum, i) => sum + (i.priceSold ?? 0), 0);
  const totalCost = items.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const handleEdit = () => {
    if (editMode) {
      handleSaveEdit(localValues, exitEditMode);
    } else {
      toggleEditMode();
    }
  };

  const renderItem = ({ item }) => (
    <ItemCard
      item={item}
      variant="sold"
      isEditMode={editMode}
      onDelete={handleDelete}
      onFocus={() => handleCardFocus(item.id)}
      onBlur={handleCardBlur}
      focused={isCardFocused(item.id)}
    >
      <PriceSection
        item={item}
        variant="sold"
        editMode={editMode}
        localValues={localValues[item.id]}
        onValueChange={(field, value) => updateLocalValue(item.id, field, value)}
      />
    </ItemCard>
  );

  return (
    <ScreenLayout
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      header={
        <ScreenHeader
          title="Sold Items"
          itemCount={items.length}
          badgeVariant="success"
          showEditButton
          editMode={editMode}
          onEditPress={handleEdit}
        />
      }
      ListHeaderComponent={
        <>
          <SummaryCards cards={createSoldSummary(totalRevenue, totalProfit, profitMargin)} />
          {items.length > 0 && (
            <SummaryDetail
              rows={[
                { label: 'Items Sold', value: items.length.toString() },
                { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` },
                { 
                  label: 'Average Profit', 
                  value: `${totalProfit >= 0 ? '+' : ''}${(totalProfit / items.length).toFixed(1)}%`,
                  valueColor: totalProfit >= 0 ? '#34C759' : '#FF3B30'
                },
              ]}
            />
          )}
        </>
      }
      ListEmptyComponent={
        <EmptyState
          iconName="creditcard"
          title="No Sales Yet"
          description="Items you sell will appear here with profit analytics"
        />
      }
    />
  );
}