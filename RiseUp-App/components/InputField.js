/**
 * InputField.js - Reusable input field component.
 */

import React, { useContext } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import globalStyles from '../styles';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  const { themeStyles, theme } = useContext(ThemeContext);

  return (
    <TextInput
      style={[globalStyles.input, { color: themeStyles[theme].textColor }]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={themeStyles[theme].textColor}
    />
  );
};

const styles = StyleSheet.create({});

export default InputField;
