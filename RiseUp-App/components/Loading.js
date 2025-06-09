/**
 * Loading.js - A simple loading indicator.
 */

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const Loading = () => {
  const { themeStyles, theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={{ color: themeStyles[theme].textColor }}>Loading...</Text>
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

export default Loading;
