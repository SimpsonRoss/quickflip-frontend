# Shared Tab Components

## ItemListScreen Component

The `ItemListScreen` component is a shared, reusable component that extracts common functionality from tab screens, reducing code duplication and ensuring consistent behavior across all tabs.

### Benefits

- **Reduces tab screen files by ~70%** - Eliminates duplicate code for layout, keyboard handling, and empty states
- **Consistent behavior across tabs** - All tabs use the same core logic and styling
- **Single point of maintenance** - Updates and bug fixes only need to be made in one place
- **Flexible and extensible** - Allows customization through props and render functions

### Interface

```typescript
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
```

### Features

- **Keyboard handling** - Automatically handles keyboard show/hide events
- **Edit mode support** - Provides edit mode state management
- **Empty state rendering** - Configurable empty state with icon, title, and description
- **Floating button support** - Optional floating button that hides when keyboard is visible
- **Responsive layout** - Adapts to different screen sizes and keyboard states
- **Accessibility** - Built with accessibility best practices

### Usage Example

```typescript
import { ItemListScreen } from "@/components/shared/ItemListScreen";

export default function ScannedScreen() {
  const items = useStore((state) => state.items.filter(i => !i.purchased && !i.sold));
  const [editMode, setEditMode] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const renderItem = (item: ScannedItem) => (
    <View style={styles.itemCard}>
      {/* Your item rendering logic */}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Scanned Items</Text>
      <TouchableOpacity onPress={() => setEditMode(!editMode)}>
        <Text>{editMode ? "Done" : "Edit"}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFloatingButton = () => (
    <TouchableOpacity style={styles.floatingButton} onPress={handleClearAll}>
      <Text>Clear All</Text>
    </TouchableOpacity>
  );

  return (
    <ItemListScreen
      title="Scanned Items"
      items={items}
      onDelete={handleDelete}
      onEdit={handleEdit}
      renderItem={renderItem}
      renderHeader={renderHeader}
      emptyStateConfig={{
        icon: "camera",
        title: "No Scanned Items",
        description: "Use the Camera tab to scan items and they will appear here"
      }}
      editMode={editMode}
      onEditModeChange={setEditMode}
      showFloatingButton={true}
      renderFloatingButton={renderFloatingButton}
      keyboardVisible={keyboardVisible}
      onKeyboardVisibilityChange={setKeyboardVisible}
    />
  );
}
```

### Migration Guide

To migrate an existing tab screen to use the shared component:

1. **Import the shared component**:
   ```typescript
   import { ItemListScreen } from "@/components/shared/ItemListScreen";
   ```

2. **Extract item rendering logic** into a `renderItem` function
3. **Extract header logic** into a `renderHeader` function (optional)
4. **Extract floating button logic** into a `renderFloatingButton` function (optional)
5. **Configure empty state** with appropriate icon, title, and description
6. **Remove duplicate code** for SafeAreaView, KeyboardAvoidingView, FlatList, and keyboard handling

### Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Screen title for accessibility |
| `items` | `ScannedItem[]` | Yes | - | Array of items to display |
| `onDelete` | `(id: string) => void` | Yes | - | Function to handle item deletion |
| `onEdit` | `(id: string, data: any) => void` | Yes | - | Function to handle item editing |
| `renderItem` | `(item: ScannedItem) => React.ReactNode` | Yes | - | Function to render each item |
| `renderHeader` | `() => React.ReactNode` | No | - | Function to render header section |
| `emptyStateConfig` | `object` | Yes | - | Configuration for empty state display |
| `editMode` | `boolean` | No | `false` | Whether edit mode is active |
| `onEditModeChange` | `(editMode: boolean) => void` | No | - | Callback for edit mode changes |
| `keyboardVerticalOffset` | `number` | No | `90` (iOS), `0` (Android) | Keyboard avoidance offset |
| `showFloatingButton` | `boolean` | No | `false` | Whether to show floating button |
| `renderFloatingButton` | `() => React.ReactNode` | No | - | Function to render floating button |
| `keyboardVisible` | `boolean` | No | - | External keyboard visibility state |
| `onKeyboardVisibilityChange` | `(visible: boolean) => void` | No | - | Callback for keyboard visibility changes |

### Styling

The component includes comprehensive styling that matches the existing design system. All styles are contained within the component and follow the established patterns from the original tab screens.