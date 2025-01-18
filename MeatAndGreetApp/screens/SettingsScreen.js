import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const SettingsScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
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
      <Text style={styles.subtitle}>Your Hotpot Preferences</Text>

      {/* Display user email */}
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{userData.email || 'Not available'}</Text>

      {/* Display user preferences */}
      <Text style={styles.label}>Preferences:</Text>
      <Text style={styles.value}>{userData.preferences || 'Not available'}</Text>

      {/* Display user gender */}
      <Text style={styles.label}>Gender:</Text>
      <Text style={styles.value}>{userData.gender || 'Not specified'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, color: '#555' },
  error: { fontSize: 16, color: 'red', marginTop: 20 },
});

export default SettingsScreen;
