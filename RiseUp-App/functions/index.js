/**
 * index.js - Cloud Functions for the RiseUp app.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
// [START generateThumbnailTrigger]
exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    // [END generateThumbnailTrigger]
    // [START generateThumbnailBody]
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    // [END generateThumbnailBody]

    // [START stopResizing]
    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
      return functions.logger.log('This is not an image.');
    }

    // Exit if the image is a thumbnail.
    if (filePath.includes('thumb_')) {
      return functions.logger.log('Already a Thumbnail.');
    }

    // Exit if this is a move or deletion event.
    if (metageneration > 1) {
      return;
    }
    // [END stopResizing]

    // [START createAndStoreThumbnail]
    /**
     * Download file from bucket.
     */
    const bucket = admin.storage().bucket(fileBucket);
    const fileName = filePath.split('/').pop();
    const tmpFilePath = `/tmp/${fileName}`;

    await bucket.file(filePath).download({
      destination: tmpFilePath,
    });
    functions.logger.log('Image downloaded locally to', tmpFilePath);
    /**
     * Generate a thumbnail using ImageMagick.
     */
    await spawn('convert', [tmpFilePath, '-thumbnail', '200x200>', tmpFilePath]);
    functions.logger.log('Thumbnail created at', tmpFilePath);

    /**
     * Uploading the Thumbnail.
     */
    const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, '$1thumb_$2');
    await bucket.upload(tmpFilePath, {
      destination: thumbFilePath,
      metadata: {
        contentType: contentType,
      },
    });
    functions.logger.log('Thumbnail uploaded to Storage at', thumbFilePath);
    // [END createAndStoreThumbnail]

    // [START generateToken]
    /**
     * Get the Signed URLs for the thumbnail and original image.
     */
    const config = {
      action: 'read',
      expires: '03-01-2500',
    };
    const [thumbURL] = await bucket.file(thumbFilePath).getSignedUrl(config);
    functions.logger.log('Got Signed URL for thumbnail image: ', thumbURL);
    const [fileURL] = await bucket.file(filePath).getSignedUrl(config);
    functions.logger.log('Got Signed URL for original image: ', fileURL);
    // [END generateToken]

    // [START updateDatabaseEntry]
    /**
     * Add the URLs to the Database
     */
    await admin.firestore().collection('images').doc(fileName).set({
      thumbURL: thumbURL,
      fileURL: fileURL,
    });
    functions.logger.log('Thumbnail URLs saved to database.');
    // [END updateDatabaseEntry]
    return null;
  });
// [END generateThumbnail]

exports.onLikeCreate = functions.firestore
  .document('posts/{postId}/likes/{userId}')
  .onCreate(async (snapshot, context) => {
    const postId = context.params.postId;
    const likerId = context.params.userId;

    try {
      // Get the post document
      const postRef = admin.firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        console.warn('Post document does not exist!');
        return null;
      }

      // Get the liker user document
      const likerRef = admin.firestore().collection('users').doc(likerId);
      try {
        const likerDoc = await likerRef.get();

        if (!likerDoc.exists) {
          console.warn('Liker user document does not exist!');
          return null;
        }

        // Check if the user liking the post is not the owner of the post
        if (postDoc.data().userId !== likerId) {
          // Create a notification document
          const notificationRef = admin.firestore().collection('notifications');
          await notificationRef.add({
            type: 'like',
            postId: postId,
            userId: postDoc.data().userId,
            senderId: likerId,
            senderUsername: likerDoc.exists ? likerDoc.data().username : 'Unknown User',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log('Like notification created!');
        }
        return null;
      } catch (error) {
        console.error('Error getting liker user document:', error);
        console.error(error);
        return null;
      }
    } catch (error) {
      console.error('Error creating like notification:', error);
      console.error(error);
      return null;
    }
  });

exports.onFollowCreate = functions.firestore
  .document('users/{userId}/followers/{followerId}')
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    const followerId = context.params.followerId;

    try {
      // Get the user document
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.warn('User document does not exist!');
        return null;
      }

      // Get the follower user document
      const followerRef = admin.firestore().collection('users').doc(followerId);
      const followerDoc = await followerRef.get();

      if (!followerDoc.exists) {
        console.warn('Follower user document does not exist!');
        return null;
      }

      // Create a notification document
      const notificationRef = admin.firestore().collection('notifications');
      await notificationRef.add({
        type: 'follow',
        userId: userId,
        senderId: followerId,
        senderUsername: followerDoc.data().username || 'Unknown User',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('Follow notification created!');
      return null;
    } catch (error) {
      console.error('Error creating follow notification:', error);
      return null;
    }
  });

exports.onMessageCreate = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const chatId = context.params.chatId;
    const messageId = context.params.messageId;

    try {
      // Get the message document
      const messageRef = admin.firestore().collection('chats').doc(chatId).collection('messages').doc(messageId);
      const messageDoc = await messageRef.get();

      if (!messageDoc.exists) {
        console.warn('Message document does not exist!');
        return null;
      }

      // Get the chat document
      const chatRef = admin.firestore().collection('chats').doc(chatId);
      const chatDoc = await chatRef.get();

      if (!chatDoc.exists) {
        console.warn('Chat document does not exist!');
        return null;
      }

      const message = messageDoc.data();

      // Get the recipient user ID
      const recipientId = chatDoc.data().users.find(userId => userId !== message.userId);

      if (!recipientId) {
        console.warn('Recipient user ID not found!');
        return null;
      }

      // Get the sender user document
      const senderRef = admin.firestore().collection('users').doc(message.userId);
      const senderDoc = await senderRef.get();

      if (!senderDoc.exists) {
        console.warn('Sender user document does not exist!');
        return null;
      }

      // Create a notification document
      const notificationRef = admin.firestore().collection('notifications');
      await notificationRef.add({
        type: 'message',
        chatId: chatId,
        userId: recipientId,
        senderId: message.userId,
        senderUsername: senderDoc.data().username || 'Unknown User',
        messageText: message.text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('Message notification created!');
      return null;
    } catch (error) {
      console.error('Error creating message notification:', error);
      return null;
    }
  });

exports.updateFollowerCount = functions.firestore
  .document('users/{userId}/following/{followingId}')
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;

    const userRef = admin.firestore().collection('users').doc(userId);

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error('Document does not exist!');
        }

        let newFollowerCount = (userDoc.data().followerCount || 0) + 1;
        transaction.update(userRef, { followerCount: newFollowerCount });
      });
      console.log('Transaction success!');
      return null;
    } catch (e) {
      console.log('Transaction failure:', e);
      return null;
    }
  });

exports.rewardSystem = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const userRef = admin.firestore().collection('users').doc(userId);

    const previousFollowerCount = change.before.data().followerCount || 0;
    const currentFollowerCount = change.after.data().followerCount || 0;

    if (currentFollowerCount >= 5000 && previousFollowerCount < 5000) {
      // User has reached 5000 followers, reward them!
      try {
        await userRef.update({
          rewarded: true,
        });
        console.log('User rewarded!');
        return null;
      } catch (e) {
        console.log('Reward system failure:', e);
        return null;
      }
    }
    return null;
  });

exports.checkReportsAndBlock = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snapshot, context) => {
    const userId = snapshot.data().userId;

    try {
      const reportRef = admin.firestore().collection('reports');
      const q = query(reportRef, where('userId', '==', userId));
      const querySnapshot = await admin.firestore().getDocs(q);

      if (querySnapshot.size >= 10) {
        // Block user
        const userRef = admin.firestore().collection('users').doc(userId);
        await userRef.update({
          blocked: true,
        });
        // Send notification to admin
        const adminRef = admin.firestore().collection('admins').doc('admin'); // Replace with your admin document ID
        await adminRef.update({
          notifications: admin.firestore.FieldValue.arrayUnion({
            userId: userId,
            message: 'User has been blocked due to multiple reports.',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          }),
        });
        console.log('User blocked and admin notified.');
        return null;
      } else {
        console.log('Report count less than 10, not blocking user.');
        return null;
      }
    } catch (e) {
      console.log('Block user failure:', e);
      return null;
    }
  });

// Function to send notification to admin
exports.sendAdminNotification = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snapshot, context) => {
    const userId = snapshot.data().userId;
    const reporterId = snapshot.data().reporterId;
    const category = snapshot.data().category;
    const description = snapshot.data().description;

    try {
      const adminRef = admin.firestore().collection('admins').doc('admin'); // Replace with your admin document ID
      await adminRef.update({
        notifications: admin.firestore.FieldValue.arrayUnion({
          userId: userId,
          reporterId: reporterId,
          category: category,
          description: description,
          message: 'New user report received.',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }),
      });
      console.log('Admin notified of new report.');
      return null;
    } catch (e) {
      console.log('Admin notification failure:', e);
      return null;
    }
  });
