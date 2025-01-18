import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable } from 'react-native';
import { Button } from 'react-native-elements';
import { recommendItems} from "./cbh/hotpotItemRecommender";

const mockIngredients = [
  { id: '1', name: 'Beef Slices', calories: 200, price: 5.0 },
  { id: '2', name: 'Pork Belly', calories: 250, price: 6.0 },
  { id: '3', name: 'Everbest Ring Roll', calories: 100, price: 5.05 },
];

const IngredientsScreen = ({ room }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const isSelected = (item) => selectedItems.includes(item);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredients Selection</Text>
      <Text style={styles.subtitle}>Room ID: {room?.roomId}</Text>
      <FlatList
        data={mockIngredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.listItem,
              isSelected(item) && styles.selected,
            ]}
            onPress={() => toggleSelection(item)}
          >
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {`Calories: ${item.calories} kcal | $${item.price}`}
              </Text>
            </View>
          </Pressable>
        )}
      />
        <Button title="Generate Recommendations" buttonStyle={styles.button} onPress={() =>
        {
            console.log(room);
            recommendItems(room.id)
        }}
        />
        <Button title="Confirm Selection" buttonStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 10 },
  listItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selected: { backgroundColor: '#FFEBEE', borderColor: '#FF5722' },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemDetails: { fontSize: 14, color: 'gray' },
  button: { backgroundColor: '#4CAF50', margin: 20 },
});

export default IngredientsScreen;
