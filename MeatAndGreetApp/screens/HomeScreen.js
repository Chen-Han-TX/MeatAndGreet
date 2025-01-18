import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  doc, onSnapshot
} from 'firebase/firestore';
import 'react-native-get-random-values';
import * as Clipboard from 'expo-clipboard';

import { db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// 1. Import the LinearGradient component
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ room, setRoom, user }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [memberEmails, setMemberEmails] = useState([]);

  // Helper function for alerts
  const showAlert = (title, message) => {
    alert(`${title}: ${message}`);
  };

  // Ensure current user can see whenever the room updates
  useEffect(() => {
    if (!room?.id) {
      setRoom(null); // Clear room state if no room is selected
      return;
    }

    const roomRef = doc(db, 'rooms', room.id);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        setRoom({ id: docSnap.id, ...docSnap.data() });
        fetchMemberEmails(docSnap.data().members);
      } else {
        console.warn(`Room with ID ${room.id} no longer exists`);
        setRoom(null);
      }
    }, (error) => {
      console.error('Error listening to room updates:', error);
    });

    // Cleanup listener on component unmount or room change
    return () => unsubscribe();
  }, [room?.id]);

  // Fetch member emails from Firestore
  const fetchMemberEmails = async (memberIds) => {
    try {
      const emails = [];
      for (const memberId of memberIds) {
        const userRef = doc(db, 'users', memberId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          emails.push(userData.email);
        }
      }
      setMemberEmails(emails);
    } catch (error) {
      console.error('Error fetching member emails:', error);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showAlert('Signed Out', 'You have successfully signed out.');
      // Navigate to the login screen if necessary
    } catch (error) {
      console.error('Error signing out:', error);
      showAlert('Error', 'Failed to sign out. Please try again.');
    }
  };

  // Create a new room
  const startPlanning = async () => {
    if (room) {
      showAlert('Room Already Active', 'You already have an active room.');
      return;
    }
    try {
      const newRoom = {
        createdAt: new Date(),
        isActive: true,
        members: [user.uid],
      };

      // Add room to "rooms" collection
      const roomDocRef = await addDoc(collection(db, 'rooms'), newRoom);

      // Update local state
      setRoom({ id: roomDocRef.id, ...newRoom });

      // Update user's room reference
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        room: roomDocRef.id,
      });

      showAlert('Room Created', `Room Code: ${roomDocRef.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      showAlert('Error', 'Failed to create room. Please try again.');
    }
  };

  // Leave current room
  const handleLeaveRoom = async () => {
    if (!room?.id) {
      showAlert('Error', 'You are not currently in a room.');
      return;
    }

    try {
      const roomDocRef = doc(db, 'rooms', room.id);
      const roomDocSnap = await getDoc(roomDocRef);

      if (roomDocSnap.exists()) {
        let currentMembers = roomDocSnap.data().members || [];
        if (currentMembers.includes(user.uid)) {
          // Remove user from room
          currentMembers = currentMembers.filter((m) => m !== user.uid);

          // Update room's members
          await updateDoc(roomDocRef, { members: currentMembers });

          // Clear user's room in Firestore
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { room: null });

          // Clear local room state
          setRoom(null);
          showAlert('Success', 'You have left the room.');
        } else {
          showAlert('Error', 'You are not a member of this room.');
        }
      } else {
        showAlert('Error', 'The room no longer exists.');
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      showAlert('Error', 'Failed to leave the room. Please try again.');
    }
  };

  // Copy room ID to clipboard
  const shareRoom = () => {
    if (room) {
      Clipboard.setString(room.id);
      showAlert('Room ID Copied', 'The Room ID has been copied to your clipboard.');
    }
  };

  // Join an existing room
  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) {
      showAlert('Invalid Room ID', 'Please enter a valid Room ID.');
      return;
    }
    try {
      const roomDocRef = doc(db, 'rooms', roomIdInput.trim());
      const roomDocSnap = await getDoc(roomDocRef);

      if (roomDocSnap.exists()) {
        const existingRoom = { id: roomDocSnap.id, ...roomDocSnap.data() };
        setRoom(existingRoom);
        setModalVisible(false);

        // Update user's room reference
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { room: roomDocRef.id });

        // Add user to the room if not already present
        let currentMembers = existingRoom.members || [];
        if (!currentMembers.includes(user.uid)) {
          currentMembers.push(user.uid);
          await updateDoc(roomDocRef, { members: currentMembers });
        }

        showAlert('Success', 'You have joined the room.');
      } else {
        showAlert('Invalid Room', 'The room does not exist or is inactive.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      showAlert('Error', 'Failed to join the room. Please try again.');
    }
  };

  return (
    // 2. Use the LinearGradient as the background
    <LinearGradient colors={['#6DD5FA', '#FFFFFF']} style={styles.gradientBackground}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome, {user.email}!</Text>
        <Button
          title="Sign Out"
          buttonStyle={styles.signOutButton}
          onPress={handleSignOut}
          accessibilityLabel="Sign out of the app"
        />
      </View>

      {/* Main Content Card */}
      <View style={styles.card}>
        {room ? (
          <>
            <Text style={styles.cardTitle}>Room Created!</Text>
            <Text style={styles.subtitle}>Room ID: {room.id}</Text>

            <Button
              title="Share Room ID"
              buttonStyle={styles.shareButton}
              onPress={shareRoom}
              accessibilityLabel="Share the Room ID with others"
            />
            <Button
              title="Leave Room"
              buttonStyle={styles.leaveButton}
              onPress={handleLeaveRoom}
              accessibilityLabel="Leave the current room"
            />

            <Text style={styles.cardTitle}>Current Room Members:</Text>
            {memberEmails.length ? (
              memberEmails.map((email, index) => (
                <Text style={styles.memberEmail} key={index}>
                  {email}
                </Text>
              ))
            ) : (
              <Text style={styles.subtitle}>No other members yet.</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Welcome to Meat and Greet!</Text>
            <Text style={styles.subtitle}>Plan the perfect hotpot with ease.</Text>

            <Button
              title="Start Planning"
              buttonStyle={styles.startButton}
              onPress={startPlanning}
              accessibilityLabel="Create a new room to start planning"
            />
            <Button
              title="Join Room"
              buttonStyle={styles.joinButton}
              onPress={() => setModalVisible(true)}
              accessibilityLabel="Join an existing room"
            />
          </>
        )}
      </View>

      {/* Modal for Joining a Room */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Room ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Room ID (max 30 characters)"
              value={roomIdInput}
              onChangeText={setRoomIdInput}
              maxLength={30}
            />
            <Button
              title="Join"
              buttonStyle={styles.modalButton}
              onPress={handleJoinRoom}
              accessibilityLabel="Join the room with the entered ID"
            />
            <Button
              title="Cancel"
              type="outline"
              buttonStyle={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
              accessibilityLabel="Cancel joining a room"
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Background
  gradientBackground: {
    flex: 1,
    paddingTop: 40,
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 15,
    borderRadius: 5,
  },

  // Card
  card: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    // Shadow (iOS) + elevation (Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 5,
  },

  // Member list
  memberEmail: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },

  // Buttons inside card
  shareButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    width: '100%',
    borderRadius: 5,
  },
  leaveButton: {
    backgroundColor: '#F44336',
    marginTop: 10,
    width: '100%',
    borderRadius: 5,
  },
  startButton: {
    backgroundColor: '#FF5722',
    marginTop: 50,
    width: '100%',
    borderRadius: 5,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    marginTop: 30,
    width: '100%',
    borderRadius: 5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    // Shadow/elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 14,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    width: 200,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalCancelButton: {
    width: 200,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default HomeScreen;
