import React, { useState } from 'react';
import { useStore } from '@/store';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { ItemCard } from '@/components/business/ItemCard';
import { PriceSection } from '@/components/business/PriceSection';
import { ActionSection } from '@/components/business/ActionSection';
import { useEditMode } from '@/hooks/useEditMode';
import { useItemActions } from '@/hooks/useItemActions';

export default function ScannedScreen() {
  const allItems = useStore((state) => state.items);
  const items = allItems.filter((i) => !i.purchased && !i.sold);
  
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const { editMode, toggleEditMode } = useEditMode(items);
  const { handleDelete, handleConfirmPurchase } = useItemActions();

  const handleConfirm = (id: string) => {
    const success = handleConfirmPurchase(id, priceInputs[id], () => {
      setPriceInputs((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });
  };

  const renderItem = ({ item }) => (
    <ItemCard
      item={item}
      variant="scanned"
      isEditMode={editMode}
      onDelete={handleDelete}
    >
      <PriceSection item={item} variant="scanned" />
      
      <ActionSection
        type="purchase"
        value={priceInputs[item.id] ?? ''}
        onValueChange={(value) => setPriceInputs((prev) => ({ ...prev, [item.id]: value }))}
        onConfirm={() => handleConfirm(item.id)}
        disabled={!priceInputs[item.id]}
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
          title="Scanned Items"
          itemCount={items.length}
          badgeVariant="warning"
          showEditButton
          editMode={editMode}
          onEditPress={toggleEditMode}
        />
      }
      ListEmptyComponent={
        <EmptyState
          iconName="camera"
          title="No Scanned Items"
          description="Use the Camera tab to scan items and they will appear here"
        />
      }
    />
  );
}