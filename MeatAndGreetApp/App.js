// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { auth } from './firebaseConfig';

import LoginSignUp from './screens/LoginSignUp';
import HomeScreen from './screens/HomeScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/SettingsScreen';

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
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // Add styles here if needed
});

export default App;
