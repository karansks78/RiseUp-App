/**
 * ThemeContext.js - Manages the app's theme (light/dark).
 */

import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default to light theme

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Define theme styles
  const themeStyles = {
    light: {
      backgroundColor: '#fff',
      textColor: '#000',
      primaryColor: '#fff', // Placeholder for gradient Purple-Pink-Blue
      accentColor: 'gold',
      fontFamily: 'Poppins, sans-serif',
      // Add other light theme styles here
    },
    dark: {
      backgroundColor: '#000',
      textColor: '#fff',
      primaryColor: '#000', // Placeholder for gradient Purple-Pink-Blue
      accentColor: 'neonblue',
      fontFamily: 'Poppins, sans-serif',
      // Add other dark theme styles here
    },
  };

  const value = {
    theme,
    toggleTheme,
    themeStyles,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
