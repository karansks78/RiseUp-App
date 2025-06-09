/**
 * Header.js - Reusable header component.
 */

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const Header = ({ title }) => {
  const { themeStyles, theme } = useContext(ThemeContext);

  return (
    <View style={[styles.header, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
