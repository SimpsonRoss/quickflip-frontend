import { Alert } from "react-native";
import { useStore } from "../store";

export const useItemActions = () => {
  const deleteItem = useStore(state => state.deleteItem);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteItem(id),
      },
    ]);
  };

  return { handleDelete };
};