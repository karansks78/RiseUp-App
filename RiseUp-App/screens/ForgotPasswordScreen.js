/**
 * ForgotPasswordScreen.js - Handles password reset.
 */

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { auth } from '../firebase';
import globalStyles from '../styles';
import { ThemeContext } from '../context/ThemeContext';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const { themeStyles, theme } = useContext(ThemeContext);

  const handleResetPassword = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert('Password Reset', 'A password reset link has been sent to your email address.');
    } catch (error) {
      Alert.alert('Password Reset Failed', error.message);
    }
  };

    const validateEmail = (email) => {
        // Use a regular expression to validate the email address
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (email) => {
        setEmail(email);
        setIsEmailValid(validateEmail(email));
    };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Forgot Password</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
      />
      <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: themeStyles[theme].primaryColor }]}
            onPress={handleResetPassword}
            disabled={!isEmailValid}
        >
            <Text style={{ color: themeStyles[theme].textColor }}>Reset Password</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default ForgotPasswordScreen;
