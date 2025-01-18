import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { collection, addDoc, updateDoc, getDoc, doc } from 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Clipboard from 'expo-clipboard';
import { db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const HomeScreen = ({ room, setRoom, navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Signed Out', 'You have successfully signed out.');
      // Redirect the user to the login screen or handle navigation
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const startPlanning = async () => {
    if (room) {
      showAlert('Room Already Active', 'You already have an active room.');
      return;
    }
    try {
      const newRoom = {
        createdAt: new Date(),
        roomId: uuidv4(),
        isActive: true,
      };
      const docRef = await addDoc(collection(db, 'rooms'), newRoom);
      setRoom({ id: docRef.id, ...newRoom });
      showAlert('Room Created', `Room ID: ${newRoom.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      showAlert('Error', 'Failed to create room. Please try again.');
    }
  };

  const leaveRoom = async () => {
    if (!room) {
      showAlert('No Active Room', 'You are not in a room.');
      return;
    }
    try {
      const roomDocRef = doc(db, 'rooms', room.id);
      await updateDoc(roomDocRef, { isActive: false });
      setRoom(null);
      showAlert('Room Left', 'You have successfully left the room.');
    } catch (error) {
      console.error('Error leaving room:', error);
      showAlert('Error', 'Failed to leave the room. Please try again.');
    }
  };

  const shareRoom = () => {
    if (room) {
      Clipboard.setString(room.roomId);
      showAlert('Room ID Copied', 'The Room ID has been copied to your clipboard.');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) {
      showAlert('Invalid Room ID', 'Please enter a valid Room ID.');
      return;
    }
    try {
      const roomDocRef = doc(db, 'rooms', roomIdInput.trim());
      const roomDoc = await getDoc(roomDocRef);
      if (roomDoc.exists() && roomDoc.data().isActive) {
        setRoom({ id: roomDoc.id, ...roomDoc.data() });
        showAlert('Success', 'You have joined the room.');
        setModalVisible(false);
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
      {room ? (
        <>
          <Text style={styles.title}>Room Created!</Text>
          <Text style={styles.subtitle}>Room ID: {room.roomId}</Text>

          <Button
            title="Share Room ID"
            buttonStyle={styles.shareButton}
            onPress={shareRoom}
            accessibilityLabel="Share the Room ID with others"
          />
          <Button
            title="Leave Room"
            buttonStyle={styles.leaveButton}
            onPress={leaveRoom}
            accessibilityLabel="Leave the current room"
          />
        </>
      ) : (
        <>
          <Button
            title="Sign Out"
            buttonStyle={styles.signOutButton}
            onPress={handleSignOut}
          />
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  startButton: { backgroundColor: '#FF5722', paddingHorizontal: 30 },
  joinButton: { backgroundColor: '#4CAF50', marginTop: 10, width: 200 },
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
