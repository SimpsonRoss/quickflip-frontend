import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ScannedItem } from "@/store";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface ItemListScreenProps {
  title: string;
  items: ScannedItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string, data: any) => void;
  renderItem: (item: ScannedItem) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  emptyStateConfig: {
    icon: string;
    title: string;
    description: string;
  };
}

export default function ItemListScreen({
  title,
  items,
  onDelete,
  onEdit,
  renderItem,
  renderHeader,
  emptyStateConfig,
}: ItemListScreenProps) {
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <IconSymbol 
        name={emptyStateConfig.icon} 
        size={64} 
        color="#666666" 
      />
      <Text style={styles.emptyStateTitle}>{emptyStateConfig.title}</Text>
      <Text style={styles.emptyStateDescription}>
        {emptyStateConfig.description}
      </Text>
    </View>
  );

  const renderFlatListItem = ({ item }: { item: ScannedItem }) => (
    <View style={styles.itemContainer}>
      {renderItem(item)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.itemCount}>{items.length}</Text>
      </View>
      
      {renderHeader && renderHeader()}

      <FlatList
        data={items}
        renderItem={renderFlatListItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContainer,
          items.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  itemCount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    marginBottom: 12,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
});