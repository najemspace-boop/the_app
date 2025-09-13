// Debug script to test SMTP configuration directly
const { initializeApp } = require('firebase/app');
const { getFunctions, httpsCallable } = require('firebase/functions');

// Firebase config (same as your app)
const firebaseConfig = {
  apiKey: "AIzaSyDl6CTS0v8mcxcDP1mT4uhVE1X3kzAjzJA",
  authDomain: "bazarna-server.firebaseapp.com",
  projectId: "bazarna-server",
  storageBucket: "bazarna-server.firebasestorage.app",
  messagingSenderId: "374169183306",
  appId: "1:374169183306:web:f4c8a8b8c8f8c8f8c8f8c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

async function testSMTPFunction() {
  try {
    console.log('🧪 Testing custom SMTP email verification function...');
    
    // Test the sendCustomEmailVerification function
    const sendCustomEmail = httpsCallable(functions, 'sendCustomEmailVerification');
    
    // This will fail because we're not authenticated, but we should see the error details
    const result = await sendCustomEmail();
    
    console.log('✅ Function result:', result);
    
  } catch (error) {
    console.error('❌ Function error details:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    
    // Check if it's an authentication error (expected) or SMTP error
    if (error.code === 'unauthenticated') {
      console.log('✅ Function is accessible but requires authentication (this is expected)');
    } else {
      console.log('❌ There might be an SMTP configuration issue');
    }
  }
}

// Test Firebase Functions config access
async function testConfigAccess() {
  try {
    console.log('🔧 Testing Firebase Functions config access...');
    
    // Test a simple HTTP function to check config
    const testConfig = httpsCallable(functions, 'verifyEmail');
    
    // This should give us some insight into config access
    await testConfig({ token: 'test', uid: 'test' });
    
  } catch (error) {
    console.error('Config test error:', error.message);
  }
}

// Run tests
console.log('🚀 Starting SMTP debug tests...');
testSMTPFunction();
testConfigAccess();
