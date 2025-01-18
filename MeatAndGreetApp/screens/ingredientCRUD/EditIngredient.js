// EditIngredientModal.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

const EditIngredientModal = ({ ingredient, onClose, onSave }) => {
  console.log("EditIngredientModal", ingredient)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [calories, setCalories] = useState('');
  const [time, setTime] = useState('');

  // Populate the fields from the passed 'ingredient'
  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name || '');
      setPrice(String(ingredient.price || ''));
      setWeight(ingredient.weight || '');
      setImgURL(ingredient.imgURL || '');
      setTime(ingredient.time || '');
      setCalories(String(ingredient.calories || ''));
    }
  }, [ingredient]);

  const handleSave = () => {
    const updatedIngredient = {
      ...ingredient,
      name,
      price,
      weight,
      time,
      imgURL,
      calories,
    };
    onSave(updatedIngredient);
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Edit Ingredient</Text>

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
        />
        <TextInput
          placeholder="Time (s)"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Image URL"
          value={imgURL}
          onChangeText={setImgURL}
          style={styles.input}
        />
        <TextInput
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'green' }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'gray' }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditIngredientModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 6,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
