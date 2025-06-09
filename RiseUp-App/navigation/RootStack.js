/**
 * RootStack.js - Defines the root stack navigation.
 */

import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TwoFactorAuthScreen from '../TwoFactorAuthScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';
import PrivacyOptionsScreen from '../screens/settings/PrivacyOptionsScreen';
import ReportBlockUserScreen from '../screens/settings/ReportBlockUserScreen';
import HelpCenterScreen from '../screens/settings/HelpCenterScreen';
import IndividualChatScreen from '../screens/IndividualChatScreen';
import { BottomTabs } from './BottomTabs';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';

const Stack = createNativeStackNavigator();

export const RootStack = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        // User is logged in
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
      ) : (
        // User is not logged in
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuthScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="PrivacyOptions" component={PrivacyOptionsScreen} />
          <Stack.Screen name="ReportBlockUser" component={ReportBlockUserScreen} />
          <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
           <Stack.Screen name="IndividualChat" component={IndividualChatScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
