/**
 * SettingsScreen.js - Allows users to manage app settings.
 */

import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import SettingsList from 'react-native-settings-list';
import InputField from '../../components/InputField';
import globalStyles from '../../styles';

const SettingsScreen = () => {
  const { logout, enableTwoFactorAuth, verifyTwoFactorAuth } = useContext(AuthContext);
  const { theme, toggleTheme, themeStyles } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState('');

  const handleEnableTwoFactorAuth = async () => {
    try {
      await enableTwoFactorAuth();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifyTwoFactorAuth = async () => {
    try {
      await verifyTwoFactorAuth(verificationCode);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <SettingsList borderColor={themeStyles[theme].borderColor} defaultItemSize={50}>
        <SettingsList.Header headerStyle={{marginTop:15}}/>
        <SettingsList.Item
          hasNavArrow={false}
          title='Logout'
          titleInfo=''
          onPress={() => logout()}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <SettingsList.Item
          hasNavArrow={false}
          title={`Toggle Theme to ${theme === 'light' ? 'Dark' : 'Light'}`}
          onPress={toggleTheme}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <SettingsList.Item
          hasNavArrow={true}
          title='Change Password'
          onPress={() => navigation.navigate('ChangePassword')}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <SettingsList.Item
          hasNavArrow={true}
          title='Privacy Options'
          onPress={() => navigation.navigate('PrivacyOptions')}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <SettingsList.Item
          hasNavArrow={true}
          title='Report/Block User'
          onPress={() => navigation.navigate('ReportBlockUser')}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <SettingsList.Item
          hasNavArrow={true}
          title='Help Center'
          onPress={() => navigation.navigate('HelpCenter')}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <SettingsList.Item
          hasNavArrow={false}
          title='Enable Two-Factor Auth'
          onPress={handleEnableTwoFactorAuth}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <SettingsList.Item
          hasNavArrow={false}
          title='Verify Two-Factor Auth'
          onPress={handleVerifyTwoFactorAuth}
          titleStyle={{ color: themeStyles[theme].textColor }}
        />
        <InputField
          style={globalStyles.input}
          placeholder="Verification Code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
        />
      </SettingsList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
