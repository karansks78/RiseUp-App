/**
 * HelpCenterScreen.js - Displays FAQs, Contact Us, and Safety Tips.
 */

import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const HelpCenterScreen = () => {
  const { themeStyles, theme } = useContext(ThemeContext);

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Help Center</Text>

      <Text style={[styles.sectionTitle, { color: themeStyles[theme].textColor }]}>FAQs</Text>
<Text style={[styles.faqItem, { color: themeStyles[theme].textColor }]}>Q: How do I change my password?</Text>
      <Text style={{ color: themeStyles[theme].textColor }}>A: Go to Settings &gt; Change Password.</Text>

      <Text style={[styles.faqItem, { color: themeStyles[theme].textColor }]}>Q: How do I report a user?</Text>
      <Text style={{ color: themeStyles[theme].textColor }}>A: Go to their profile and select Report/Block User.</Text>

      <Text style={[styles.sectionTitle, { color: themeStyles[theme].textColor }]}>Contact Us</Text>
      <Text style={{ color: themeStyles[theme].textColor }}>Email: support@riseupapp.com</Text>
      <Text style={{ color: themeStyles[theme].textColor }}>Phone: 1-800-RISEUP</Text>

      <Text style={[styles.sectionTitle, { color: themeStyles[theme].textColor }]}>Safety Tips</Text>
      <Text style={{ color: themeStyles[theme].textColor }}>1. Be careful when sharing personal information.</Text>
      <Text style={{ color: themeStyles[theme].textColor }}>2. Report any suspicious activity.</Text>
      <Text style={{ color: themeStyles[theme].textColor }}>3. Meet new people in public places.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  faqItem: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HelpCenterScreen;
