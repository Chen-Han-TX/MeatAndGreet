import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const LoginSignUp = ({ onPreferencesSaved }) => {
  // State for authentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for user preferences modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [preferences, setPreferences] = useState('');

  // State to track the authenticated user
  const [user, setUser] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to handle user sign-up
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
  
      setUser({ uid, email }); // Set user state
      console.log('User signed up:', { uid, email });
  
      setModalVisible(true); // Show modal
      await setDoc(doc(db, 'users', uid), { email });
  

      console.log('Modal visibility set to true');
    } catch (error) {
      console.error('Sign-up error:', error.message);
      Alert.alert('Error', error.message || 'An error occurred during sign-up. Please try again.');
    }
  };
  

  // Function to handle user login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Save user state and fetch preferences
      setUser({ uid, email });
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (!userDoc.exists()) {
        setModalVisible(true); // Show preferences modal if no preferences exist
      } else {
        onPreferencesSaved && onPreferencesSaved(); // Notify parent component
      }
    } catch (error) {
      console.error('Login error:', error.message);
      Alert.alert('Error', error.message || 'An error occurred during login. Please try again.');
    }
  };

  // Function to save user preferences
  const savePreferences = async () => {
    if (!gender || !preferences) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), { gender, preferences }, { merge: true });
      Alert.alert('Success', 'Your preferences have been saved.');
      setModalVisible(false); // Hide modal
      onPreferencesSaved && onPreferencesSaved(); // Notify parent component
    } catch (error) {
      console.error('Error saving preferences:', error.message);
      Alert.alert('Error', 'Could not save preferences. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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

      {/* Sign Up and Login Buttons */}
      <Button title="Sign Up" buttonStyle={styles.authButton} onPress={handleSignUp} />
      <Button title="Login" buttonStyle={styles.authButton} onPress={handleLogin} />

      {/* Modal for User Preferences */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tell Us About Yourself</Text>

            {/* Gender Picker */}
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>

            {/* Preferences Input */}
            <TextInput
              style={styles.input}
              placeholder="Preferences (e.g., I like to eat beef)"
              value={preferences}
              onChangeText={setPreferences}
            />

            {/* Save Button */}
            <Button title="Save" buttonStyle={styles.modalButton} onPress={savePreferences} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  authButton: { backgroundColor: '#4285F4', paddingHorizontal: 20, marginBottom: 10 },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalButton: { backgroundColor: '#4CAF50', width: 200 },
  picker: { height: 50, width: 200, marginBottom: 15 },
});

export default LoginSignUp;

