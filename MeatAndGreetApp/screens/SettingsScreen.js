import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const SettingsScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setEmail(data.email || '');
            setPreferences(data.preferences || '');
          } else {
            console.log('No user data found!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setUpdating(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { email, preferences }, { merge: true });
        Alert.alert('Success', 'Your preferences have been updated!');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Failed to update preferences. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.error}>Unable to fetch user data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Edit Your Preferences</Text>

      {/* Email (Read-only) */}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#f0f0f0' }]}
        value={email}
        editable={false}
      />

      {/* Preferences Input */}
      <Text style={styles.label}>Preferences:</Text>
      <TextInput
        style={styles.input}
        placeholder="Your preferences (e.g., I like beef)"
        value={preferences}
        onChangeText={setPreferences}
      />

      {/* Save Button */}
      <Button
        title={updating ? 'Saving...' : 'Save Preferences'}
        buttonStyle={styles.saveButton}
        onPress={handleSave}
        disabled={updating}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  saveButton: { backgroundColor: '#4CAF50', marginTop: 20 },
  error: { fontSize: 16, color: 'red', marginTop: 20 },
});

export default SettingsScreen;
