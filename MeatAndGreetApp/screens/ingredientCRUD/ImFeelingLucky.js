import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

const ImFeelingLuckyModal = ({ onClose, onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        onSubmit(name); // Submit the name to the parent component.
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>I'm Feeling Lucky</Text>
                <Text style={styles.helperText}>
                    Enter a name, and this modal will return a random product based on your input.
                </Text>

                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: 'blue' }]} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: 'gray' }]} onPress={onClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ImFeelingLuckyModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    helperText: {
        fontSize: 14,
        marginBottom: 12,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 6,
        borderRadius: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
});
