/**
 * ReportBlockUserScreen.js - Handles reporting and blocking users.
 */

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { ThemeContext } from '../../context/ThemeContext';
import globalStyles from '../../styles';
import InputField from '../../components/InputField';

const ReportBlockUserScreen = () => {
  const [reportCategory, setReportCategory] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [userIdToReport, setUserIdToReport] = useState('');
  const [reportCount, setReportCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { themeStyles, theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchReportCount = async () => {
      setLoading(true);
      try {
        const reportRef = collection(db, 'reports');
        const q = query(reportRef, where('userId', '==', userIdToReport));
        const querySnapshot = await getDocs(q);
        setReportCount(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching report count:', error);
        Alert.alert('Error', 'Failed to fetch report count. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userIdToReport) {
      fetchReportCount();
    }
  }, [userIdToReport]);

  const handleReportUser = async () => {
    try {
      await addDoc(collection(db, 'reports'), {
        userId: userIdToReport,
        reporterId: auth.currentUser.uid,
        category: reportCategory,
        description: reportDescription,
        createdAt: serverTimestamp(),
      });
      Alert.alert('User Reported', 'Thank you for reporting this user. We will review the report shortly.');
    } catch (error) {
      console.error("Error reporting user: ", error);
      Alert.alert('Report Failed', 'Failed to report user. Please try again later.');
    }
  };

  const handleBlockUser = async () => {
    try {
      const userRef = doc(db, 'users', userIdToReport);

      if (reportCount >= 10) {
        await updateDoc(userRef, {
          blocked: true,
        });
        Alert.alert('User Blocked', 'This user has been blocked due to multiple reports.');
      } else {
        Alert.alert('Not Enough Reports', 'This user has not been blocked because there are not enough reports.');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      Alert.alert('Block Failed', 'Failed to block user. Please try again later.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Report/Block User</Text>

      <InputField
        style={globalStyles.input}
        placeholder="User ID to Report"
        value={userIdToReport}
        onChangeText={setUserIdToReport}
        placeholderTextColor={themeStyles[theme].textColor}
      />
      {loading ? (
        <ActivityIndicator size="small" color={themeStyles[theme].textColor} />
      ) : (
        <Text style={[styles.text, { color: themeStyles[theme].textColor }]}>Report Count: {reportCount}</Text>
      )}

      <InputField
        style={globalStyles.input}
        placeholder="Report Category (Nudity, Abuse, Scam, Fake ID)"
        value={reportCategory}
        onChangeText={setReportCategory}
        placeholderTextColor={themeStyles[theme].textColor}
      />
      <InputField
        style={globalStyles.input}
        placeholder="Report Description"
        value={reportDescription}
        onChangeText={setReportDescription}
        multiline={true}
        placeholderTextColor={themeStyles[theme].textColor}
      />

      <TouchableOpacity style={[globalStyles.button, { backgroundColor: themeStyles[theme].primaryColor }]} onPress={handleReportUser}>
        <Text style={[globalStyles.buttonText, { color: themeStyles[theme].textColor }]}>Report User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.button, { backgroundColor: themeStyles[theme].primaryColor }]} onPress={handleBlockUser}>
        <Text style={[globalStyles.buttonText, { color: themeStyles[theme].textColor }]}>Block User</Text>
      </TouchableOpacity>
    </View>
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
    color: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
  }
});

export default ReportBlockUserScreen;
