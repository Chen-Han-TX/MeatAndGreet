import React from 'react';
import { SafeAreaView } from 'react-native';
import IngredientTimer from './ryantoh/IngredientTimer';

const ingredients = [
  { name: 'Broccoli', time: 60, image: 'https://via.placeholder.com/80' },
  { name: 'Carrot', time: 90, image: 'https://via.placeholder.com/80' },
  // Add more ingredients
];

const TimerScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <IngredientTimer ingredients={ingredients} />
    </SafeAreaView>
  );
};

export default TimerScreen;


