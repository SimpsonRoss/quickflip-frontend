import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/store';

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

  // 🔧 Fix for infinite loop: Only run effect when entering edit mode
  useEffect(() => {
    if (editMode) {
      const initialValues: typeof localValues = {};
      items.forEach((item) => {
        initialValues[item.id] = {
          pricePaid: item.pricePaid?.toFixed(2) ?? '',
          estimatedPrice: item.estimatedPrice?.toFixed(2) ?? '',
        };
      });
      setLocalValues(initialValues);
    }
  }, [editMode]);

  const totalPaid = items.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);
  const totalResale = items.reduce((sum, i) => sum + (i.estimatedPrice ?? 0), 0);
  const totalProfit = totalResale - totalPaid;

  const handleConfirmSale = (id: string) => {
    const priceText = inputMap[id];
    const priceSold = parseFloat(priceText);
    if (isNaN(priceSold)) return;
    markSold(id, priceSold);
  };

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
      const estimatedPrice = parseFloat(values.estimatedPrice);
      const updated: Partial<typeof items[number]> = {};
      if (!isNaN(pricePaid)) updated.pricePaid = pricePaid;
      if (!isNaN(estimatedPrice)) updated.estimatedPrice = estimatedPrice;
      updateItem(id, updated);
    });
    setEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Purchased Items: {items.length}</Text>
        <TouchableOpacity onPress={editMode ? handleSave : () => setEditMode(true)}>
          <Text style={styles.editButton}>{editMode ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const profit =
            item.estimatedPrice != null && item.pricePaid != null
              ? item.estimatedPrice - item.pricePaid
              : null;

          const values = localValues[item.id] ?? { pricePaid: '', estimatedPrice: '' };

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
              {item.condition && (
                <Text style={styles.condition}>Condition: {item.condition}</Text>
              )}

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

              <Text style={styles.label}>Estimated Resale:</Text>
              {editMode ? (
                <View style={styles.inputRow}>
                  <Text style={styles.dollar}>$</Text>
                  <TextInput
                    style={styles.input}
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
                <Text style={styles.textValue}>${item.estimatedPrice?.toFixed(2) ?? '—'}</Text>
              )}

              {profit != null && (
                <Text
                  style={[
                    styles.profit,
                    { color: profit >= 0 ? '#006400' : '#B22222' },
                  ]}
                >
                  Estimated Profit: ${profit.toFixed(2)}
                </Text>
              )}

              <Text style={styles.label}>Sold for:</Text>
              <View style={styles.inputRow}>
                <Text style={styles.dollar}>$</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.00"
                  value={inputMap[item.id] ?? ''}
                  onChangeText={(text) =>
                    setInputMap((prev) => ({ ...prev, [item.id]: text }))
                  }
                />
              </View>
              <Button title="Confirm Sale" onPress={() => handleConfirmSale(item.id)} />
            </View>
          );
        }}
      />

      <View style={styles.totals}>
        <Text>Total paid: ${totalPaid.toFixed(2)}</Text>
        <Text>Total resale estimate: ${totalResale.toFixed(2)}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          Potential profit: ${totalProfit.toFixed(2)}
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
  condition: { fontSize: 14, fontStyle: 'italic', color: '#555' },
  label: { fontSize: 14, marginTop: 10, marginBottom: 4 },
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
  textValue: {
    fontSize: 14,
    marginBottom: 4,
  },
  profit: { fontSize: 14, marginTop: 2, fontWeight: '600' },
  totals: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 12,
  },
});
