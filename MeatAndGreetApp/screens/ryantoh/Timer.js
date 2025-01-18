import React, { useState } from 'react';
import { Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

const IngredientTimer = ({ ingredients }) => {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);

  const handlePress = (ingredient) => {
    // If there's an active timer, clear it
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Set which ingredient is selected
    setSelectedTimer(ingredient.name);

    // Convert time to an integer
    const timerDuration = parseInt(ingredient.time, 10) || 20; // default 20 if NaN
    setTimeLeft(timerDuration);

    // Start a new countdown
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setTimeLeft(null);
          setSelectedTimer(null);
          Alert.alert(`${ingredient.name} is done!`);
          return 0; 
        }
        return prevTime - 1;
      });
    }, 1000);

    // Save interval so we can clear it if user presses another ingredient
    setTimerInterval(intervalId);
  };

  const renderIngredient = ({ item }) => {
    const isSelected = selectedTimer === item.name;

    return (
      <TouchableOpacity
        style={[styles.ingredientCard, isSelected && styles.selectedCard]}
        onPress={() => handlePress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.ingredientImage} />
        <Text style={styles.ingredientText}>{item.name}</Text>
        {isSelected && timeLeft !== null && (
          <Text style={styles.timerText}>
            {timeLeft > 0 ? `${timeLeft}s` : 'Done!'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={ingredients}
      renderItem={renderIngredient}
      keyExtractor={(item) => item.name}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  ingredientCard: {
    flex: 1,
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#d4edda',
  },
  ingredientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#ff6347',
  },
});

export default IngredientTimer;