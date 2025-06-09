/**
 * PostCard.js - Displays a single post with like and comment functionality.
 */

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, FlatList, Share, Alert } from 'react-native';
import Video from 'react-native-video';
import { auth, db } from '../firebase';
import { arrayUnion, arrayRemove, doc, updateDoc, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import Comment from './Comment';
import { ThemeContext } from '../context/ThemeContext';
import globalStyles from '../styles';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const { themeStyles, theme } = useContext(ThemeContext);

  useEffect(() => {
    if (post.likes && post.likes.includes(auth.currentUser.uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    const unsubscribe = onSnapshot(
      collection(db, post.videoURL ? 'reels' : 'posts', post.id, 'comments'),
      (snapshot) => {
        const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      }
    );

    return () => unsubscribe();
  }, [post.likes, post.id]);

  const handleLike = async () => {
    const postRef = doc(db, post.videoURL ? 'reels' : 'posts', post.id);
    const notificationRef = collection(db, 'notifications');

    if (liked) {
      try {
        await updateDoc(postRef, {
          likes: arrayRemove(auth.currentUser.uid)
        });
        setLiked(false);
        setLikesCount(likesCount - 1);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(postRef, {
          likes: arrayUnion(auth.currentUser.uid)
        });
        setLiked(true);
        setLikesCount(likesCount + 1);

        // Create notification
        if (post.userId !== auth.currentUser.uid) {
          await addDoc(notificationRef, {
            type: 'like',
            postId: post.id,
            userId: post.userId,
            senderId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
          });
        }
        } catch (error) {
          console.error('Error liking post:', error);
          Alert.alert('Error', 'Failed to like post. Please try again later.');
        }
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim() !== '') {
      try {
        const commentRef = collection(db, post.videoURL ? 'reels' : 'posts', post.id, 'comments');
        const notificationRef = collection(db, 'notifications');

        await addDoc(commentRef, {
          text: commentText,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });

        // Create notification
        if (post.userId !== auth.currentUser.uid) {
          await addDoc(notificationRef, {
            type: 'comment',
            postId: post.id,
            userId: post.userId,
            senderId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
          });
        }

        setCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
        Alert.alert('Error', 'Failed to add comment. Please try again later.');
      }
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this post! ${post.caption} ${post.imageURL || post.videoURL}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'Failed to share post. Please try again later.');
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.username, { color: themeStyles[theme].textColor }]}>{post.userId}</Text>
      {post.imageURL ? (
        <Image style={styles.media} source={{ uri: post.imageURL }} />
      ) : post.videoURL ? (
        <Video
          source={{ uri: post.videoURL }}
          style={styles.media}
          controls={true}
          resizeMode="cover"
        />
      ) : null}
      <Text style={[styles.caption, { color: themeStyles[theme].textColor }]}>{post.caption}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.likeButton, { backgroundColor: themeStyles[theme].accentColor }]} onPress={handleLike}>
          <Text style={{ color: themeStyles[theme].textColor }}>{liked ? 'Unlike' : 'Like'} ({likesCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.shareButton, { backgroundColor: themeStyles[theme].accentColor }]} onPress={handleShare}>
          <Text style={{ color: themeStyles[theme].textColor }}>Share</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        renderItem={({ item }) => <Comment comment={item} />}
        keyExtractor={item => item.id}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={[styles.commentButton, { backgroundColor: themeStyles[theme].accentColor }]} onPress={handleAddComment}>
          <Text style={{ color: themeStyles[theme].textColor }}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  media: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
  },
  likeButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#eee',
  },
  shareButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#eee',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  commentButton: {
    padding: 5,
    backgroundColor: '#eee',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PostCard;
