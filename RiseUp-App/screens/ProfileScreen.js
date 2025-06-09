/**
 * ProfileScreen.js - Displays user profile information and allows editing.
 */

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore';
import { ThemeContext } from '../context/ThemeContext';
import globalStyles from '../styles';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { logout } = useContext(AuthContext);
  const [rewarded, setRewarded] = useState(false);
  const { themeStyles, theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
          setRewarded(docSnap.data().rewarded || false);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      }
    };

    const fetchPostCount = async () => {
      try {
        const postsQuery = collection(db, 'posts');
        const q = query(postsQuery, where('userId', '==', auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          setPostCount(querySnapshot.size);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching post count:', error);
        Alert.alert('Error', 'Failed to fetch post count. Please try again later.');
      }
    };

    const fetchFollowerCount = async () => {
       try {
         const followersQuery = collection(db, 'users', auth.currentUser.uid, 'followers');
         const q = query(followersQuery);
         const unsubscribe = onSnapshot(q, (querySnapshot) => {
           setFollowerCount(querySnapshot.size);
         });
         return () => unsubscribe();
       } catch (error) {
         console.error('Error fetching follower count:', error);
         Alert.alert('Error', 'Failed to fetch follower count. Please try again later.');
       }
     };

     const fetchFollowingCount = async () => {
       try {
         const followingQuery = collection(db, 'users', auth.currentUser.uid, 'following');
         const q = query(followingQuery);
         const unsubscribe = onSnapshot(q, (querySnapshot) => {
           setFollowingCount(querySnapshot.size);
         });
         return () => unsubscribe();
       } catch (error) {
         console.error('Error fetching following count:', error);
         Alert.alert('Error', 'Failed to fetch following count. Please try again later.');
       }
     };

    useEffect(() => {
      if (user) {
        const followingRef = doc(db, 'users', auth.currentUser.uid, 'following', user.uid);
        const unsubscribe = onSnapshot(followingRef, (docSnap) => {
          setIsFollowing(docSnap.exists());
        });
        return () => unsubscribe();
      }
    }, [user]);

    fetchUser();
    fetchPostCount();
    fetchFollowerCount();
    fetchFollowingCount();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const followingRef = doc(db, 'users', auth.currentUser.uid, 'following', user.uid);
      const notificationRef = collection(db, 'notifications');

      if (isFollowing) {
        await updateDoc(userRef, {
          following: arrayRemove(user.uid)
        });
        await updateDoc(followingRef, {
          follower: arrayRemove(auth.currentUser.uid)
        });
        setIsFollowing(false);
      } else {
        await updateDoc(userRef, {
          following: arrayUnion(user.uid)
        });
        await updateDoc(followingRef, {
          follower: arrayUnion(auth.currentUser.uid)
        });
        setIsFollowing(true);

        // Create notification
        if (auth.currentUser.uid !== user.uid) {
          await addDoc(notificationRef, {
            type: 'follow',
            userId: user.uid,
            senderId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      Alert.alert('Error', 'Failed to follow/unfollow user. Please try again later.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      {user ? (
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }}
          />
          <Text style={[styles.username, { color: themeStyles[theme].textColor }]}>{user.username}</Text>
          <Text style={[styles.bio, { color: themeStyles[theme].textColor }]}>{user.bio}</Text>
          <Text style={{ color: themeStyles[theme].textColor }}>Posts: {postCount}</Text>
          <Text style={{ color: themeStyles[theme].textColor }}>Followers: {followerCount}</Text>
          <Text style={{ color: themeStyles[theme].textColor }}>Following: {followingCount}</Text>
          <Text style={{ color: themeStyles[theme].textColor }}>Rewarded: {rewarded ? 'Yes' : 'No'}</Text>
          {auth.currentUser.uid !== user.uid && (
            <TouchableOpacity style={[styles.followButton, { backgroundColor: themeStyles[theme].accentColor }]} onPress={handleFollow}>
              <Text style={{ color: themeStyles[theme].textColor }}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: 'gray',
  },
  followButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ProfileScreen;
