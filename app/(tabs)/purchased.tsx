import React, { useState } from 'react';
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
  const updateStore = useStore.setState;
  const items = allItems.filter((i) => i.purchased && !i.sold);

  const [inputMap, setInputMap] = useState<{ [id: string]: string }>({});

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Purchased Items: {items.length}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const profit =
            item.estimatedPrice != null && item.pricePaid != null
              ? item.estimatedPrice - item.pricePaid
              : null;

          return (
            <View style={styles.item}>
              {/* ❌ Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>

              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              {item.condition && (
                <Text style={styles.condition}>Condition: {item.condition}</Text>
              )}
              <Text style={styles.paid}>Paid: ${item.pricePaid?.toFixed(2) ?? '—'}</Text>
              <Text style={styles.estimate}>
                Estimated resale: ${item.estimatedPrice?.toFixed(2) ?? '—'}
              </Text>
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

              <Text style={styles.label}>Sold for:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="$0.00"
                value={inputMap[item.id] ?? ''}
                onChangeText={(text) =>
                  setInputMap((prev) => ({ ...prev, [item.id]: text }))
                }
              />
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
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
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
  paid: { fontSize: 14, marginTop: 4 },
  estimate: { fontSize: 14, marginTop: 2 },
  profit: { fontSize: 14, marginTop: 2, fontWeight: '600' },
  totals: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
});
