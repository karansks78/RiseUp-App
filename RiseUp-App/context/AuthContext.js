/**
 * AuthContext.js - Manages user authentication state.
 */

import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authNative from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '/* INSERT YOUR_WEB_CLIENT_ID HERE */',
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    // Load user from AsyncStorage on app start
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error loading user from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Set up Firebase auth listener
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // User is signed in
        const userData = {
          uid: userAuth.uid,
          email: userAuth.email,
          // Add other user data here as needed
        };
        setUser(userData);
        // Save user to AsyncStorage
        try {
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.log('Error saving user to AsyncStorage:', error);
        }
      } else {
        // User is signed out
        setUser(null);
        // Remove user from AsyncStorage
        try {
          await AsyncStorage.removeItem('user');
        } catch (error) {
          console.log('Error removing user from AsyncStorage:', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log('Login error:', error);
      throw error; // Re-throw the error for the component to handle
    }
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log('Signup error:', error);
      throw error; // Re-throw the error for the component to handle
    }
  };

  // Google Login function
  const googleLogin = async () => {
    try {
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = authNative.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return authNative().signInWithCredential(googleCredential);
    } catch (error) {
      console.log('Google Login error:', error);
      throw error;
    }
  };

  // Phone Signup function
  const phoneSignup = async (phoneNumber) => {
    try {
      const confirmation = await authNative().signInWithPhoneNumber(phoneNumber);
      setConfirmationResult(confirmation);
      return confirmation;
    } catch (error) {
      console.log('Phone Signup error:', error);
      throw error;
    }
  };

  // Phone Login function
  const phoneLogin = async (verificationCode) => {
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (error) {
      console.log('Invalid code.');
      throw error;
    }
  };

  // Reset Password function
  const resetPassword = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Reset Password error:', error);
      throw error;
    }
  };

  // Change Password function
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      const credential = authNative.EmailAuthProvider.credential(user.email, oldPassword);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);
    } catch (error) {
      console.log('Change Password error:', error);
      throw error;
    }
  };

  // Enable Two-Factor Auth function
  const enableTwoFactorAuth = async () => {
    try {
      // Generate a random verification code
      const verificationCode = Math.floor(Math.random() * 1000000).toString();

      // Store the verification code in AsyncStorage
      await AsyncStorage.setItem('twoFactorAuthCode', verificationCode);

      // Send the verification code to the user's phone or email (simulated with console.log)
      console.log('Two-Factor Auth Verification Code:', verificationCode);

      // Update the user's 2FA status in AsyncStorage
      await AsyncStorage.setItem('twoFactorAuthEnabled', 'true');

      Alert.alert('Two-Factor Auth Enabled', 'A verification code has been sent to your phone or email.');
    } catch (error) {
      console.log('Enable Two-Factor Auth error:', error);
      throw error;
    }
  };

  // Verify Two-Factor Auth function
  const verifyTwoFactorAuth = async (verificationCode) => {
    try {
      // Retrieve the stored verification code from AsyncStorage
      const storedVerificationCode = await AsyncStorage.getItem('twoFactorAuthCode');

      // Compare the entered verification code with the stored code
      if (verificationCode === storedVerificationCode) {
        // Update the user's 2FA status in AsyncStorage
        await AsyncStorage.setItem('twoFactorAuthEnabled', 'true');

        // Sign in the user (simulated with console.log)
        console.log('Two-Factor Auth Verified', verificationCode);

        Alert.alert('Two-Factor Auth Verified', 'Your account has been verified.');
      } else {
        // Display an error message
        Alert.alert('Two-Factor Auth Failed', 'Invalid verification code.');
      }
    } catch (error) {
      console.log('Verify Two-Factor Auth error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log('Logout error:', error);
      throw error; // Re-throw the error for the component to handle
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    signup,
    logout,
    phoneSignup,
    phoneLogin,
    confirmationResult,
    googleLogin,
    resetPassword,
    enableTwoFactorAuth,
    verifyTwoFactorAuth,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
