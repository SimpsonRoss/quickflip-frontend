import { IconSymbol } from "@/components/ui/IconSymbol";
import { ScannedItem, useStore } from "@/store";
import { formatPriceWithSign } from "@/lib/priceUtils";
import { useItemActions } from "@/hooks/useItemActions";
import { cleanupInputState } from "@/lib/input-utils";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
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

export default function ScannedScreen() {
  const allItems = useStore((state) => state.items);
  const markPurchased = useStore((state) => state.markPurchased);
  const deleteItem = useStore((state) => state.deleteItem); // Still needed for bulk operations
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);

  const scannedItems = allItems.filter((i) => !i.purchased && !i.sold);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { handleDelete } = useItemActions();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleConfirm = (id: string) => {
    const rawPrice = priceInputs[id];
    const price = parseFloat(rawPrice);

    if (isNaN(price) || price <= 0) {
      Alert.alert(
        "Invalid price",
        "Please enter a valid number greater than 0"
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markPurchased(id, price);
    setPriceInputs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleClearScannedOnly = () => {
    Alert.alert(
      "Clear Scanned Items",
      "This will permanently delete all scanned (unpurchased) items. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            // Delete all scanned items from database
            const scannedItems = allItems.filter(
              (i) => !i.purchased && !i.sold
            );
            const deletePromises = scannedItems.map((item) =>
              deleteItem(item.id)
            );
            await Promise.all(deletePromises);
          },
        },
      ]
    );
  };

  const cleanupPriceInputs = (id: string) => {
    // Clean up price inputs to prevent any state issues
    cleanupInputState(setPriceInputs, id);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerMain}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Scanned Items</Text>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{scannedItems.length}</Text>
          </View>
        </View>

        {scannedItems.length > 0 && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(!editMode)}
          >
            <Text style={styles.editButtonText}>
              {editMode ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <IconSymbol name="camera" size={48} color="#8E8E93" />
      </View>
      <Text style={styles.emptyTitle}>No Scanned Items</Text>
      <Text style={styles.emptyDescription}>
        Use the Camera tab to scan items and they will appear here
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: ScannedItem }) => {
    const isLoading = !item.title && !item.description; // Loading if both are empty
    let confidence: "Low" | "Medium" | "High" = "Low";
    const count = item.priceCount ?? 0;
    if (count >= 5 && count <= 10) confidence = "Medium";
    else if (count > 10) confidence = "High";

    const confidenceColor =
      confidence === "High"
        ? "#34C759"
        : confidence === "Medium"
        ? "#FF9500"
        : "#8E8E93";

    return (
      <View style={styles.itemCard}>
        {/* Delete Button - Only show in edit mode */}
        {editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && { backgroundColor: "#CC0000" },
            ]}
            onPress={() => handleDelete(item.id, cleanupPriceInputs)}
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
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Item Content */}
        <View style={styles.itemContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3864bb" />
              <Text style={styles.loadingText}>Analyzing item...</Text>
            </View>
          ) : (
            <View style={styles.itemDetails}>
              {item.title && (
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              )}

              {item.description && (
                <Text style={styles.itemDescription} numberOfLines={3}>
                  {item.description}
                </Text>
              )}

              {item.condition && (
                <View style={styles.conditionContainer}>
                  <IconSymbol name="checkmark.seal" size={16} color="#34C759" />
                  <Text style={styles.conditionText}>
                    Condition: {item.condition}
                  </Text>
                </View>
              )}

              {item.estimatedPrice != null && item.priceCount != null && (
                <View style={styles.priceInfoContainer}>
                  <View style={styles.priceRow}>
                    <IconSymbol
                      name="dollarsign.circle"
                      size={16}
                      color="#34C759"
                    />
                    <Text style={styles.priceText}>
                      Est. Value: {formatPriceWithSign(item.estimatedPrice)}
                    </Text>
                  </View>
                  <View style={styles.confidenceRow}>
                    <View
                      style={[
                        styles.confidenceBadge,
                        { backgroundColor: `${confidenceColor}15` },
                      ]}
                    >
                      <View
                        style={[
                          styles.confidenceDot,
                          { backgroundColor: confidenceColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.confidenceText,
                          { color: confidenceColor },
                        ]}
                      >
                        {confidence} confidence
                      </Text>
                    </View>
                    <Text style={styles.salesCountText}>
                      (
                      {item.totalAvailable &&
                      item.totalAvailable > item.priceCount
                        ? `${item.priceCount}+`
                        : item.priceCount}{" "}
                      sales)
                    </Text>
                  </View>
                </View>
              )}

              {/* Purchase Input Section */}
              <View style={styles.purchaseSection}>
                <Text style={styles.purchaseLabel}>Purchase Price</Text>
                <View style={styles.purchaseInputContainer}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.priceInput}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#8E8E93"
                      value={priceInputs[item.id] ?? ""}
                      onChangeText={(text) =>
                        setPriceInputs((prev) => ({ ...prev, [item.id]: text }))
                      }
                    />
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.confirmButton,
                      pressed && { opacity: 0.8 },
                      !priceInputs[item.id] && styles.confirmButtonDisabled,
                    ]}
                    onPress={() => handleConfirm(item.id)}
                    disabled={!priceInputs[item.id]}
                  >
                    <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
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
        {renderHeader()}

        <FlatList
          data={scannedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            scannedItems.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Floating Clear All Button - Hide when keyboard is visible */}
        {editMode && scannedItems.length > 0 && !keyboardVisible && (
          <View style={styles.floatingButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.floatingClearButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleClearScannedOnly}
            >
              <IconSymbol name="trash" size={20} color="#FFFFFF" />
              <Text style={styles.floatingClearButtonText}>Clear All</Text>
            </Pressable>
          </View>
        )}
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
    paddingBottom: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  headerMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  itemCountText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  floatingClearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingClearButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
    height: 220,
    backgroundColor: "#F2F2F7",
  },
  timestampContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  itemContent: {
    padding: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  itemDetails: {
    gap: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 24,
  },
  itemDescription: {
    fontSize: 15,
    color: "#48484A",
    lineHeight: 21,
  },
  conditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  conditionText: {
    fontSize: 14,
    color: "#34C759",
    fontWeight: "500",
  },
  priceInfoContainer: {
    gap: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceText: {
    fontSize: 16,
    color: "#34C759",
    fontWeight: "600",
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "600",
  },
  salesCountText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  purchaseSection: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  purchaseLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  purchaseInputContainer: {
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
    backgroundColor: "#3864bb",
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#3864bb",
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
});
