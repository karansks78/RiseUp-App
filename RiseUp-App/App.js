/**
 * App.js - Main entry point for the RiseUp app.
 * Sets up navigation and global context providers.
 */

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { RootStack } from './navigation/RootStack';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

const App = () => {
  const { themeStyles, theme } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeStyles[theme].backgroundColor,
      fontFamily: themeStyles[theme].fontFamily,
      textColor: themeStyles[theme].textColor,
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer style={styles.container}>
          <RootStack />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
