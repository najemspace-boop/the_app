const nodemailer = require('nodemailer');
const crypto = require('crypto');
const admin = require('firebase-admin');

// SMTP Configuration - Using Firebase Functions config
const createTransporter = () => {
  const functions = require('firebase-functions');
  const config = functions.config();
  
  return nodemailer.createTransport({
    host: config.smtp?.host || 'smtp.hostinger.com',
    port: parseInt(config.smtp?.port) || 465,
    secure: true, // true for 465 (SSL), false for other ports
    auth: {
      user: config.smtp?.user, // Your email
      pass: config.smtp?.pass, // Your password
    },
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    }
  });
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Store verification token in Firestore
const storeVerificationToken = async (uid, token) => {
  const db = admin.firestore();
  await db.collection('emailVerifications').doc(uid).set({
    token: token,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    verified: false,
    attempts: 0
  });
};

// Send verification email via SMTP
const sendVerificationEmail = async (email, displayName, token, uid) => {
  const functions = require('firebase-functions');
  const config = functions.config();
  const transporter = createTransporter();
  
  // Use Firebase Function URL for verification to handle server-side verification
  const verificationUrl = `${config.app?.functions_url || 'https://us-central1-bazarna-server.cloudfunctions.net'}/verifyEmail?token=${token}&uid=${uid}`;
  
  const mailOptions = {
    from: {
      name: 'بيوت Property Platform',
      address: config.smtp?.user
    },
    to: email,
    subject: 'تأكيد البريد الإلكتروني - Email Verification',
    // Add headers to improve deliverability
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'X-Mailer': 'بيوت Property Platform',
      'Reply-To': config.smtp?.user,
      'Return-Path': config.smtp?.user,
      'List-Unsubscribe': `<mailto:${config.smtp?.user}?subject=unsubscribe>`,
      'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply'
    },
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد البريد الإلكتروني</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #4F46E5;
            margin-bottom: 10px;
          }
          .title {
            color: #1E40AF;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
            font-size: 16px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
          .security-note {
            background: #f8f9fa;
            border-left: 4px solid #4F46E5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏠 بيوت</div>
            <h1 class="title">تأكيد البريد الإلكتروني</h1>
          </div>
          
          <div class="content">
            <p>مرحباً ${displayName || 'عزيزي المستخدم'},</p>
            
            <p>شكراً لك على التسجيل في منصة بيوت للعقارات. لإكمال عملية التسجيل، يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">
                ✅ تأكيد البريد الإلكتروني
              </a>
            </div>
            
            <div class="security-note">
              <strong>ملاحظة أمنية:</strong>
              <ul>
                <li>هذا الرابط صالح لمدة 24 ساعة فقط</li>
                <li>إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد</li>
                <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
              </ul>
            </div>
            
            <p>إذا لم يعمل الزر أعلاه، يمكنك نسخ ولصق الرابط التالي في متصفحك:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
          </div>
          
          <div class="footer">
            <p><strong>English Version:</strong></p>
            <p>Hello ${displayName || 'Dear User'},</p>
            <p>Thank you for registering with بيوت Property Platform. Please verify your email address by clicking the button above.</p>
            <p>This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
            <hr>
            <p style="text-align: center;">
              © 2024 بيوت Property Platform. All rights reserved.<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Verify email token
const verifyEmailToken = async (token, uid) => {
  const db = admin.firestore();
  const doc = await db.collection('emailVerifications').doc(uid).get();
  
  if (!doc.exists) {
    throw new Error('Verification token not found');
  }
  
  const data = doc.data();
  
  // Check if token matches
  if (data.token !== token) {
    throw new Error('Invalid verification token');
  }
  
  // Check if already verified - return success instead of error
  if (data.verified) {
    return { success: true, message: 'Email already verified', alreadyVerified: true };
  }
  
  // Check if token expired (24 hours)
  const createdAt = data.createdAt.toDate();
  const now = new Date();
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
  
  if (hoursDiff > 24) {
    throw new Error('Verification token expired');
  }
  
  // Mark as verified
  await db.collection('emailVerifications').doc(uid).update({
    verified: true,
    verifiedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Update user profile
  await db.collection('profiles').doc(uid).update({
    emailVerified: true,
    emailVerifiedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true, message: 'Email verified successfully' };
};

module.exports = {
  generateVerificationToken,
  storeVerificationToken,
  sendVerificationEmail,
  verifyEmailToken
};
