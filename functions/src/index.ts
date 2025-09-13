import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Set Firestore settings for better performance
db.settings({
  ignoreUndefinedProperties: true
});

/**
 * Triggered when a new KYC request is created
 */
export const onKycSubmitted = functions
  .runWith({
    timeoutSeconds: 60,
    memory: "256MB"
  })
  .firestore
  .document("kycRequests/{requestId}")
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    try {
      const data = snap.data();
      const userId = data.userId;
      if (!userId) return null;

      await db.collection("profiles").doc(userId).update({
        kycStatus: "pending",
        updatedAt: new Date().toISOString(),
      });

      console.log(`KYC submitted by user ${userId}`);
      return null;
    } catch (error) {
      console.error("Error in onKycSubmitted:", error);
      return null;
    }
  });

/**
 * Triggered when a KYC status is updated to approved or rejected
 */
export const onKycStatusChange = functions
  .runWith({
    timeoutSeconds: 60,
    memory: "256MB"
  })
  .firestore
  .document("kycRequests/{requestId}")
  .onUpdate(async (change: functions.Change<functions.firestore.QueryDocumentSnapshot>, context: functions.EventContext) => {
    try {
      const before = change.before.data();
      const after = change.after.data();

      if (before.status === after.status) return null;

      const userId = after.userId;
      const newStatus = after.status;
      if (!userId) return null;

      await db.collection("profiles").doc(userId).update({
        kycStatus: newStatus,
        updatedAt: new Date().toISOString(),
      });

      console.log(`KYC status for ${userId} updated to ${newStatus}`);
      return null;
    } catch (error) {
      console.error("Error in onKycStatusChange:", error);
      return null;
    }
  });

/**
 * When a new review is written, update the listing's average rating
 */
export const onNewReview = functions
  .runWith({
    timeoutSeconds: 60,
    memory: "256MB"
  })
  .firestore
  .document("listings/{listingId}/reviews/{reviewId}")
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    try {
      const data = snap.data();
      const { rating } = data;
      const listingId = context.params.listingId;

      if (!rating || !listingId) return null;

      const reviewsSnap = await db
        .collection("listings")
        .doc(listingId)
        .collection("reviews")
        .get();

      const ratings = reviewsSnap.docs.map((doc) => doc.data().rating).filter(r => r);
      if (ratings.length === 0) return null;

      const avgRating = ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length;

      await db.collection("listings").doc(listingId).update({
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        updatedAt: new Date().toISOString(),
      });

      console.log(`Updated average rating for listing ${listingId}: ${avgRating}`);
      return null;
    } catch (error) {
      console.error("Error in onNewReview:", error);
      return null;
    }
  });

/**
 * When a listing is deleted, remove all its subcollections
 */
export const onListingDelete = functions
  .runWith({
    timeoutSeconds: 120,
    memory: "512MB"
  })
  .firestore
  .document("listings/{listingId}")
  .onDelete(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    try {
      const listingId = context.params.listingId;
      const subcollections = ["calendar", "reviews", "media"];

      for (const sub of subcollections) {
        const subSnap = await db
          .collection("listings")
          .doc(listingId)
          .collection(sub)
          .get();

        if (subSnap.empty) continue;

        const batch = db.batch();
        subSnap.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }

      console.log(`Cleaned up subcollections for listing ${listingId}`);
      return null;
    } catch (error) {
      console.error("Error in onListingDelete:", error);
      return null;
    }
  });