// Email Verification Debug Script
// Run this in browser console to debug email verification issues

console.log("🔍 Firebase Email Verification Debug Tool");
console.log("==========================================");

// Check Firebase Auth configuration
import { auth } from './src/config/firebase.js';
import { sendEmailVerification } from 'firebase/auth';

const debugEmailVerification = async () => {
  const user = auth.currentUser;
  
  if (!user) {
    console.error("❌ No user is currently signed in");
    return;
  }

  console.log("✅ Current User Info:");
  console.log("- UID:", user.uid);
  console.log("- Email:", user.email);
  console.log("- Email Verified:", user.emailVerified);
  console.log("- Provider Data:", user.providerData);
  
  // Check Firebase project settings
  console.log("\n🔧 Firebase Configuration:");
  console.log("- Auth Domain:", auth.config.authDomain);
  console.log("- Project ID:", auth.config.projectId);
  
  // Test email verification
  try {
    console.log("\n📧 Attempting to send verification email...");
    await sendEmailVerification(user, {
      url: `${window.location.origin}/profile`, // Redirect URL after verification
      handleCodeInApp: false
    });
    console.log("✅ Email verification sent successfully!");
    console.log("📬 Check your email inbox and spam folder");
    
    // Additional debugging info
    console.log("\n🔍 Debugging Tips:");
    console.log("1. Check spam/junk folder");
    console.log("2. Verify email address is correct");
    console.log("3. Check Firebase Console > Authentication > Templates");
    console.log("4. Ensure Firebase project has email verification enabled");
    console.log("5. Check if domain is authorized in Firebase Console");
    
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Common error solutions
    if (error.code === 'auth/too-many-requests') {
      console.log("💡 Solution: Wait a few minutes before trying again");
    } else if (error.code === 'auth/invalid-email') {
      console.log("💡 Solution: Check if email format is valid");
    } else if (error.code === 'auth/user-not-found') {
      console.log("💡 Solution: User needs to be signed in");
    }
  }
};

// Export for use
window.debugEmailVerification = debugEmailVerification;

console.log("🚀 Run debugEmailVerification() in console to test");
