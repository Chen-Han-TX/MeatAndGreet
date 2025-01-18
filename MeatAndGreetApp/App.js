// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { auth } from './firebaseConfig';

import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import * as Clipboard from 'expo-clipboard';
import 'react-native-get-random-values';


import LoginSignUp from './screens/LoginSignUp';
import HomeScreen from './screens/HomeScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/SettingsScreen';


import TimerScreen from './screens/TimerScreen';
// import FairpriceScraper from './screens/ryantoh/FairpriceScraper';
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
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [preferencesCompleted, setPreferencesCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  if (!user || !preferencesCompleted) {
    return (
      <LoginSignUp onPreferencesSaved={() => setPreferencesCompleted(true)} />
    );
  }

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
            <HomeScreen {...props} room={room} setRoom={setRoom} />
          )}
        </Tab.Screen>


        {/* Conditional Tab Rendering */}
        {room && (
          <Tab.Screen
            name="Ingredients"
            listeners={{
              tabPress: (e) => {
                if (!room) {
                  e.preventDefault();
                  Alert.alert('Room Required', 'Please create a room first!');
                }
              },
            }}
          >
            {(props) => <IngredientsScreen {...props} room={room} />}
          </Tab.Screen>
        )}

        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Setting" component={SettingsScreen} />

        <Tab.Screen name="Setting">
          {(props) => <SettingsScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="fairpriceTest" component={FairpriceScraper} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // Add styles here if needed
});

export default App;
