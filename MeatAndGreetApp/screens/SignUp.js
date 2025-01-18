import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !gender || !preferences) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', uid), { email, gender, preferences });

      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login'); // Redirect to Login screen
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred during sign-up.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up Page</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Gender Picker */}
      <Text style={styles.label}>Select Gender:</Text>
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      {/* Preferences Input */}
      <TextInput
        style={styles.input}
        placeholder="Preferences (e.g., I like to eat beef)"
        value={preferences}
        onChangeText={setPreferences}
      />

      {/* Sign Up Button */}
      <Button title="Sign Up" buttonStyle={styles.authButton} onPress={handleSignUp} />

      {/* Back to Login Button */}
      <Button
        title="Back to Login"
        buttonStyle={styles.backButton}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5, alignSelf: 'flex-start', marginLeft: '10%' },
  authButton: { backgroundColor: 'green', paddingHorizontal: 20, marginBottom: 10 },
  backButton: { backgroundColor: '#4285F4', paddingHorizontal: 20, marginBottom: 10 },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default SignUp;
