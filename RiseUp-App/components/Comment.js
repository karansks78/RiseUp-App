/**
 * Comment.js - Displays a single comment.
 */

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const Comment = ({ comment }) => {
  const { themeStyles, theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.username, { color: themeStyles[theme].textColor }]}>{comment.userId}</Text>
      <Text style={[styles.text, { color: themeStyles[theme].textColor }]}>{comment.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
  },
});

export default Comment;
