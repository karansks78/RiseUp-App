/**
 * StoriesScreen.js - Displays a list of user stories.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoriesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Stories Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoriesScreen;
