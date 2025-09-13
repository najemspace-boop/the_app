const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {
  generateVerificationToken,
  storeVerificationToken,
  sendVerificationEmail,
  verifyEmailToken
} = require('./emailService');

// Firebase Admin is already initialized in index.js, no need to initialize again

// Send custom email verification
exports.sendCustomEmailVerification = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid, email, displayName } = context.auth.token;

  try {
    console.log('🔄 Starting email verification process...');
    console.log('📧 Email:', email);
    console.log('👤 Display Name:', displayName);
    console.log('🆔 UID:', uid);
    
    // Check Firebase Functions config
    const functions = require('firebase-functions');
    const config = functions.config();
    console.log('🔧 SMTP Config Check:');
    console.log('- Host:', config.smtp?.host || 'NOT SET');
    console.log('- Port:', config.smtp?.port || 'NOT SET');
    console.log('- User:', config.smtp?.user || 'NOT SET');
    console.log('- Pass:', config.smtp?.pass ? 'SET' : 'NOT SET');
    
    // Generate verification token
    const token = generateVerificationToken();
    console.log('🔑 Generated token:', token.substring(0, 8) + '...');
    
    // Store token in Firestore
    await storeVerificationToken(uid, token);
    console.log('💾 Token stored in Firestore');
    
    // Send email via SMTP
    console.log('📤 Attempting to send email via SMTP...');
    const result = await sendVerificationEmail(email, displayName, token, uid);
    
    console.log(`✅ Verification email sent to ${email}`);
    console.log('📧 Message ID:', result.messageId);
    
    return {
      success: true,
      message: 'Verification email sent successfully',
      messageId: result.messageId
    };
    
  } catch (error) {
    console.error('❌ Detailed error sending verification email:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send verification email';
    if (error.message.includes('authentication')) {
      errorMessage = 'SMTP authentication failed - check email credentials';
    } else if (error.message.includes('connection')) {
      errorMessage = 'SMTP connection failed - check host and port';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'SMTP connection timeout - check network settings';
    } else {
      errorMessage = `SMTP Error: ${error.message}`;
    }
    
    throw new functions.https.HttpsError('internal', errorMessage);
  }
});

// Verify email token
exports.verifyEmailToken = functions.https.onCall(async (data, context) => {
  const { token, uid } = data;
  
  if (!token || !uid) {
    throw new functions.https.HttpsError('invalid-argument', 'Token and UID are required');
  }

  try {
    const result = await verifyEmailToken(token, uid);
    
    console.log(`✅ Email verified for user ${uid}`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error verifying email:', error);
    throw new functions.https.HttpsError('invalid-argument', error.message);
  }
});

// HTTP endpoint for email verification (for email links)
exports.verifyEmail = functions.https.onRequest(async (req, res) => {
  const { token, uid } = req.query;
  
  if (!token || !uid) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>خطأ في التحقق</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .error { color: #dc3545; }
        </style>
      </head>
      <body>
        <h1 class="error">❌ رابط غير صالح</h1>
        <p>الرابط المستخدم غير صالح أو منتهي الصلاحية.</p>
        <p>Invalid or expired verification link.</p>
      </body>
      </html>
    `);
  }

  try {
    await verifyEmailToken(token, uid);
    
    // Redirect to success page with proper URL
    const functions = require('firebase-functions');
    const config = functions.config();
    const frontendUrl = config.app?.url || 'http://localhost:5175';
    return res.redirect(`${frontendUrl}/email-verified?success=true&verified=true`);
    
  } catch (error) {
    console.error('❌ Email verification failed:', error);
    
    return res.status(400).send(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>فشل التحقق</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .error { color: #dc3545; }
          .info { color: #6c757d; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1 class="error">❌ فشل في تأكيد البريد الإلكتروني</h1>
        <p>${error.message}</p>
        <div class="info">
          <p>إذا كنت تواجه مشاكل، يرجى المحاولة مرة أخرى أو التواصل مع الدعم.</p>
          <p>If you're having issues, please try again or contact support.</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Resend verification email with rate limiting
exports.resendVerificationEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid, email, displayName } = context.auth.token;
  const db = admin.firestore();

  try {
    // Check rate limiting
    const userDoc = await db.collection('emailVerifications').doc(uid).get();
    
    if (userDoc.exists) {
      const data = userDoc.data();
      const lastSent = data.createdAt?.toDate();
      
      if (lastSent) {
        const minutesSinceLastSent = (new Date() - lastSent) / (1000 * 60);
        if (minutesSinceLastSent < 1) { // 1 minute cooldown
          throw new functions.https.HttpsError('resource-exhausted', 
            'Please wait before requesting another verification email');
        }
      }
    }

    // Generate new token and send email
    const token = generateVerificationToken();
    await storeVerificationToken(uid, token);
    const result = await sendVerificationEmail(email, displayName, token, uid);
    
    return {
      success: true,
      message: 'Verification email resent successfully',
      messageId: result.messageId
    };
    
  } catch (error) {
    console.error('❌ Error resending verification email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
