import { IconSymbol } from "@/components/ui/IconSymbol";
import { KeyboardAwareProductCard } from "@/components/ui/KeyboardAwareProductCard";
import useKeyboardAwareCards from "@/hooks/useKeyboardAwareCards";
import { ScannedItem, useStore } from "@/store";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SoldScreen() {
  const allItems = useStore((state) => state.items);
  const updateItem = useStore((state) => state.updateItem);
  const deleteItem = useStore((state) => state.deleteItem);
  const items = allItems.filter((i) => i.sold);

  const [editMode, setEditMode] = useState(false);
  const [localValues, setLocalValues] = useState<{
    [id: string]: { pricePaid: string; priceSold: string };
  }>({});

  const { handleCardFocus, handleCardBlur, isCardFocused } =
    useKeyboardAwareCards();

  // Initialize local values when entering edit mode
  useEffect(() => {
    if (editMode) {
      const initialValues: typeof localValues = {};
      items.forEach((item) => {
        initialValues[item.id] = {
          pricePaid:
            typeof item.pricePaid === "number" && !isNaN(item.pricePaid)
              ? item.pricePaid.toFixed(2)
              : "",
          priceSold:
            typeof item.priceSold === "number" && !isNaN(item.priceSold)
              ? item.priceSold.toFixed(2)
              : "",
        };
      });
      setLocalValues(initialValues);
    }
  }, [editMode]);

  const totalRevenue = items.reduce(
    (sum, i) => sum + (Number(i.priceSold) || 0),
    0
  );
  const totalCost = items.reduce(
    (sum, i) => sum + (Number(i.pricePaid) || 0),
    0
  );
  const totalProfit = totalRevenue - totalCost;
  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Calculate average profit percentage across all items
  const averageProfitPercentage =
    items.length > 0
      ? items.reduce((sum, item) => {
          if (item.pricePaid && item.priceSold && item.pricePaid > 0) {
            const profitPercent =
              ((item.priceSold - item.pricePaid) / item.pricePaid) * 100;
            return sum + profitPercent;
          }
          return sum;
        }, 0) / items.length
      : 0;

  const handleSave = async () => {
    try {
      const updatePromises = Object.entries(localValues).map(
        async ([id, values]) => {
          const pricePaid = parseFloat(values.pricePaid);
          const priceSold = parseFloat(values.priceSold);
          const updated: Partial<ScannedItem> = {};
          if (!isNaN(pricePaid)) updated.pricePaid = pricePaid;
          if (!isNaN(priceSold)) updated.priceSold = priceSold;

          if (Object.keys(updated).length > 0) {
            await updateItem(id, updated);
          }
        }
      );

      await Promise.all(updatePromises);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save updates:", error);
      // Still exit edit mode even if some updates failed
      setEditMode(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await deleteItem(id);
          // Clean up local values to prevent update attempts on deleted items
          setLocalValues((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
          });
        },
      },
    ]);
  };

  const renderBasicHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Sold Items</Text>
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

  const renderAnalyticsCards = () => (
    <View style={styles.analyticsSection}>
      {/* Analytics Cards */}
      <View style={styles.analyticsContainer}>
        <View style={[styles.analyticsCard, styles.revenueCard]}>
          <View style={styles.analyticsIconContainer}>
            <IconSymbol
              name="dollarsign.circle.fill"
              size={24}
              color="#34C759"
            />
          </View>
          <Text style={styles.analyticsValue}>
            $
            {typeof totalRevenue === "number" && !isNaN(totalRevenue)
              ? totalRevenue.toFixed(2)
              : "0.00"}
          </Text>
          <Text style={styles.analyticsLabel}>Total Revenue</Text>
        </View>

        <View style={[styles.analyticsCard, styles.profitCard]}>
          <View style={styles.analyticsIconContainer}>
            <IconSymbol
              name={
                totalProfit >= 0
                  ? "chart.line.uptrend.xyaxis"
                  : "chart.line.downtrend.xyaxis"
              }
              size={24}
              color={totalProfit >= 0 ? "#34C759" : "#FF3B30"}
            />
          </View>
          <Text
            style={[
              styles.analyticsValue,
              { color: totalProfit >= 0 ? "#34C759" : "#FF3B30" },
            ]}
          >
            $
            {typeof totalProfit === "number" && !isNaN(totalProfit)
              ? totalProfit.toFixed(2)
              : "0.00"}
          </Text>
          <Text style={styles.analyticsLabel}>Total Profit</Text>
          <Text
            style={[
              styles.analyticsSubtext,
              { color: totalProfit >= 0 ? "#34C759" : "#FF3B30" },
            ]}
          >
            {profitMargin >= 0 ? "+" : ""}
            {typeof profitMargin === "number" && !isNaN(profitMargin)
              ? profitMargin.toFixed(1)
              : "0.0"}
            % margin
          </Text>
        </View>
      </View>

      {items.length > 0 && (
        <View style={styles.summaryDetailContainer}>
          <View style={styles.summaryDetailRow}>
            <Text style={styles.summaryDetailLabel}>Items Sold</Text>
            <Text style={styles.summaryDetailValue}>{items.length}</Text>
          </View>
          <View style={styles.summaryDetailRow}>
            <Text style={styles.summaryDetailLabel}>Total Cost</Text>
            <Text style={styles.summaryDetailValue}>
              $
              {typeof totalCost === "number" && !isNaN(totalCost)
                ? totalCost.toFixed(2)
                : "0.00"}
            </Text>
          </View>
          <View style={styles.summaryDetailRow}>
            <Text style={styles.summaryDetailLabel}>Average Profit</Text>
            <Text
              style={[
                styles.summaryDetailValue,
                {
                  color: averageProfitPercentage >= 0 ? "#34C759" : "#FF3B30",
                },
              ]}
            >
              {averageProfitPercentage >= 0 ? "+" : ""}
              {typeof averageProfitPercentage === "number" &&
              !isNaN(averageProfitPercentage)
                ? averageProfitPercentage.toFixed(1)
                : "0.0"}
              %
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <IconSymbol name="creditcard" size={48} color="#8E8E93" />
      </View>
      <Text style={styles.emptyTitle}>No Sales Yet</Text>
      <Text style={styles.emptyDescription}>
        Items you sell will appear here with profit analytics
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: ScannedItem }) => {
    const profit =
      item.priceSold != null && item.pricePaid != null
        ? item.priceSold - item.pricePaid
        : null;

    const profitPercentage = item.pricePaid
      ? ((profit || 0) / item.pricePaid) * 100
      : 0;
    const soldDate = new Date(item.timestamp).toLocaleDateString();
    const values = localValues[item.id] ?? { pricePaid: "", priceSold: "" };

    return (
      <KeyboardAwareProductCard
        style={styles.itemCard}
        focused={isCardFocused(item.id)}
        onFocus={() => handleCardFocus(item.id)}
        onBlur={handleCardBlur}
      >
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
          <Image
            source={{ uri: item.imageUrl || item.uri }}
            style={styles.itemImage}
          />

          {/* Success Badge */}
          <View style={styles.soldBadge}>
            <IconSymbol
              name="checkmark.circle.fill"
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.soldBadgeText}>SOLD</Text>
          </View>

          {/* Profit Badge */}
          {profit !== null && (
            <View
              style={[
                styles.profitBadge,
                { backgroundColor: profit >= 0 ? "#34C759" : "#FF3B30" },
              ]}
            >
              <Text style={styles.profitBadgeText}>
                {profit >= 0 ? "+" : ""}${profit.toFixed(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Item Content */}
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title || "Untitled Item"}
          </Text>

          <Text style={styles.soldDate}>Sold on {soldDate}</Text>

          {/* Financial Summary */}
          <View style={styles.financialContainer}>
            <View style={styles.financialRow}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Cost</Text>
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
                  <Text style={styles.financialValue}>
                    $
                    {typeof item.pricePaid === "number" &&
                    !isNaN(item.pricePaid)
                      ? item.pricePaid.toFixed(2)
                      : "—"}
                  </Text>
                )}
              </View>

              <View style={styles.financialDivider} />

              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Sold For</Text>
                {editMode ? (
                  <View style={styles.editInputWrapper}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.editInput}
                      keyboardType="numeric"
                      value={values.priceSold}
                      onChangeText={(text) =>
                        setLocalValues((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], priceSold: text },
                        }))
                      }
                    />
                  </View>
                ) : (
                  <Text style={[styles.financialValue, { color: "#34C759" }]}>
                    $
                    {typeof item.priceSold === "number" &&
                    !isNaN(item.priceSold)
                      ? item.priceSold.toFixed(2)
                      : "—"}
                  </Text>
                )}
              </View>
            </View>

            {profit !== null && (
              <View style={styles.profitSummaryContainer}>
                <View style={styles.profitSummaryRow}>
                  <View style={styles.profitSummaryLeft}>
                    <Text style={styles.profitSummaryLabel}>Net Profit</Text>
                    <View style={styles.profitPerformanceContainer}>
                      <IconSymbol
                        name={
                          profit >= 0 ? "arrow.up.right" : "arrow.down.right"
                        }
                        size={12}
                        color={profit >= 0 ? "#34C759" : "#FF3B30"}
                      />
                      <Text
                        style={[
                          styles.profitPerformanceText,
                          { color: profit >= 0 ? "#34C759" : "#FF3B30" },
                        ]}
                      >
                        {profitPercentage >= 0 ? "+" : ""}
                        {typeof profitPercentage === "number" &&
                        !isNaN(profitPercentage)
                          ? profitPercentage.toFixed(1)
                          : "0.0"}
                        %
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.profitSummaryValue,
                      { color: profit >= 0 ? "#34C759" : "#FF3B30" },
                    ]}
                  >
                    $
                    {typeof profit === "number" && !isNaN(profit)
                      ? profit.toFixed(2)
                      : "0.00"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareProductCard>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Sticky Header */}
        {renderBasicHeader()}

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderAnalyticsCards}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            items.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  keyboardAvoidingView: {
    flex: 1,
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
    backgroundColor: "#34C759",
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
  analyticsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  revenueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  profitCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3864bb",
  },
  analyticsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  analyticsSubtext: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  summaryDetailContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  summaryDetailLabel: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  summaryDetailValue: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
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
  soldBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#34C759",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  soldBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  profitBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
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
    marginBottom: 6,
    lineHeight: 24,
  },
  soldDate: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
  },
  financialContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },
  financialRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  financialItem: {
    flex: 1,
    alignItems: "center",
  },
  financialDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },
  financialLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  profitSummaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  profitSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profitSummaryLeft: {
    flex: 1,
  },
  profitSummaryLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 4,
  },
  profitPerformanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profitPerformanceText: {
    fontSize: 12,
    fontWeight: "600",
  },
  profitSummaryValue: {
    fontSize: 20,
    fontWeight: "700",
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
    minWidth: 120,
  },
  dollarSign: {
    fontSize: 16,
    color: "#8E8E93",
    marginRight: 4,
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 8,
  },
  analyticsSection: {
    paddingTop: 16,
    paddingBottom: 20,
  },
});
