/*
Input: dictionary with ingredient name and time required
Output: vertical scroll with 2 ingredients per row and image of food

Specifications:

When the food is pressed, change to timer
When timer reaches 0, flash green and display "done"

*/
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

const Timer = ({ ingredients }) => {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const handlePress = (ingredient) => {
    setSelectedTimer(ingredient.name);
    setTimeLeft(ingredient.time);

    // Countdown timer logic
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setTimeLeft(null);
          setSelectedTimer(null);
          Alert.alert(`${ingredient.name} is done!`);
        }
        return prevTime - 1;
      });
    }, 1000);
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
        {isSelected && (
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

export default Timer;
