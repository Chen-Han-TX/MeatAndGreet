import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Settings } from 'react-native';
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
import TimerScreen from './screens/TimerScreen';
import SettingsScreen from './screens/SettingsScreen';


const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once auth state is determined
    });
    return unsubscribe;
  }, []);

  if (loading) {
    // Show a loading indicator while Firebase determines the auth state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  // Render authentication flow if the user is not authenticated
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

  // Render main application flow if the user is authenticated
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Home: 'home',
              Ingredients: 'list',
              Timer: 'timer',
              Settings: 'settings',
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
        {room && (
          <Tab.Screen
            name="Timer"
            listeners={{
              tabPress: (e) => {
                if (!room) {
                  e.preventDefault();
                  Alert.alert('Room Required', 'Please create a room first!');
                }
              },
            }}
          >
            {(props) => <TimerScreen {...props} room={room} />}
          </Tab.Screen>
        )}
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default App;
