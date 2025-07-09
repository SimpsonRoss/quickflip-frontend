import { IconSymbol } from "@/components/ui/IconSymbol";
import { ScannedItem, useStore } from "@/store";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PurchasedScreen() {
  const allItems = useStore((state) => state.items);
  const markSold = useStore((state) => state.markSold);
  const updateItem = useStore((state) => state.updateItem);
  const updateStore = useStore.setState;
  const items = allItems.filter((i) => i.purchased && !i.sold);

  const [inputMap, setInputMap] = useState<{ [id: string]: string }>({});
  const [editMode, setEditMode] = useState(false);
  const [localValues, setLocalValues] = useState<{
    [id: string]: { pricePaid: string; estimatedPrice: string };
  }>({});

  // Initialize local values when entering edit mode
  useEffect(() => {
    if (editMode) {
      const initialValues: typeof localValues = {};
      items.forEach((item) => {
        initialValues[item.id] = {
          pricePaid: item.pricePaid?.toFixed(2) ?? "",
          estimatedPrice: item.estimatedPrice?.toFixed(2) ?? "",
        };
      });
      setLocalValues(initialValues);
    }
  }, [editMode]);

  const totalPaid = items.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);
  const totalResale = items.reduce(
    (sum, i) => sum + (i.estimatedPrice ?? 0),
    0
  );
  const totalProfit = totalResale - totalPaid;

  const handleConfirmSale = (id: string) => {
    const priceText = inputMap[id];
    const priceSold = parseFloat(priceText);

    if (isNaN(priceSold) || priceSold <= 0) {
      Alert.alert(
        "Invalid price",
        "Please enter a valid number greater than 0"
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markSold(id, priceSold);
    setInputMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

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

  const handleSave = () => {
    Object.entries(localValues).forEach(([id, values]) => {
      const pricePaid = parseFloat(values.pricePaid);
      const estimatedPrice = parseFloat(values.estimatedPrice);
      const updated: Partial<ScannedItem> = {};
      if (!isNaN(pricePaid)) updated.pricePaid = pricePaid;
      if (!isNaN(estimatedPrice)) updated.estimatedPrice = estimatedPrice;
      updateItem(id, updated);
    });
    setEditMode(false);
  };

  const renderBasicHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Purchased Items</Text>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{items.length}</Text>
          </View>
        </View>
        {items.length > 0 && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={editMode ? handleSave : () => setEditMode(true)}
          >
            <Text style={styles.editButtonText}>
              {editMode ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryIconContainer}>
          <IconSymbol name="creditcard" size={20} color="#3864bb" />
        </View>
        <Text style={styles.summaryValue}>${totalPaid.toFixed(2)}</Text>
        <Text style={styles.summaryLabel}>Total Invested</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIconContainer}>
          <IconSymbol name="dollarsign.circle" size={20} color="#34C759" />
        </View>
        <Text style={styles.summaryValue}>${totalResale.toFixed(2)}</Text>
        <Text style={styles.summaryLabel}>Est. Value</Text>
      </View>

      <View style={[styles.summaryCard, styles.profitCard]}>
        <View style={styles.summaryIconContainer}>
          <IconSymbol
            name={totalProfit >= 0 ? "arrow.up.circle" : "arrow.down.circle"}
            size={20}
            color={totalProfit >= 0 ? "#34C759" : "#FF3B30"}
          />
        </View>
        <Text
          style={[
            styles.summaryValue,
            { color: totalProfit >= 0 ? "#34C759" : "#FF3B30" },
          ]}
        >
          ${totalProfit.toFixed(2)}
        </Text>
        <Text style={styles.summaryLabel}>Potential Profit</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <IconSymbol name="bag" size={48} color="#8E8E93" />
      </View>
      <Text style={styles.emptyTitle}>No Purchased Items</Text>
      <Text style={styles.emptyDescription}>
        Items you purchase will appear here, ready to be sold
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: ScannedItem }) => {
    const profit =
      item.estimatedPrice != null && item.pricePaid != null
        ? item.estimatedPrice - item.pricePaid
        : null;

    const profitPercentage = item.pricePaid
      ? ((profit || 0) / item.pricePaid) * 100
      : 0;
    const values = localValues[item.id] ?? {
      pricePaid: "",
      estimatedPrice: "",
    };

    return (
      <View style={styles.itemCard}>
        {/* Delete Button - Only show in edit mode */}
        {editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && { backgroundColor: "#CC0000" },
            ]}
            onPress={() => handleDelete(item.id)}
          >
            <IconSymbol name="xmark" size={14} color="#FFFFFF" />
          </Pressable>
        )}

        {/* Item Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.itemImage} />
          {profit !== null && (
            <View
              style={[
                styles.profitBadge,
                { backgroundColor: profit >= 0 ? "#34C759" : "#FF3B30" },
              ]}
            >
              <Text style={styles.profitBadgeText}>
                {profit >= 0 ? "+" : ""}
                {profit.toFixed(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Item Content */}
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title || "Untitled Item"}
          </Text>

          {item.condition && (
            <View style={styles.conditionContainer}>
              <IconSymbol name="checkmark.seal" size={14} color="#34C759" />
              <Text style={styles.conditionText}>{item.condition}</Text>
            </View>
          )}

          {/* Price Information */}
          <View style={styles.priceInfoContainer}>
            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Paid</Text>
                {editMode ? (
                  <View style={styles.editInputWrapper}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.editInput}
                      keyboardType="numeric"
                      value={values.pricePaid}
                      onChangeText={(text) =>
                        setLocalValues((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], pricePaid: text },
                        }))
                      }
                    />
                  </View>
                ) : (
                  <Text style={styles.priceValue}>
                    ${item.pricePaid?.toFixed(2) ?? "—"}
                  </Text>
                )}
              </View>

              <View style={styles.priceDivider} />

              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Est. Value</Text>
                {editMode ? (
                  <View style={styles.editInputWrapper}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.editInput}
                      keyboardType="numeric"
                      value={values.estimatedPrice}
                      onChangeText={(text) =>
                        setLocalValues((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], estimatedPrice: text },
                        }))
                      }
                    />
                  </View>
                ) : (
                  <Text style={[styles.priceValue, { color: "#34C759" }]}>
                    ${item.estimatedPrice?.toFixed(2) ?? "—"}
                  </Text>
                )}
              </View>
            </View>

            {profit !== null && (
              <View style={styles.profitRow}>
                <Text style={styles.profitLabel}>Potential Profit</Text>
                <View style={styles.profitInfo}>
                  <Text
                    style={[
                      styles.profitValue,
                      { color: profit >= 0 ? "#34C759" : "#FF3B30" },
                    ]}
                  >
                    ${profit.toFixed(2)}
                  </Text>
                  <Text
                    style={[
                      styles.profitPercentage,
                      { color: profit >= 0 ? "#34C759" : "#FF3B30" },
                    ]}
                  >
                    ({profitPercentage >= 0 ? "+" : ""}
                    {profitPercentage.toFixed(0)}%)
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Sale Input Section */}
          <View style={styles.saleSection}>
            <Text style={styles.saleLabel}>Sale Price</Text>
            <View style={styles.saleInputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#8E8E93"
                  value={inputMap[item.id] ?? ""}
                  onChangeText={(text) =>
                    setInputMap((prev) => ({ ...prev, [item.id]: text }))
                  }
                />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.confirmButton,
                  pressed && { opacity: 0.8 },
                  !inputMap[item.id] && styles.confirmButtonDisabled,
                ]}
                onPress={() => handleConfirmSale(item.id)}
                disabled={!inputMap[item.id]}
              >
                <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>Sell</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Sticky Header */}
      {renderBasicHeader()}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderSummaryCards}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          items.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: 0, // Remove top padding since header is now outside
  },
  emptyListContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 0, // Remove top padding since header is now outside
  },
  headerContainer: {
    backgroundColor: "#F2F2F7", // Match container background
    paddingTop: 16,
    paddingBottom: 0,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginRight: 12,
  },
  itemCountBadge: {
    backgroundColor: "#3864bb",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#3864bb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  itemCountText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    paddingBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profitCard: {
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.2)",
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F2F2F7",
  },
  profitBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  profitBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  itemContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
    lineHeight: 24,
  },
  conditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  conditionText: {
    fontSize: 14,
    color: "#34C759",
    fontWeight: "500",
  },
  priceInfoContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceItem: {
    flex: 1,
    alignItems: "center",
  },
  priceDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  profitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  profitLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  profitInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profitValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  profitPercentage: {
    fontSize: 14,
    fontWeight: "500",
  },
  saleSection: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },
  saleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  saleInputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 12,
    height: 44,
  },
  dollarSign: {
    fontSize: 16,
    color: "#8E8E93",
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#34C759",
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonDisabled: {
    backgroundColor: "#8E8E93",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  editInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 12,
    height: 40,
    minWidth: 100,
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 8,
  },
});
