import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { customEmailService } from '../services/customEmailService';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // cooldown state for resend
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    let profileUnsubscribe = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Set up real-time listener for user profile
        profileUnsubscribe = onSnapshot(
          doc(db, 'profiles', firebaseUser.uid),
          (profileDoc) => {
            if (profileDoc.exists()) {
              setUserProfile(profileDoc.data());
            } else {
              setUserProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Profile listener error:', error);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);

        if (profileUnsubscribe) {
          profileUnsubscribe();
          profileUnsubscribe = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
    if (!profileDoc.exists()) {
      const profileData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        role: firebaseUser.email === 'admin@airbnb.com' ? 'admin' : 'buyer',
        kycStatus: firebaseUser.email === 'admin@airbnb.com' ? 'approved' : 'not_required',
        emailVerified: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        deviceTokens: []
      };
      await setDoc(doc(db, 'profiles', firebaseUser.uid), profileData);
    }
    return userCredential;
  };

  const register = async (email, password, phone, role = 'buyer') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'profiles', user.uid), {
      id: user.uid,
      email: user.email,
      phone,
      role,
      kycStatus: role === 'owner' ? 'pending' : 'not_required',
      emailVerified: false,
      createdAt: new Date(),
      lastLogin: new Date(),
      deviceTokens: []
    });

    await sendEmailVerification(user);

    return userCredential;
  };

  const logout = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      await signOut(auth);
      localStorage.removeItem('userProfile');
      sessionStorage.clear();
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async () => {
    if (user) {
      // Refresh Firebase Auth user to get latest emailVerified status
      await user.reload();
      
      // Refresh Firestore profile
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setUserProfile(profileData);
        
        // Sync Firebase Auth emailVerified with Firestore if needed
        if (profileData.emailVerified && !user.emailVerified) {
          console.log('🔄 Syncing Firebase Auth with verified email status...');
          await user.reload(); // Force refresh Firebase Auth user
        }
      }
    }
  };

  const resendEmailVerification = async () => {
    if (!user || userProfile?.emailVerified) return;

    if (cooldown) {
      alert("Please wait before resending the verification email.");
      return;
    }

    try {
      console.log("🔄 Using custom SMTP email verification system...");
      console.log("🔍 Debug: Sending email verification to:", user.email);
      console.log("🔍 Debug: User UID:", user.uid);
      
      // Use custom SMTP email service instead of Firebase's built-in system
      const result = await customEmailService.resendEmailVerification();
      
      if (result.success) {
        console.log("✅ Custom SMTP email verification sent successfully!");
        console.log("📧 Message ID:", result.messageId);
        alert(`✅ Verification email sent via SMTP to ${user.email}!\n\n📧 Please check:\n1. Your inbox\n2. Spam/Junk folder\n3. Wait 2-5 minutes for delivery\n\nThis email was sent using our reliable SMTP system.`);

        setCooldown(true);
        setTimeout(() => setCooldown(false), 60000); // 1 min cooldown
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error("❌ Custom SMTP email verification error:", error);
      
      let errorMessage = "Failed to send verification email via SMTP. ";
      
      if (error.message.includes('wait')) {
        errorMessage += "Please wait 1 minute before requesting another email.";
      } else if (error.message.includes('unauthenticated')) {
        errorMessage += "Please sign in again and try.";
      } else {
        errorMessage += error.message || "Please try again later.";
      }
      
      alert(errorMessage);
      
      // Fallback to Firebase's built-in system if custom SMTP fails
      console.log("🔄 Falling back to Firebase built-in email verification...");
      try {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/profile`,
          handleCodeInApp: false
        });
        alert("📧 Fallback: Verification email sent using Firebase system.\nPlease check your email.");
      } catch (fallbackError) {
        console.error("❌ Fallback email verification also failed:", fallbackError);
      }
    }
  };

  const value = {
    user,
    userProfile,
    login,
    register,
    logout,
    resetPassword,
    refreshProfile,
    resendEmailVerification,
    loading,
    cooldown
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
