import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import { collection, addDoc, updateDoc, getDoc, doc, setDoc } from 'firebase/firestore';
import 'react-native-get-random-values';
import * as Clipboard from 'expo-clipboard';
import { db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const HomeScreen = ({ room, setRoom, user }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');

  const showAlert = (title, message) => {
    alert(title + ": " + message);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Signed Out', 'You have successfully signed out.');
      // Redirect the user to the login screen or handle navigation
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const startPlanning = async () => {
    if (room) {
      showAlert('Room Already Active', 'You already have an active room.');
      return;
    }
    try {
      console.log(user);
      const newRoom = {
        createdAt: new Date(),
        isActive: true,
        members: [user.uid],
      };

      const roomDocRef = await addDoc(collection(db, "rooms"), newRoom);
      setRoom({ id: roomDocRef.id, ...newRoom });

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        room: roomDocRef.id
      })
      console.log(roomDocRef.id);
      showAlert('Room Created: Room Code', roomDocRef.id);
    } catch (error) {
      console.error('Error creating room:', error);
      showAlert('Error', 'Failed to create room. Please try again.');
    }
  };

  const handleLeaveRoom = async () => {
    if (!room?.id) {
      showAlert('Error', 'You are not currently in a room.');
      return;
    }

    try {
      const roomDocRef = doc(db, 'rooms', room.id);
      const roomDoc = await getDoc(roomDocRef);

      if (roomDoc.exists()) {
        // Remove the user from the room's members
        let currentMembers = roomDoc.data().members;

        if (currentMembers.includes(user.uid)) {
          currentMembers = currentMembers.filter((member) => member !== user.uid);

          // Update the Firestore document to remove the user
          await updateDoc(roomDocRef, {
            members: currentMembers,
          });

          // Clear the user's room reference
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            room: null,
          });

          // Clear the local room state
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


  const shareRoom = () => {
    if (room) {
      Clipboard.setString(room.id);
      showAlert('Room ID Copied', 'The Room ID has been copied to your clipboard.');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) {
      showAlert('Invalid Room ID', 'Please enter a valid Room ID.');
      console.log('Invalid Room ID');
      return;
    }
    try {
      const roomDocRef = doc(db, 'rooms', roomIdInput.trim());
      const roomDoc = await getDoc(roomDocRef);
      if (roomDoc.exists()) {
        setRoom({ id: roomDoc.id, ...roomDoc.data() });
        setModalVisible(false);

        // Set the users room to this room too
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          room: roomDocRef.id
        })

        // Add this user to this rooms members
        let currentMembers = roomDoc.data().members;
        if (!currentMembers.includes(user.uid)) {
          currentMembers.push(user.uid);

          // Update the Firestore document
          await updateDoc(roomDocRef, {
            members: currentMembers,
          });
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
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.email}!</Text>
        <Button
          title="Sign Out"
          buttonStyle={styles.signOutButton}
          onPress={handleSignOut}
          accessibilityLabel="Sign out of the app"
        />
      </View>

      {room ? (
        <>
          <Text style={styles.title}>Room Created!</Text>
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
        </>
      ) : (
        <>
          <Text style={styles.title}>Welcome to Meat and Greet!</Text>
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

      {/* Modal for Joining a Room */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'between', alignItems: 'center' },
  header: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: { fontSize: 18, fontWeight: 'bold' },
  emailText: { fontSize: 14, color: 'gray' },
  signOutButton: { backgroundColor: '#F44336', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20, marginTop: 10 },
  startButton: { backgroundColor: '#FF5722', marginTop: 50, width:200 },
  joinButton: { backgroundColor: '#4CAF50', marginTop: 30, width: 200 },
  shareButton: { backgroundColor: '#4CAF50', marginTop: 10, width: 200 },
  leaveButton: { backgroundColor: '#F44336', marginTop: 10, width: 200 },
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButton: { backgroundColor: '#4CAF50', width: 200 },
  modalCancelButton: { marginTop: 10, width: 200 },
});

export default HomeScreen;
