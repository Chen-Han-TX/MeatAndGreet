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
    const roomRef = doc(db, 'rooms', room.id);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.data();
        
        // 2) Transform Firestore data to the structure your Timer needs
        //    roomData.food is assumed to be an array of objects
        if (Array.isArray(roomData.food)) {
          const newIngredients = roomData.food.map((item, idx) => {
            // Each entry is something like { "Broccoli": { price: "1.99", weight: "200 g", imgURL: "..."} }
            const [title, details] = Object.entries(item)[0];

            // Return the shape expected by IngredientTimer
            return {
              name: title,
              time: 20, // default time
              image: details.imgURL || 'https://via.placeholder.com/80', // fallback
            };
          });

          setIngredients(newIngredients);
        } else {
          setIngredients([]); // if no valid food array
        }
      } else {
        // Document does not exist
        setIngredients([]);
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


