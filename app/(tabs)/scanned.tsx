import { useStore } from '@/store';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannedScreen() {
  const allItems = useStore((state) => state.items);
  const markPurchased = useStore((state) => state.markPurchased);
  const updateStore = useStore.setState;

  const scannedItems = allItems.filter((i) => !i.purchased && !i.sold);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

  const handleConfirm = (id: string) => {
    const rawPrice = priceInputs[id];
    const price = parseFloat(rawPrice);

    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid number greater than 0');
      return;
    }

    markPurchased(id, price);
    setPriceInputs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleClearScannedOnly = () => {
    updateStore((state) => ({
      items: state.items.filter((item) => item.purchased || item.sold),
    }));
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
      <Text style={styles.header}>Scanned Items: {scannedItems.length}</Text>

      <FlatList
        data={scannedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isLoading = !item.title || !item.description;
          let confidence: 'Low' | 'Medium' | 'High' = 'Low';
          const count = item.priceCount ?? 0;
          if (count >= 5 && count <= 10) confidence = 'Medium';
          else if (count > 10) confidence = 'High';

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
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#666" />
                  <Text style={styles.loadingText}>Fetching details...</Text>
                </View>
              ) : (
                <>
                  {item.title && <Text style={styles.title}>{item.title}</Text>}
                  {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                  {item.condition && (
                    <Text style={styles.condition}>Condition: {item.condition}</Text>
                  )}
                  {item.estimatedPrice != null && item.priceCount != null && (
                    <>
                      <Text style={styles.price}>
                        Avg sold price: ${item.estimatedPrice.toFixed(2)} ({item.priceCount} sales)
                      </Text>
                      <Text style={styles.confidence}>
                        Pricing confidence: {confidence}
                      </Text>
                    </>
                  )}

                  <Text style={styles.inlineLabel}>Price Paid:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="$0.00"
                    value={priceInputs[item.id] ?? ''}
                    onChangeText={(text) =>
                      setPriceInputs((prev) => ({ ...prev, [item.id]: text }))
                    }
                  />
                  <Button title="Confirm Purchase" onPress={() => handleConfirm(item.id)} />
                </>
              )}
            </View>
          );
        }}
      />

      {scannedItems.length > 0 && (
        <Button title="Clear Scanned Items" onPress={handleClearScannedOnly} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  image: { width: '100%', height: 200, borderRadius: 8 },
  timestamp: { fontSize: 12, marginTop: 8, color: '#888' },
  title: { fontSize: 16, fontWeight: '600', marginTop: 8, color: '#222' },
  description: { fontSize: 14, color: '#444', marginTop: 4 },
  condition: { fontSize: 14, color: '#555', marginTop: 4, fontStyle: 'italic' },
  price: { fontSize: 14, color: '#006400', marginTop: 8, fontWeight: '500' },
  confidence: { fontSize: 14, color: '#555', marginTop: 2, fontStyle: 'italic' },
  inlineLabel: { fontSize: 14, marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  loadingContainer: {
    marginTop: 12,
    marginBottom: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});
