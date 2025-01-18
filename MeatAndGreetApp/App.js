import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';
import Cat from "./Components/Cat";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello?</Text>
      <Button>Hello</Button>
      <StatusBar style="auto" />
        <Cat />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
