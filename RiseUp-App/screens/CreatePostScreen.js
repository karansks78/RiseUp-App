/**
 * CreatePostScreen.js - Handles media upload and post creation.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ProgressViewIOS, Platform, ProgressBarAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db, auth } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CreatePostScreen = () => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setVideo(null);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Pick a video from camera roll" onPress={pickVideo} />
      {image && <Image source={{ uri: image }} style={styles.media} />}
      {video && <Text>Video Selected</Text>}
      <TextInput
        style={styles.input}
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
      />
      <Button title="Upload Post" onPress={uploadPost} disabled={uploading} />
      {uploading && (
        Platform.OS === 'ios' ? (
          <ProgressViewIOS progress={uploadProgress / 100} />
        ) : (
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={uploadProgress / 100}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  media: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default CreatePostScreen;
