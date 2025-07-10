import { Colors, Layout } from '@/constants/theme';
import { ReactNode } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    ListRenderItem,
    Platform,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenLayoutProps<T> {
  children?: ReactNode;
  data?: T[];
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (item: T) => string;
  ListHeaderComponent?: ReactNode;
  ListEmptyComponent?: ReactNode;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  header?: ReactNode;
}

export function ScreenLayout<T>({
  children,
  data,
  renderItem,
  keyExtractor,
  ListHeaderComponent,
  ListEmptyComponent,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  style,
  contentContainerStyle,
  header,
}: ScreenLayoutProps<T>) {
  const hasData = data && data.length > 0;
  const isEmpty = data && data.length === 0;

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Optional Header */}
        {header && <View style={styles.headerContainer}>{header}</View>}

        {/* Render as FlatList if data is provided */}
        {data && renderItem ? (
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={[
              isEmpty ? styles.emptyListContainer : styles.listContainer,
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          />
        ) : (
          /* Render as regular children */
          <View style={[styles.contentContainer, contentContainerStyle]}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listContainer: {
    padding: Layout.screenPadding,
    paddingBottom: 32,
    paddingTop: 0,
  },
  emptyListContainer: {
    flexGrow: 1,
    padding: Layout.screenPadding,
    paddingTop: 0,
  },
  contentContainer: {
    flex: 1,
    padding: Layout.screenPadding,
  },
});