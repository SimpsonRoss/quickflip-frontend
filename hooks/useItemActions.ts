import { useStore } from '@/store';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

export function useItemActions() {
  const markPurchased = useStore((state) => state.markPurchased);
  const markSold = useStore((state) => state.markSold);
  const updateItem = useStore((state) => state.updateItem);
  const updateStore = useStore.setState;

  const handleDelete = (id: string, onConfirm?: () => void) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          updateStore((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
          onConfirm?.();
        },
      },
    ]);
  };

  const handleConfirmPurchase = (id: string, priceText: string, onSuccess?: () => void) => {
    const price = parseFloat(priceText);

    if (isNaN(price) || price <= 0) {
      Alert.alert(
        'Invalid price',
        'Please enter a valid number greater than 0'
      );
      return false;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markPurchased(id, price);
    onSuccess?.();
    return true;
  };

  const handleConfirmSale = (id: string, priceText: string, onSuccess?: () => void) => {
    const price = parseFloat(priceText);

    if (isNaN(price) || price <= 0) {
      Alert.alert(
        'Invalid price',
        'Please enter a valid number greater than 0'
      );
      return false;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markSold(id, price);
    onSuccess?.();
    return true;
  };

  const handleSaveEdit = (localValues: Record<string, any>, onComplete?: () => void) => {
    Object.entries(localValues).forEach(([id, values]) => {
      const updated: any = {};
      
      if (values.pricePaid) {
        const pricePaid = parseFloat(values.pricePaid);
        if (!isNaN(pricePaid)) updated.pricePaid = pricePaid;
      }
      
      if (values.priceSold) {
        const priceSold = parseFloat(values.priceSold);
        if (!isNaN(priceSold)) updated.priceSold = priceSold;
      }
      
      if (values.estimatedPrice) {
        const estimatedPrice = parseFloat(values.estimatedPrice);
        if (!isNaN(estimatedPrice)) updated.estimatedPrice = estimatedPrice;
      }
      
      if (Object.keys(updated).length > 0) {
        updateItem(id, updated);
      }
    });
    
    onComplete?.();
  };

  const handleClearAll = (items: any[], onConfirm?: () => void) => {
    Alert.alert(
      'Clear All Items',
      'This will permanently delete all items. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            updateStore((state) => ({
              items: state.items.filter((item) => !items.find(i => i.id === item.id)),
            }));
            onConfirm?.();
          },
        },
      ]
    );
  };

  return {
    handleDelete,
    handleConfirmPurchase,
    handleConfirmSale,
    handleSaveEdit,
    handleClearAll,
  };
}