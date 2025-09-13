import { auth } from '../config/firebase.js';
import { sendEmailVerification } from 'firebase/auth';

export const debugEmailVerification = async () => {
  console.log("🔍 Email Verification Debug Report");
  console.log("==================================");

  const user = auth.currentUser;
  
  if (!user) {
    console.error("❌ No user signed in");
    return { success: false, error: "No user signed in" };
  }

  // User info
  console.log("👤 User Information:");
  console.log(`- Email: ${user.email}`);
  console.log(`- Email Verified: ${user.emailVerified}`);
  console.log(`- UID: ${user.uid}`);
  console.log(`- Creation Time: ${user.metadata.creationTime}`);
  console.log(`- Last Sign In: ${user.metadata.lastSignInTime}`);

  // Firebase config check
  console.log("\n🔧 Firebase Configuration:");
  console.log(`- Auth Domain: ${auth.config.authDomain}`);
  console.log(`- Project ID: ${auth.config.projectId}`);

  // Test email sending
  try {
    console.log("\n📧 Sending verification email...");
    
    await sendEmailVerification(user, {
      url: `${window.location.origin}/profile`,
      handleCodeInApp: false
    });
    
    console.log("✅ Email sent successfully!");
    
    // Debugging checklist
    console.log("\n📋 Troubleshooting Checklist:");
    console.log("1. ✉️  Check your email inbox");
    console.log("2. 🗑️  Check spam/junk folder");
    console.log("3. ⏰ Wait 2-5 minutes for delivery");
    console.log("4. 🔄 Try a different email provider");
    console.log("5. 🌐 Check Firebase Console > Authentication > Templates");
    
    return { success: true, message: "Email sent successfully" };
    
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    
    let solution = "";
    switch (error.code) {
      case 'auth/too-many-requests':
        solution = "Wait 1-2 hours before trying again";
        break;
      case 'auth/invalid-email':
        solution = "Check email format is valid";
        break;
      case 'auth/user-disabled':
        solution = "Account has been disabled";
        break;
      case 'auth/network-request-failed':
        solution = "Check internet connection";
        break;
      default:
        solution = "Check Firebase Console settings";
    }
    
    console.log(`💡 Solution: ${solution}`);
    return { success: false, error: error.message, code: error.code, solution };
  }
};

export const checkFirebaseEmailSettings = () => {
  console.log("🔧 Firebase Email Template Settings to Check:");
  console.log("1. Go to Firebase Console > Authentication > Templates");
  console.log("2. Click 'Email address verification'");
  console.log("3. Ensure template is enabled and configured");
  console.log("4. Check 'From' email address is set");
  console.log("5. Verify redirect URL is correct");
  console.log("6. Check authorized domains include your domain");
};
