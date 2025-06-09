/**
 * ChangePasswordScreen.js - Handles changing user password.
 */

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import globalStyles from '../../styles';
import InputField from '../../components/InputField';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { changePassword } = useContext(AuthContext);
  const { themeStyles, theme } = useContext(ThemeContext);

  const handleChangePassword = async () => {
    try {
      await changePassword(oldPassword, newPassword);
      Alert.alert('Password Changed', 'Your password has been changed successfully.');
    } catch (error) {
      Alert.alert('Password Change Failed', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Change Password</Text>
      <InputField
        style={globalStyles.input}
        placeholder="Old Password"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <InputField
        style={globalStyles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: themeStyles[theme].primaryColor }]}
        onPress={handleChangePassword}
      >
        <Text style={{ color: themeStyles[theme].textColor }}>Change Password</Text>
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
});

export default ChangePasswordScreen;
