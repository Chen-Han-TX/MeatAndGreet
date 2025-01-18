import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-elements';

const HomeScreen = ({ room, startPlanning, leaveRoom, shareRoom, joinRoom, navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');

  const handleJoinRoom = () => {
    if (!roomIdInput.trim()) {
      Alert.alert('Invalid Room ID', 'Please enter a valid Room ID.');
      return;
    }
    joinRoom(roomIdInput.trim());
    setModalVisible(false);
    setRoomIdInput(''); // Clear the input field
  };

  const handleInputChange = (text) => {
    // Limit input to 30 characters
    if (text.length <= 30) {
      setRoomIdInput(text);
    } else {
      Alert.alert('Character Limit Exceeded', 'Room ID must be 30 characters or less.');
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
          />
          <Button
            title="Leave Room"
            buttonStyle={styles.leaveButton}
            onPress={leaveRoom}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Welcome to Meat and Greet!</Text>
          <Text style={styles.subtitle}>Plan the perfect hotpot with ease.</Text>
          <Button
            title="Start Planning"
            buttonStyle={styles.startButton}
            onPress={() => startPlanning(navigation)}
          />
          <Button
            title="Join Room"
            buttonStyle={styles.joinButton}
            onPress={() => setModalVisible(true)}
          />
        </>
      )}

      {/* Modal for Joining a Room */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Room ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Room ID (max 30 characters)"
              value={roomIdInput}
              onChangeText={handleInputChange}
              maxLength={30} // Optional, enforces limit on the TextInput level
            />
            <Button
              title="Join"
              buttonStyle={styles.modalButton}
              onPress={handleJoinRoom}
            />
            <Button
              title="Cancel"
              type="outline"
              buttonStyle={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
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
