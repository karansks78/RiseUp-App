import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import globalStyles from '../styles';
import { ThemeContext } from '../context/ThemeContext';

const AuthForm = ({
  email,
  setEmail,
  password,
  setPassword,
  phoneNumber,
  setPhoneNumber,
  handleEmailPasswordAuth,
  handlePhoneSignup,
  authType,
}) => {
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const { themeStyles, theme } = useContext(ThemeContext);

  const validatePhoneNumber = (number) => {
    // Use a regular expression to validate the phone number
    const regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return regex.test(number);
  };

  const handlePhoneNumberChange = (number) => {
    setPhoneNumber(number);
    setIsPhoneNumberValid(validatePhoneNumber(number));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>{authType === 'login' ? 'Login' : 'Sign Up'}</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: themeStyles[theme].primaryColor }]}
        onPress={handleEmailPasswordAuth}
      >
        <Text style={{ color: themeStyles[theme].textColor }}>{authType === 'login' ? 'Login' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Or {authType === 'login' ? 'Login' : 'Sign Up'} with Phone</Text>
      <PhoneInput
        defaultValue={phoneNumber}
        defaultCode="US"
        layout="second"
        onChangeText={handlePhoneNumberChange}
        onChangeCountry={(country) => {
          console.log(country.cca2);
        }}
        withDarkTheme
        withShadow
        autoFocus
      />
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: themeStyles[theme].primaryColor }]}
        onPress={handlePhoneSignup}
        disabled={!isPhoneNumberValid}
      >
        <Text style={{ color: themeStyles[theme].textColor }}>Send Verification Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AuthForm;
