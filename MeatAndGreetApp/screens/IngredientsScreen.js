import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

const mockIngredients = [
  { id: '1', name: 'Beef Slices', calories: 200, price: 5.0 },
  { id: '2', name: 'Pork Belly', calories: 250, price: 6.0 },
  { id: '3', name: 'Everbest Ring Roll', calories: 100, price: 5.05 },
];

const IngredientsScreen = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockIngredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => toggleSelection(item)}
            containerStyle={[
              selectedItems.includes(item) && styles.selected,
            ]}
          >
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>
                {`Calories: ${item.calories} kcal | $${item.price}`}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.CheckBox
              checked={selectedItems.includes(item)}
              onPress={() => toggleSelection(item)}
            />
          </ListItem>
        )}
      />
      <Button
        title="Add to Cart"
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('Cart', { selectedItems })}
      />
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  selected: { backgroundColor: '#FFEBEE' },
  button: { backgroundColor: '#4CAF50', margin: 20 },
});

export default IngredientsScreen;
