import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ScannedItem } from "@/store";

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
  editMode?: boolean;
  onEditModeChange?: (editMode: boolean) => void;
  keyboardVerticalOffset?: number;
  showFloatingButton?: boolean;
  renderFloatingButton?: () => React.ReactNode;
  keyboardVisible?: boolean;
  onKeyboardVisibilityChange?: (visible: boolean) => void;
}

export function ItemListScreen({
  title,
  items,
  onDelete,
  onEdit,
  renderItem,
  renderHeader,
  emptyStateConfig,
  editMode = false,
  onEditModeChange,
  keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0,
  showFloatingButton = false,
  renderFloatingButton,
  keyboardVisible: propKeyboardVisible,
  onKeyboardVisibilityChange,
}: ItemListScreenProps) {
  const [internalKeyboardVisible, setInternalKeyboardVisible] = useState(false);
  
  // Use prop keyboard visibility if provided, otherwise use internal state
  const keyboardVisible = propKeyboardVisible !== undefined ? propKeyboardVisible : internalKeyboardVisible;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setInternalKeyboardVisible(true);
        onKeyboardVisibilityChange?.(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setInternalKeyboardVisible(false);
        onKeyboardVisibilityChange?.(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [onKeyboardVisibilityChange]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <IconSymbol 
          name={emptyStateConfig.icon} 
          size={48} 
          color="#8E8E93" 
        />
      </View>
      <Text style={styles.emptyTitle}>{emptyStateConfig.title}</Text>
      <Text style={styles.emptyDescription}>
        {emptyStateConfig.description}
      </Text>
    </View>
  );

  const renderItemWithWrapper = ({ item }: { item: ScannedItem }) => (
    <View key={item.id}>
      {renderItem(item)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {/* Sticky Header */}
        {renderHeader && renderHeader()}

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItemWithWrapper}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            items.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Floating Button - Hide when keyboard is visible */}
        {showFloatingButton && 
         renderFloatingButton && 
         editMode && 
         items.length > 0 && 
         !keyboardVisible && (
          <View style={styles.floatingButtonContainer}>
            {renderFloatingButton()}
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
    paddingTop: 0,
  },
  emptyListContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 0,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
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
    lineHeight: 22,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    left: 20,
    alignItems: "center",
  },
});