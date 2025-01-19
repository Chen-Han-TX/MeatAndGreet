import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable, Modal, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // your Firestore db
import { recommendItems } from './cbh/hotpotItemRecommender';
import AddIngredientModal from './ingredientCRUD/AddIngredient';
import EditIngredientModal from './ingredientCRUD/EditIngredient';
import * as Clipboard from 'expo-clipboard';
import ImFeelingLuckyModal from "./ingredientCRUD/ImFeelingLucky";
import { recommendItem } from "./cbh/luckyItemRecommender";

const IngredientsScreen = ({ room }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  
  // For controlling the Add & Edit & ImFeelingLucky modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImFeelingLuckyModal, setShowImFeelingLuckyModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [ingredientToEdit, setIngredientToEdit] = useState(null);

  useEffect(() => {
    if (!room?.id) return;

    // 1) Set up an onSnapshot listener on the room document
    const roomDocRef = doc(db, 'rooms', room.id);
    const unsubscribe = onSnapshot(roomDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.data();
        if (Array.isArray(roomData.food)) {
          const newIngredients = roomData.food.map((itemObj, index) => {
            // itemObj example: { "Broccoli": { price: "1.99", weight: "200 g", imgURL: "..."} }
            const [title, details] = Object.entries(itemObj)[0];
            return {
              id: index.toString(),  // or any unique identifier
              name: title,
              price: details.price || 0,
              weight: details.weight || 'No weight given',
              imgURL: details.imgURL || '',
              calories: details.calories || 0,
              storeURL: details.storeURL || '',
            };
          });
          setIngredients(newIngredients);
        } else {
          setIngredients([]);
        }
      } else {
        setIngredients([]); // Document doesn't exist
      }
    });

    // 2) Cleanup by unsubscribing when the component unmounts
    return () => unsubscribe();
  }, [room?.id]);

  // Toggles selection highlight in the FlatList
  const toggleSelection = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    Clipboard.setString(item.storeURL);
    alert("Item link copied to clipboard!");
  };

  const isSelected = (item) => selectedItems.includes(item);

  // -------------------------------------
  // C R E A T E
  // -------------------------------------
  const handleAddIngredient = async (newIngredient) => {
    try {
      // newIngredient = { name, price, weight, imgURL, calories }
      const roomDocRef = doc(db, 'rooms', room.id);
      // Convert the existing ingredients array into the "food" format
      const newFoodEntry = {
        [newIngredient.name]: {
          price: newIngredient.price,
          weight: newIngredient.weight,
          imgURL: newIngredient.imgURL,
          calories: newIngredient.calories,
        },
      };

      // Merge with existing "food" array
      const updatedFood = [
        ...ingredients.map((ing) => ({
          [ing.name]: {
            price: ing.price,
            weight: ing.weight,
            imgURL: ing.imgURL,
            calories: ing.calories,
          },
        })),
        newFoodEntry,
      ];

      // Update Firestore
      await updateDoc(roomDocRef, { food: updatedFood });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  const handleLuckyIngredient = async (ingredient) => {
    setShowImFeelingLuckyModal(false);
    await recommendItem(room.id, ingredient)
  }

  // -------------------------------------
  // U P D A T E
  // -------------------------------------
  const handleOpenEdit = (ingredient) => {
    setIngredientToEdit(ingredient);
    setEditModalVisible(true);
  };

  const handleEditIngredient = async (updatedIngredient) => {
    try {
      const roomDocRef = doc(db, 'rooms', room.id);

      // Convert current 'ingredients' to Firestore format
      // but replace the one being edited
      const updatedFood = ingredients.map((ing) => {
        if (ing.id === updatedIngredient.id) {
          return {
            [updatedIngredient.name]: {
              price: updatedIngredient.price,
              weight: updatedIngredient.weight,
              imgURL: updatedIngredient.imgURL,
              calories: updatedIngredient.calories,
            },
          };
        }
        // otherwise keep it as is
        return {
          [ing.name]: {
            price: ing.price,
            weight: ing.weight,
            imgURL: ing.imgURL,
            calories: ing.calories,
          },
        };
      });

      await updateDoc(roomDocRef, { food: updatedFood });
      setEditModalVisible(false);
      setIngredientToEdit(null);
    } catch (error) {
      console.error('Error editing ingredient:', error);
    }
  };

  // -------------------------------------
  // D E L E T E
  // -------------------------------------
  const handleDeleteIngredient = async (ingredient) => {
    try {
      const roomDocRef = doc(db, 'rooms', room.id);

      // Filter out the item we want to delete
      const updatedFood = ingredients
        .filter((ing) => ing.id !== ingredient.id)
        .map((ing) => ({
          [ing.name]: {
            price: ing.price,
            weight: ing.weight,
            imgURL: ing.imgURL,
            calories: ing.calories,
          },
        }));

      await updateDoc(roomDocRef, { food: updatedFood });
      Alert.alert('Deleted', `Ingredient "${ingredient.name}" has been deleted.`);
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  // Example action buttons
  const renderItem = ({ item }) => (
    <Pressable
      style={[
        styles.listItem,
        isSelected(item) && styles.selected,
      ]}
      onPress={() => toggleSelection(item)}
      onLongPress={() => handleOpenEdit(item)} // open edit on long press
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {/* Sometimes item weight doesnt give actual weight */}
            {`${item.weight} | $${item.price}`}
          </Text>
          <Text style={styles.itemDetails}>
            {`Link to product: ${item.storeURL}`}
          </Text>
        </View>
        {/* Simple delete button */}
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeleteIngredient(item)}
        >
          <Text style={{ color: 'white' }}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredient Selection</Text>
      <Text style={styles.subtitle}>Tip: You may delete unwanted recommendations.</Text>
      <Text style={styles.subtitle}>Tip: You may also copy product link to your clipboard by clicking on the item!</Text>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Button
        title="Add New Ingredient"
        buttonStyle={styles.button}
        onPress={() => setShowAddModal(true)}
      />

      <Button
          title="Im Feeling Lucky!"
          buttonStyle={styles.button}
          onPress={() => setShowImFeelingLuckyModal(true)}
      />

      <Button
        title="Generate Group Recommendations"
        buttonStyle={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => {
          recommendItems(room.id);
        }}
      />

      {/* MODALS */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <AddIngredientModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddIngredient}
        />
      </Modal>

      <Modal
          visible={showImFeelingLuckyModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImFeelingLuckyModal(false)}
      >
        <ImFeelingLuckyModal
            onClose={() => setShowImFeelingLuckyModal(false)}
            onSubmit={handleLuckyIngredient}
        />
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        {ingredientToEdit && (
          <EditIngredientModal
            ingredient={ingredientToEdit}
            onClose={() => setEditModalVisible(false)}
            onSave={handleEditIngredient}
          />
        )}
      </Modal>
    </View>
  );
};

export default IngredientsScreen;

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
  button: { backgroundColor: '#4CAF50', margin: 10 },
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
});
