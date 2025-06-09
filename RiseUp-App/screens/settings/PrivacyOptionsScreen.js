/**
 * PrivacyOptionsScreen.js - Handles user privacy settings.
 */

import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ThemeContext } from '../../context/ThemeContext';
import globalStyles from '../../styles';

const PrivacyOptionsScreen = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [canSendMessages, setCanSendMessages] = useState('everyone');
  const [canComment, setCanComment] = useState('everyone');
  const [canTag, setCanTag] = useState('everyone');
  const { themeStyles, theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsPrivate(data.isPrivate || false);
          setCanSendMessages(data.canSendMessages || 'everyone');
          setCanComment(data.canComment || 'everyone');
          setCanTag(data.canTag || 'nobody');
        } else {
          console.warn('No such document!');
        }
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
        Alert.alert('Error', 'Failed to fetch privacy settings. Please try again later.');
      }
    };

    fetchPrivacySettings();
  }, []);

  const handleTogglePrivate = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        isPrivate: !isPrivate,
      });
      setIsPrivate(!isPrivate);
    } catch (error) {
      console.error('Error toggling private account:', error);
      Alert.alert('Error', 'Failed to toggle private account. Please try again later.');
    }
  };

  const handleSendMessagePermission = async (permission) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        canSendMessages: permission,
      });
      setCanSendMessages(permission);
    } catch (error) {
       console.error('Error setting message permission:', error);
      Alert.alert('Error', 'Failed to set message permission. Please try again later.');
    }
  };

  const handleCommentPermission = async (permission) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        canComment: permission,
      });
      setCanComment(permission);
    } catch (error) {
      console.error('Error setting comment permission:', error);
      Alert.alert('Error', 'Failed to set comment permission. Please try again later.');
    }
  };

  const handleTagPermission = async (permission) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        canTag: permission,
      });
      setCanTag(permission);
    } catch (error) {
      console.error('Error setting tag permission:', error);
      Alert.alert('Error', 'Failed to set tag permission. Please try again later.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
      <View style={styles.settingItem}>
        <Text style={[styles.text, { color: themeStyles[theme].textColor }]}>Private Account</Text>
        <Switch 
          value={isPrivate} 
          onValueChange={handleTogglePrivate} 
          trackColor={{ false: themeStyles[theme].accentColor, true: themeStyles[theme].primaryColor }}
          thumbColor={isPrivate ? themeStyles[theme].primaryColor : themeStyles[theme].accentColor}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.text, { color: themeStyles[theme].textColor }]}>Who can send me messages?</Text>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canSendMessages === 'everyone' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleSendMessagePermission('everyone')}>
          <Text style={[canSendMessages === 'everyone' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Everyone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canSendMessages === 'followers' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleSendMessagePermission('followers')}>
          <Text style={[canSendMessages === 'followers' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canSendMessages === 'nobody' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleSendMessagePermission('nobody')}>
          <Text style={[canSendMessages === 'nobody' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Nobody</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.text, { color: themeStyles[theme].textColor }]}>Who can comment on my posts?</Text>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canComment === 'everyone' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleCommentPermission('everyone')}>
          <Text style={[canComment === 'everyone' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Everyone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canComment === 'followers' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleCommentPermission('followers')}>
          <Text style={[canComment === 'followers' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canComment === 'nobody' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleCommentPermission('nobody')}>
          <Text style={[canComment === 'nobody' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Nobody</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.text, { color: themeStyles[theme].textColor }]}>Who can tag me in posts?</Text>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canTag === 'everyone' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleTagPermission('everyone')}>
          <Text style={[canTag === 'everyone' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Everyone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canTag === 'followers' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleTagPermission('followers')}>
          <Text style={[canTag === 'followers' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: canTag === 'nobody' ? themeStyles[theme].accentColor : 'transparent', borderColor: themeStyles[theme].textColor, borderWidth: 1 }]} onPress={() => handleTagPermission('nobody')}>
          <Text style={[canTag === 'nobody' ? styles.selectedText : styles.unselectedText, { color: themeStyles[theme].textColor }]}>Nobody</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    marginBottom: 20,
  },
  permissionButton: {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  selectedText: {
    fontWeight: 'bold',
  },
  unselectedText: {
    fontWeight: 'normal',
  },
  text: {
    fontSize: 16
  }
});

export default PrivacyOptionsScreen;
