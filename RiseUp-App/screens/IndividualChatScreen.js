/**
 * IndividualChatScreen.js - Displays the messages in a chat and allows the user to send new messages.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const IndividualChatScreen = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, 'chats', chatId, 'messages'),
          orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messagesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messagesData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to fetch messages. Please try again later.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim() !== '') {
      try {
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          text: newMessage,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });
        setNewMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
        Alert.alert("Error", "Failed to send message. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : messages.length === 0 ? (
        <Text style={styles.emptyChatText}>No messages yet.</Text>
      ) : (
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.userId === auth.currentUser.uid ? styles.currentUserMessage : styles.otherUserMessage
            ]}>
              <Text style={item.userId === auth.currentUser.uid ? styles.currentUserText : styles.otherUserText}>{item.text}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#eee',
  },
  currentUserMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  currentUserText: {
    color: '#000000',
  },
  otherUserText: {
    color: '#000000',
  },
  emptyChatText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888888',
  },
});

export default IndividualChatScreen;
