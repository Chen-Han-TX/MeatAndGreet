import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import * as Clipboard from 'expo-clipboard';
import 'react-native-get-random-values';

import HomeScreen from './screens/HomeScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/SettingsScreen';
import TimerScreen from './screens/TimerScreen'
import { Icon } from 'react-native-elements';

import { Settings } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const IngredientsStack = ({ room }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="IngredientsScreen"
      options={{ headerShown: false }}
    >
      {(props) => <IngredientsScreen {...props} room={room} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const App = () => {
  const [room, setRoom] = useState(null);

  const startPlanning = async () => {
    try {
      const newRoom = {
        createdAt: new Date(),
        roomId: uuidv4(),
        isActive: true, // Mark as active
      };
      const docRef = await addDoc(collection(db, 'rooms'), newRoom);
      const createdRoom = { id: docRef.id, ...newRoom };

      setRoom(createdRoom);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const leaveRoom = async () => {
    try {
      if (room) {
        const roomDocRef = doc(db, 'rooms', room.id);
        await updateDoc(roomDocRef, { isActive: false }); // Mark room as inactive
        setRoom(null);
        alert('Room marked as inactive.');
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      alert('Error leaving the room. Please try again.');
    }
  };

  const shareRoom = () => {
    if (room) {
      const roomId = room.roomId;
      Clipboard.setStringAsync(roomId);
      alert('Room ID copied to clipboard!');
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Home: 'home',
              Ingredients: 'list',
              Cart: 'shopping-cart',
              Setting: 'settings',
                Timer: 'schedule',
            };
            return (
              <Icon name={icons[route.name]} type="material" color={color} size={size} />
            );
          },
          tabBarActiveTintColor: '#FF5722',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              room={room}
              startPlanning={startPlanning}
              leaveRoom={leaveRoom}
              shareRoom={shareRoom}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Ingredients"
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (!room) {
                e.preventDefault(); // Prevent navigation if room doesn't exist
                alert('Please create a room first!');
              }
            },
          })}
          options={{
            tabBarStyle: room ? {} : { display: 'none' }, // Hide tab when no room exists
          }}
        >
          {(props) => <IngredientsStack {...props} room={room} />}
        </Tab.Screen>

        <Tab.Screen name="Cart">
          {(props) => <CartScreen {...props} />}
        </Tab.Screen>

        <Tab.Screen name="Setting">
          {(props) => <Settings {...props} />}
        </Tab.Screen>
          <Tab.Screen name="Timer" component={TimerScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
