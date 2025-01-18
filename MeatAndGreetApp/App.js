import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { auth } from './firebaseConfig';
import 'react-native-get-random-values';

import Login from './screens/Login';
import SignUp from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/SettingsScreen';
// import FairpriceScraper from './screens/ryantoh/FairpriceScraper';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Authentication flow
  if (!user) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName="Login">
          <AuthStack.Screen name="Login" component={Login} />
          <AuthStack.Screen name="SignUp" component={SignUp} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  // Main application flow
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
            <HomeScreen {...props} room={room} user={user} setRoom={setRoom} />
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

        {/* Conditional Tab Rendering */}
        {/* {room && (
          <Tab.Screen
            name="Fairprice"
            listeners={{
              tabPress: (e) => {
                if (!room) {
                  e.preventDefault();
                  Alert.alert('Room Required', 'Please create a room first!');
                }
              },
            }}
          >
            {(props) => <FairpriceScraper {...props} room={FairpriceScraper} />}
          </Tab.Screen>
        )} */}

        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Setting" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
