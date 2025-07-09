import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/store';

export default function SoldScreen() {
  const allItems = useStore((state) => state.items);
  const updateItem = useStore((state) => state.updateItem);
  const updateStore = useStore.setState;
  const items = allItems.filter((i) => i.sold);

  const [editMode, setEditMode] = useState(false);
  const [localValues, setLocalValues] = useState<{
    [id: string]: { pricePaid: string; priceSold: string };
  }>({});

  const totalRevenue = items.reduce((sum, i) => sum + (i.priceSold ?? 0), 0);
  const totalCost = items.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);
  const totalProfit = totalRevenue - totalCost;

  // ✅ Fix loop: only initialize when entering edit mode
  useEffect(() => {
    if (editMode) {
      const values: typeof localValues = {};
      items.forEach((item) => {
        values[item.id] = {
          pricePaid: item.pricePaid?.toFixed(2) ?? '',
          priceSold: item.priceSold?.toFixed(2) ?? '',
        };
      });
      setLocalValues(values);
    }
  }, [editMode]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          updateStore((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),
      },
    ]);
  };

  const handleSave = () => {
    Object.entries(localValues).forEach(([id, values]) => {
      const pricePaid = parseFloat(values.pricePaid);
      const priceSold = parseFloat(values.priceSold);
      const updated: Partial<typeof items[number]> = {};
      if (!isNaN(pricePaid)) updated.pricePaid = pricePaid;
      if (!isNaN(priceSold)) updated.priceSold = priceSold;
      updateItem(id, updated);
    });
    setEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Sold Items: {items.length}</Text>
        <TouchableOpacity onPress={editMode ? handleSave : () => setEditMode(true)}>
          <Text style={styles.editButton}>{editMode ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const profit =
            item.priceSold != null && item.pricePaid != null
              ? item.priceSold - item.pricePaid
              : null;

          const values = localValues[item.id] ?? { pricePaid: '', priceSold: '' };

          return (
            <View style={styles.item}>
              {editMode && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>×</Text>
                </TouchableOpacity>
              )}

              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.label}>Price Paid:</Text>
              {editMode ? (
                <View style={styles.inputRow}>
                  <Text style={styles.dollar}>$</Text>
                  <TextInput
                    style={styles.input}
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
                <Text style={styles.textValue}>${item.pricePaid?.toFixed(2) ?? '—'}</Text>
              )}

              <Text style={styles.label}>Sold For:</Text>
              {editMode ? (
                <View style={styles.inputRow}>
                  <Text style={styles.dollar}>$</Text>
                  <TextInput
                    style={styles.input}
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
                <Text style={styles.textValue}>${item.priceSold?.toFixed(2) ?? '—'}</Text>
              )}

              {profit != null && (
                <Text
                  style={[
                    styles.profit,
                    { color: profit >= 0 ? '#006400' : '#B22222' },
                  ]}
                >
                  Profit: ${profit.toFixed(2)}
                </Text>
              )}
            </View>
          );
        }}
      />

      <View style={styles.totals}>
        <Text>Total revenue: ${totalRevenue.toFixed(2)}</Text>
        <Text>Total cost: ${totalCost.toFixed(2)}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          Total profit: ${totalProfit.toFixed(2)}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: { fontSize: 20, fontWeight: 'bold' },
  editButton: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  item: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 16,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 1,
    backgroundColor: '#ff4444',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  image: { width: '100%', height: 180, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  label: { fontSize: 14, marginTop: 10, marginBottom: 4 },
  textValue: { fontSize: 14, marginBottom: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dollar: {
    fontSize: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
  },
  profit: { fontSize: 14, marginTop: 2, fontWeight: '600' },
  totals: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 12,
  },
});
