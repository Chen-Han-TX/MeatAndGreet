import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Meat And Greet!</Text>
      <Text style={styles.subtitle}>Plan the perfect hotpot with ease.</Text>
      <Button
        title="Start Planning"
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('Ingredients')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  button: { backgroundColor: '#FF5722', paddingHorizontal: 30 },
});

export default HomeScreen;
