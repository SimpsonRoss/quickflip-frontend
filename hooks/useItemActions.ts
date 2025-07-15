import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useStore } from "../store";

export const useItemActions = () => {
  const deleteItem = useStore((state) => state.deleteItem);

  const handleDelete = (
    id: string,
    onDeleteCallback?: (id: string) => void
  ) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await deleteItem(id);
          // Call optional callback for local state cleanup
          onDeleteCallback?.(id);
        },
      },
    ]);
  };

  return { handleDelete };
};
