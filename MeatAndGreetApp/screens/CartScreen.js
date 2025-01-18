import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const CartScreen = ({ route }) => {
  const { selectedItems } = route.params || { selectedItems: [] };

  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.name} - ${item.price.toFixed(2)}
          </Text>
        )}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { fontSize: 18, marginBottom: 10 },
  total: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
});

export default CartScreen;
