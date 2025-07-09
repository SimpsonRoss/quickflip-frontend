import { BorderRadius, Colors, Spacing, Typography } from "@/constants/Design";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  itemCount: number;
  badgeColor?: string;
  showEditButton?: boolean;
  editMode?: boolean;
  onEditPress?: () => void;
  editButtonText?: string;
}

export const ScreenHeader = ({
  title,
  itemCount,
  badgeColor = Colors.primary,
  showEditButton = true,
  editMode = false,
  onEditPress,
  editButtonText,
}: ScreenHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={[styles.itemCountBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.itemCountText}>{itemCount}</Text>
          </View>
        </View>
        {showEditButton && itemCount > 0 && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
          >
            <Text style={styles.editButtonText}>
              {editButtonText || (editMode ? "Save" : "Edit")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.lg,
    paddingBottom: 0,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.text,
    marginRight: Spacing.md,
  },
  itemCountBadge: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 24,
    alignItems: "center",
  },
  itemCountText: {
    ...Typography.captionSemibold,
    color: Colors.surface,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  editButtonText: {
    ...Typography.captionSemibold,
    color: Colors.surface,
  },
});