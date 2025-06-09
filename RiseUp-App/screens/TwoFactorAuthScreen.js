/**
 * TwoFactorAuthScreen.js - Handles 2-Factor Authentication.
 */

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import globalStyles from '../styles';
import { ThemeContext } from '../context/ThemeContext';

const TwoFactorAuthScreen = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const { verifyTwoFactorAuth } = useContext(AuthContext);
  const { themeStyles, theme } = useContext(ThemeContext);

  const handleVerifyCode = async () => {
    try {
      await verifyTwoFactorAuth(verificationCode);
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Two-Factor Authentication</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
      />
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: themeStyles[theme].primaryColor }]}
        onPress={handleVerifyCode}
      >
        <Text style={{ color: themeStyles[theme].textColor }}>Verify Code</Text>
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

export default TwoFactorAuthScreen;
