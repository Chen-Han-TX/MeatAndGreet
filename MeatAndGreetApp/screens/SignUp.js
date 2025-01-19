import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Button, Input} from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import {LinearGradient} from "expo-linear-gradient";

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
        <LinearGradient
            // Matching the gradient colors from the Login screen
            colors={['#ffafbd', '#ffc3a0']}
            style={styles.gradientBackground}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Sign Up</Text>

                {/* Email Input */}
                <Input
                    placeholder="Email"
                    leftIcon={{ type: 'material', name: 'email', color: '#999' }}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Password Input */}
                <Input
                    placeholder="Password"
                    leftIcon={{ type: 'material', name: 'lock', color: '#999' }}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
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
                <Input
                    placeholder="Preferences (e.g: Beef, Enoki Mushroom, Quail Eggs)"
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                    value={preferences}
                    onChangeText={setPreferences}
                />

                {/* Sign Up Button */}
                <Button
                    title="Sign Up"
                    buttonStyle={styles.authButton}
                    onPress={handleSignUp}
                />

                {/* Back to Login Button */}
                <Button
                    title="Back to Login"
                    type="clear"
                    titleStyle={styles.backText}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputText: {
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 15,
    },
    authButton: {
        backgroundColor: '#28A745',
        borderRadius: 5,
        marginVertical: 10,
        width: 200
    },
    backText: {
        color: '#007BFF',
        fontSize: 16,
    },
});


export default SignUp;
