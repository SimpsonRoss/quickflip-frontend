import { Colors, Spacing, Typography, createBadgeStyle, createButtonStyle } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  itemCount?: number;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'neutral';
  showEditButton?: boolean;
  editMode?: boolean;
  onEditPress?: () => void;
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  itemCount,
  badgeVariant = 'primary',
  showEditButton = false,
  editMode = false,
  onEditPress,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.title}>{title}</Text>
          {itemCount !== undefined && (
            <View style={createBadgeStyle(badgeVariant)}>
              <Text style={styles.countText}>{itemCount}</Text>
            </View>
          )}
        </View>
        
        {showEditButton && itemCount && itemCount > 0 && (
          <TouchableOpacity
            style={createButtonStyle('primary', 'small')}
            onPress={onEditPress}
          >
            <Text style={styles.editButtonText}>
              {editMode ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.base,
    paddingBottom: 0,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...Typography.title,
    marginRight: Spacing.md,
  },
  countText: {
    ...Typography.labelMedium,
    color: Colors.textInverse,
  },
  editButtonText: {
    ...Typography.buttonSmall,
  },
});