import React from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/store';

export default function SoldScreen() {
  const allItems = useStore((state) => state.items);
  const updateStore = useStore.setState;
  const items = allItems.filter((i) => i.sold);

  const totalRevenue = items.reduce((sum, i) => sum + (i.priceSold ?? 0), 0);
  const totalCost = items.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);
  const totalProfit = totalRevenue - totalCost;

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
      <Text style={styles.header}>Sold Items: {items.length}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const profit =
            item.priceSold != null && item.pricePaid != null
              ? item.priceSold - item.pricePaid
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
              <Text style={styles.paid}>Paid: ${item.pricePaid?.toFixed(2)}</Text>
              <Text style={styles.sold}>Sold for: ${item.priceSold?.toFixed(2)}</Text>
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
  paid: { fontSize: 14, marginTop: 4 },
  sold: { fontSize: 14, marginTop: 2 },
  profit: { fontSize: 14, marginTop: 2, fontWeight: '600' },
  totals: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 12,
  },
});
