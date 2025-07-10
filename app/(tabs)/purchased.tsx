import { ActionSection } from '@/components/business/ActionSection';
import { ItemCard } from '@/components/business/ItemCard';
import { PriceSection } from '@/components/business/PriceSection';
import { SummaryCards, createPurchasedSummary } from '@/components/business/SummaryCards';
import { EmptyState } from '@/components/layout/EmptyState';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useEditMode } from '@/hooks/useEditMode';
import { useItemActions } from '@/hooks/useItemActions';
import { useKeyboardAwareCards } from '@/hooks/useKeyboardAwareCards';
import { useStore } from '@/store';
import { useState } from 'react';

export default function PurchasedScreen() {
  const allItems = useStore((state) => state.items);
  const items = allItems.filter((i) => i.purchased && !i.sold);
  
  const [inputMap, setInputMap] = useState<{ [id: string]: string }>({});
  const { editMode, localValues, updateLocalValue, toggleEditMode, exitEditMode } = useEditMode(items);
  const { handleDelete, handleConfirmSale, handleSaveEdit } = useItemActions();
  const { handleCardFocus, handleCardBlur, isCardFocused } = useKeyboardAwareCards();

  // Calculate summary data
  const totalPaid = items.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);
  const totalResale = items.reduce((sum, i) => sum + (i.estimatedPrice ?? 0), 0);

  const handleEdit = () => {
    if (editMode) {
      handleSaveEdit(localValues, exitEditMode);
    } else {
      toggleEditMode();
    }
  };

  const handleSaleConfirm = (id: string) => {
    const success = handleConfirmSale(id, inputMap[id], () => {
      setInputMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });
  };

  const renderItem = ({ item }) => (
    <ItemCard
      item={item}
      variant="purchased"
      isEditMode={editMode}
      onDelete={handleDelete}
      onFocus={() => handleCardFocus(item.id)}
      onBlur={handleCardBlur}
      focused={isCardFocused(item.id)}
    >
      <PriceSection
        item={item}
        variant="purchased"
        editMode={editMode}
        localValues={localValues[item.id]}
        onValueChange={(field, value) => updateLocalValue(item.id, field, value)}
      />
      
      {!editMode && (
        <ActionSection
          type="sale"
          value={inputMap[item.id] ?? ''}
          onValueChange={(value) => setInputMap((prev) => ({ ...prev, [item.id]: value }))}
          onConfirm={() => handleSaleConfirm(item.id)}
          disabled={!inputMap[item.id]}
        />
      )}
    </ItemCard>
  );

  return (
    <ScreenLayout
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      header={
        <ScreenHeader
          title="Purchased Items"
          itemCount={items.length}
          badgeVariant="primary"
          showEditButton
          editMode={editMode}
          onEditPress={handleEdit}
        />
      }
      ListHeaderComponent={
        <SummaryCards cards={createPurchasedSummary(totalPaid, totalResale)} />
      }
      ListEmptyComponent={
        <EmptyState
          iconName="bag"
          title="No Purchased Items"
          description="Items you purchase will appear here, ready to be sold"
        />
      }
    />
  );
}