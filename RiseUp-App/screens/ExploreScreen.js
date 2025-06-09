/**
 * ExploreScreen.js - Allows users to search for other users.
 */

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import PostCard from '../components/PostCard';
import { ThemeContext } from '../context/ThemeContext';
import globalStyles from '../styles';

const ExploreScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { themeStyles, theme } = useContext(ThemeContext);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Search users
      const usersSnapshot = await db.collection('users')
        .where('username', '>=', searchTerm)
        .where('username', '<=', searchTerm + '\uf8ff')
        .get();
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);

      // Search posts
      const postsSnapshot = await db.collection('posts')
        .where('caption', '>=', searchTerm)
        .where('caption', '<=', searchTerm + '\uf8ff')
        .get();
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error searching users and posts:', error);
      Alert.alert('Error', 'Failed to search users and posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <TextInput
        style={globalStyles.input}
        placeholder="Search users and posts"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        placeholderTextColor={themeStyles[theme].textColor}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: themeStyles[theme].textColor }]}>Users</Text>
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.item, { backgroundColor: themeStyles[theme].backgroundColor, borderColor: themeStyles[theme].textColor }]}>
                <Text style={{ color: themeStyles[theme].textColor }}>{item.username}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />

          <Text style={[styles.sectionTitle, { color: themeStyles[theme].textColor }]}>Posts</Text>
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <PostCard post={item} />
            )}
            keyExtractor={item => item.id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default ExploreScreen;
