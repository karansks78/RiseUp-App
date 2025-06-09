/**
 * HomeScreen.js - Displays the main feed of posts.
 */

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebase';
import PostCard from '../components/PostCard';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { themeStyles, theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        Alert.alert('Error', 'Failed to fetch posts. Please try again later.');
      }
    };

    const fetchReels = async () => {
      try {
        const snapshot = await db.collection('reels').orderBy('createdAt', 'desc').get();
        const reelsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReels(reelsData);
      } catch (error) {
        console.error('Error fetching reels:', error);
        Alert.alert('Error', 'Failed to fetch reels. Please try again later.');
      }
    };

    const fetchStories = async () => {
      try {
        const snapshot = await db.collection('stories').orderBy('createdAt', 'desc').get();
        const storiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStories(storiesData);
      } catch (error) {
        console.error('Error fetching stories:', error);
        Alert.alert('Error', 'Failed to fetch stories. Please try again later.');
      }
    };

    Promise.all([fetchPosts(), fetchReels(), fetchStories()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const data = [...posts, ...reels].sort((a, b) => {
    const aCreatedAt = a.createdAt ? a.createdAt : 0;
    const bCreatedAt = b.createdAt ? b.createdAt : 0;
    return bCreatedAt - aCreatedAt;
  });

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <>
                <FlatList
                    horizontal
                    data={stories}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.storyContainer, { borderColor: themeStyles[theme].accentColor, borderWidth: 2 }]}>
                            <Image source={{ uri: item.content }} style={styles.storyMedia} />
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                    style={styles.storiesList}
                />
                <FlatList
                    data={data}
                    renderItem={({ item }) => <PostCard post={item} />}
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
  storiesList: {
    marginBottom: 10,
  },
  storyContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyMedia: {
    width: 80,
    height: 80,
    borderRadius: 40,
  }
});

export default HomeScreen;
