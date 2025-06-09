/**
 * ChatScreen.js - Displays the list of chats and handles navigation to individual chat.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsQuery = query(
          collection(db, 'chats'),
          where('users', 'array-contains', auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
          const chatsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChats(chatsData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching chats:', error);
        Alert.alert('Error', 'Failed to fetch chats. Please try again later.');
      }
    };

    fetchChats();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('IndividualChat', { chatId: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default ChatScreen;
