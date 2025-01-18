import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'react-native-elements';
import HomeScreen from './screens/HomeScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Icon } from 'react-native-elements';


const Tab = createBottomTabNavigator();

const App = () => {
  const theme = {
    colors: {
      primary: '#FF5722', // Hotpot red theme
      secondary: '#4CAF50', // Fresh green accents
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              const icons = {
                Home: 'home',
                Ingredients: 'list',
                Cart: 'shopping-cart',
                Settings: 'settings',
              };
              return (
                <Icon name={icons[route.name]} type="material" color={color} size={size} />
              );
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Ingredients" component={IngredientsScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
