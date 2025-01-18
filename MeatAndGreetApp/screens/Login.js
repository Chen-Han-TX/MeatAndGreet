import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Import the gradient component from Expo
import { LinearGradient } from 'expo-linear-gradient';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Welcome back!');
      // Navigate to the home screen if desired
      // navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred during login.');
    }
  };

  return (
    <LinearGradient
      // Feel free to change the colors here
      colors={['#ffafbd', '#ffc3a0']}
      style={styles.gradientBackground}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

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

        {/* Login Button */}
        <Button
          title="Login"
          buttonStyle={styles.loginButton}
          onPress={handleLogin}
        />

        {/* Sign Up Button */}
        <Button
          title="Sign Up"
          type="clear"
          titleStyle={styles.signupText}
          onPress={() => navigation.navigate('SignUp')}
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
    width: '85%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    // Drop shadow (iOS) / elevation (Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#4285F4',
    width: 200,
    borderRadius: 5,
    marginVertical: 10,
  },
  signupText: {
    color: '#4285F4',
    fontSize: 16,
  },
});

export default Login;
