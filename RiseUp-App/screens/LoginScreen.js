/**
 * LoginScreen.js - Handles user login.
 */

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Button, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import AuthForm from '../components/AuthForm';
import globalStyles from '../styles';
import { ThemeContext } from '../context/ThemeContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const { login, phoneSignup, phoneLogin, googleLogin } = useContext(AuthContext);
  const [confirm, setConfirm] = useState(null);
  const navigation = useNavigation();
  const { themeStyles, theme } = useContext(ThemeContext);

  const handleEmailPasswordLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  async function handlePhoneSignup() {
    try {
      const confirmation = await phoneSignup(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      Alert.alert('Phone Signup Failed', error.message);
    }
  }

  async function handlePhoneLogin() {
    try {
      await phoneLogin(verificationCode);
    } catch (error) {
      Alert.alert('Phone Login Failed', error.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      await googleLogin();
    } catch (error) {
      Alert.alert('Google Login Failed', error.message);
    }
  }

  const validateVerificationCode = (code) => {
    // Use a regular expression to validate the verification code
    const regex = /^[0-9]{6}$/;
    return regex.test(code);
  };

  const handleVerificationCodeChange = (code) => {
    setVerificationCode(code);
    setIsVerificationCodeValid(validateVerificationCode(code));
  };

  if (!confirm) {
    return (
      <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          handleEmailPasswordAuth={handleEmailPasswordLogin}
          handlePhoneSignup={handlePhoneSignup}
          authType="login"
        />

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={[styles.forgotPassword, { color: themeStyles[theme].textColor }]}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={globalStyles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={handleVerificationCodeChange}
        keyboardType="number-pad"
      />
      <Button title="Verify Code" onPress={handlePhoneLogin} disabled={!isVerificationCodeValid} />
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
  googleButton: {
    marginTop: 20,
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 10,
    color: '#fff',
  },
});

export default LoginScreen;
