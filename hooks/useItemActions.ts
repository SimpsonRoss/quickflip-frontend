import { validatePrice } from "@/lib/utils";
import { useStore } from "@/store";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

export const useItemActions = () => {
  const updateItem = useStore((state) => state.updateItem);
  const markPurchased = useStore((state) => state.markPurchased);
  const markSold = useStore((state) => state.markSold);
  const updateStore = useStore.setState;

  const handleDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          updateStore((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
        },
      },
    ]);
  };

  const handleConfirmPurchase = (id: string, priceText: string) => {
    const validation = validatePrice(priceText);
    
    if (!validation.isValid) {
      Alert.alert(
        "Invalid price",
        "Please enter a valid number greater than 0"
      );
      return false;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markPurchased(id, validation.value!);
    return true;
  };

  const handleConfirmSale = (id: string, priceText: string) => {
    const validation = validatePrice(priceText);
    
    if (!validation.isValid) {
      Alert.alert(
        "Invalid price",
        "Please enter a valid number greater than 0"
      );
      return false;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markSold(id, validation.value!);
    return true;
  };

  const handleSaveEdits = (localValues: any, editModeConfig: any) => {
    Object.entries(localValues).forEach(([id, values]: [string, any]) => {
      const updated: any = {};
      
      if (editModeConfig.pricePaid && values.pricePaid !== undefined) {
        const pricePaid = parseFloat(values.pricePaid);
        if (!isNaN(pricePaid)) updated.pricePaid = pricePaid;
      }
      
      if (editModeConfig.priceSold && values.priceSold !== undefined) {
        const priceSold = parseFloat(values.priceSold);
        if (!isNaN(priceSold)) updated.priceSold = priceSold;
      }
      
      if (editModeConfig.estimatedPrice && values.estimatedPrice !== undefined) {
        const estimatedPrice = parseFloat(values.estimatedPrice);
        if (!isNaN(estimatedPrice)) updated.estimatedPrice = estimatedPrice;
      }
      
      if (Object.keys(updated).length > 0) {
        updateItem(id, updated);
      }
    });
  };

  const handleClearScannedItems = () => {
    Alert.alert(
      "Clear Scanned Items",
      "This will permanently delete all scanned (unpurchased) items. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            updateStore((state) => ({
              items: state.items.filter((item) => item.purchased || item.sold),
            }));
          },
        },
      ]
    );
  };

  return {
    handleDelete,
    handleConfirmPurchase,
    handleConfirmSale,
    handleSaveEdits,
    handleClearScannedItems,
  };
};