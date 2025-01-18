import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // your Firestore instance
import IngredientTimer from './ryantoh/Timer';

const TimerScreen = ({ room }) => {
  // Local state to hold your ingredients
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    // If we don't have a valid room ID, return early
    if (!room?.id) return;

    // 1) Set up a listener on the room doc
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
              weight: details.weight || '',
              imgURL: details.imgURL || '',
              time: details.time,
              calories: details.calories || 0,
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


    // 3) Cleanup listener on unmount
    return () => unsubscribe();
  }, [room?.id]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <IngredientTimer ingredients={ingredients} />
    </SafeAreaView>
  );
};

export default TimerScreen;


