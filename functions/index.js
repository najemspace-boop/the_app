const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Import custom email functions
const {
  sendCustomEmailVerification,
  verifyEmailToken,
  verifyEmail,
  resendVerificationEmail
} = require('./src/emailFunctions');

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// KYC Approval Function
exports.onKycApproved = functions.firestore
  .document('kycRequests/{kycId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Check if KYC status changed to approved
    if (before.status !== 'approved' && after.status === 'approved') {
      try {
        // Update user profile to owner role
        await db.collection('profiles').doc(after.userId).update({
          role: 'owner',
          kycStatus: 'approved',
          kycApprovedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create notification for user
        await db.collection('notifications').add({
          userId: after.userId,
          type: 'kyc_approved',
          title: 'KYC Approved!',
          message: 'Your KYC verification has been approved. You can now list properties.',
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`User ${after.userId} promoted to owner role after KYC approval`);
      } catch (error) {
        console.error('Error promoting user to owner:', error);
      }
    }
  });

// Booking Expiry Function
exports.onBookingExpired = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    try {
      // Find expired bookings
      const expiredBookingsQuery = await db.collection('bookings')
        .where('status', '==', 'pending')
        .where('expiresAt', '<=', now.toDate())
        .get();

      const batch = db.batch();
      
      expiredBookingsQuery.forEach((doc) => {
        const bookingRef = db.collection('bookings').doc(doc.id);
        batch.update(bookingRef, {
          status: 'expired',
          expiredAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create notification for guest
        const notificationRef = db.collection('notifications').doc();
        batch.set(notificationRef, {
          userId: doc.data().guestId,
          type: 'booking_expired',
          title: 'Booking Request Expired',
          message: 'Your booking request has expired due to no response from the host.',
          data: {
            bookingId: doc.id,
            listingId: doc.data().listingId
          },
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`Expired ${expiredBookingsQuery.size} booking requests`);
    } catch (error) {
      console.error('Error expiring bookings:', error);
    }
  });

// Message Attachment Cleanup Function
exports.onMessageUploaded = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    
    // Schedule deletion for attachments and voice messages
    if (messageData.attachmentUrl || messageData.voiceUrl) {
      const deleteAt = new Date();
      deleteAt.setDate(deleteAt.getDate() + 15); // 15 days from now
      
      try {
        await db.collection('scheduledDeletions').add({
          type: 'message_attachment',
          messageId: context.params.messageId,
          chatId: context.params.chatId,
          attachmentUrl: messageData.attachmentUrl || messageData.voiceUrl,
          deleteAt: admin.firestore.Timestamp.fromDate(deleteAt),
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`Scheduled deletion for message attachment: ${context.params.messageId}`);
      } catch (error) {
        console.error('Error scheduling attachment deletion:', error);
      }
    }
  });

// Cleanup Scheduled Deletions Function
exports.cleanupScheduledDeletions = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    try {
      // Find items scheduled for deletion
      const deletionsQuery = await db.collection('scheduledDeletions')
        .where('deleteAt', '<=', now.toDate())
        .get();

      const batch = db.batch();
      
      for (const doc of deletionsQuery.docs) {
        const deletionData = doc.data();
        
        try {
          // Delete from storage
          if (deletionData.attachmentUrl) {
            const bucket = storage.bucket();
            const filePath = deletionData.attachmentUrl.split('/o/')[1].split('?')[0];
            const decodedPath = decodeURIComponent(filePath);
            
            await bucket.file(decodedPath).delete();
            console.log(`Deleted file: ${decodedPath}`);
          }
          
          // Remove from scheduled deletions
          batch.delete(doc.ref);
        } catch (error) {
          console.error(`Error deleting file for ${doc.id}:`, error);
          // Still remove from scheduled deletions even if file deletion fails
          batch.delete(doc.ref);
        }
      }

      await batch.commit();
      console.log(`Processed ${deletionsQuery.size} scheduled deletions`);
    } catch (error) {
      console.error('Error processing scheduled deletions:', error);
    }
  });

// User Activity Tracking
exports.onUserLogin = functions.auth.user().onCreate(async (user) => {
  try {
    // Update last login time
    await db.collection('profiles').doc(user.uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      emailVerified: user.emailVerified
    });
    
    console.log(`Updated login time for user: ${user.uid}`);
  } catch (error) {
    console.error('Error updating user login time:', error);
  }
});

// Notification Cleanup Function
exports.cleanupOldNotifications = functions.pubsub
  .schedule('0 0 * * 0')
  .timeZone('UTC')
  .onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    try {
      const oldNotificationsQuery = await db.collection('notifications')
        .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();

      const batch = db.batch();
      
      oldNotificationsQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Deleted ${oldNotificationsQuery.size} old notifications`);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  });

// Chat Creation Function
exports.createChat = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { otherUserId, listingId } = data;
  const currentUserId = context.auth.uid;

  if (!otherUserId) {
    throw new functions.https.HttpsError('invalid-argument', 'otherUserId is required');
  }

  try {
    // Check if chat already exists
    const existingChatQuery = await db.collection('chats')
      .where('participantIds', 'array-contains-any', [currentUserId, otherUserId])
      .get();

    let existingChat = null;
    existingChatQuery.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.participantIds.includes(currentUserId) && 
          chatData.participantIds.includes(otherUserId)) {
        existingChat = { id: doc.id, ...chatData };
      }
    });

    if (existingChat) {
      return { chatId: existingChat.id };
    }

    // Create new chat
    const chatRef = await db.collection('chats').add({
      participantIds: [currentUserId, otherUserId],
      listingId: listingId || null,
      lastMessage: '',
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      unreadCount: {
        [currentUserId]: 0,
        [otherUserId]: 0
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { chatId: chatRef.id };
  } catch (error) {
    console.error('Error creating chat:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create chat');
  }
});

// Update Message Read Status
exports.markMessagesAsRead = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { chatId } = data;
  const userId = context.auth.uid;

  if (!chatId) {
    throw new functions.https.HttpsError('invalid-argument', 'chatId is required');
  }

  try {
    // Update unread messages to read
    const unreadMessagesQuery = await db.collection('chats')
      .doc(chatId)
      .collection('messages')
      .where('receiverId', '==', userId)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    
    unreadMessagesQuery.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    // Reset unread count for user
    batch.update(db.collection('chats').doc(chatId), {
      [`unreadCount.${userId}`]: 0
    });

    await batch.commit();
    
    return { success: true };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw new functions.https.HttpsError('internal', 'Failed to mark messages as read');
  }
});

// Search Listings Function
exports.searchListings = functions.https.onCall(async (data, context) => {
  const { 
    location, 
    listingType, 
    propertyType, 
    minPrice, 
    maxPrice, 
    bedrooms, 
    bathrooms,
    amenities,
    limit = 20 
  } = data;

  try {
    let query = db.collection('listings')
      .where('status', '==', 'active');

    // Add filters
    if (listingType) {
      query = query.where('listingType', '==', listingType);
    }

    if (propertyType) {
      query = query.where('propertyType', '==', propertyType);
    }

    if (minPrice) {
      query = query.where('price', '>=', minPrice);
    }

    if (maxPrice) {
      query = query.where('price', '<=', maxPrice);
    }

    if (bedrooms) {
      query = query.where('bedrooms', '>=', bedrooms);
    }

    if (bathrooms) {
      query = query.where('bathrooms', '>=', bathrooms);
    }

    // Execute query
    const querySnapshot = await query.limit(limit).get();
    
    const listings = [];
    querySnapshot.forEach((doc) => {
      const listingData = { id: doc.id, ...doc.data() };
      
      // Filter by amenities if specified
      if (amenities && amenities.length > 0) {
        const hasAllAmenities = amenities.every(amenity => 
          listingData.amenities && listingData.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return;
      }
      
      // Filter by location if specified (simple text search)
      if (location) {
        const locationMatch = 
          listingData.address?.toLowerCase().includes(location.toLowerCase()) ||
          listingData.city?.toLowerCase().includes(location.toLowerCase()) ||
          listingData.country?.toLowerCase().includes(location.toLowerCase());
        if (!locationMatch) return;
      }
      
      listings.push(listingData);
    });

    return { listings };
  } catch (error) {
    console.error('Error searching listings:', error);
    throw new functions.https.HttpsError('internal', 'Failed to search listings');
  }
});

// Export custom email verification functions
exports.sendCustomEmailVerification = sendCustomEmailVerification;
exports.verifyEmailToken = verifyEmailToken;
exports.verifyEmail = verifyEmail;
exports.resendVerificationEmail = resendVerificationEmail;