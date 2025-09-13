# 🔧 Custom SMTP Email Verification Setup Guide

## Overview
This guide will help you set up a reliable custom SMTP email verification system using Firebase Cloud Functions and Nodemailer. This replaces Firebase's unreliable built-in email verification with your own SMTP server.

## 📋 Prerequisites
- Gmail account (or other SMTP provider)
- Firebase project with Functions enabled
- Node.js installed

## 🚀 Step-by-Step Setup

### 1. Install Dependencies
```bash
cd functions
npm install nodemailer crypto
```

### 2. Configure SMTP Settings

#### Option A: Gmail SMTP (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings > Security
   - Click "2-Step Verification" 
   - Click "App passwords"
   - Generate password for "Mail"
   - Copy the 16-character password

#### Option B: Other SMTP Providers
- **Outlook/Hotmail**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Use your hosting provider's SMTP settings

### 3. Set Firebase Functions Environment Variables
```bash
# Navigate to functions directory
cd functions

# Set SMTP configuration
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="your-email@gmail.com"
firebase functions:config:set smtp.pass="your-app-password"
firebase functions:config:set app.url="http://localhost:5173"

# For production, update app.url:
# firebase functions:config:set app.url="https://yourdomain.com"
```

### 4. Deploy Firebase Functions
```bash
# Build and deploy functions
npm run build
firebase deploy --only functions
```

### 5. Update Frontend Routes
Add the email verification route to your React Router:

```jsx
// In your main App.jsx or router configuration
import EmailVerifiedPage from './pages/EmailVerifiedPage';

// Add this route
<Route path="/email-verified" element={<EmailVerifiedPage />} />
<Route path="/verify-email" element={<EmailVerifiedPage />} />
```

## 🔧 Configuration Options

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `smtp.host` | SMTP server hostname | `smtp.gmail.com` |
| `smtp.port` | SMTP server port | `587` |
| `smtp.user` | Your email address | `your-email@gmail.com` |
| `smtp.pass` | App password or SMTP password | `abcd efgh ijkl mnop` |
| `app.url` | Your app's URL for verification links | `https://yourdomain.com` |

### Email Template Customization
The email template is in `functions/src/emailService.js`. You can customize:
- **Subject line**: Change the `subject` field
- **HTML template**: Modify the HTML content
- **Styling**: Update CSS styles
- **Languages**: Add more language support

## 🎯 How It Works

### 1. User Registration/Resend
- User clicks "Send Verification Email"
- Frontend calls `customEmailService.resendEmailVerification()`
- Firebase Function generates unique token
- Email sent via SMTP with verification link

### 2. Email Verification
- User clicks link in email
- Redirected to `/verify-email?token=xxx&uid=xxx`
- Frontend verifies token via Firebase Function
- User profile updated with `emailVerified: true`

### 3. Fallback System
- If SMTP fails, falls back to Firebase's built-in system
- Ensures email verification always works

## 📧 Email Features

### ✅ What's Included
- **Bilingual emails** (Arabic + English)
- **Beautiful HTML design** with your branding
- **Security features** (24-hour expiration, one-time use)
- **Rate limiting** (1-minute cooldown)
- **Fallback system** (Firebase backup)
- **Comprehensive error handling**

### 🎨 Email Design
- **Arabic-first design** with RTL support
- **Your بيوت branding** prominently displayed
- **Professional styling** with gradients and modern UI
- **Security notices** in both languages
- **Mobile-responsive** design

## 🔍 Testing & Debugging

### Test Email Sending
```javascript
// In browser console after signing in
const result = await customEmailService.resendEmailVerification();
console.log(result);
```

### Check Firebase Functions Logs
```bash
firebase functions:log
```

### Common Issues & Solutions

#### 1. "Authentication failed" Error
- **Cause**: Wrong email/password
- **Solution**: Double-check SMTP credentials, use app password for Gmail

#### 2. "Connection timeout" Error
- **Cause**: Firewall or network issues
- **Solution**: Try different SMTP port (465 for SSL)

#### 3. "Functions not found" Error
- **Cause**: Functions not deployed
- **Solution**: Run `firebase deploy --only functions`

#### 4. Emails going to spam
- **Cause**: SMTP reputation
- **Solution**: Use established email provider (Gmail), add SPF/DKIM records

## 🚀 Production Deployment

### 1. Update Environment Variables
```bash
# Set production URL
firebase functions:config:set app.url="https://yourdomain.com"

# Deploy to production
firebase deploy --only functions --project your-production-project
```

### 2. DNS Configuration (Optional)
For better deliverability, add these DNS records:
- **SPF Record**: `v=spf1 include:_spf.google.com ~all`
- **DKIM**: Enable in Gmail/Google Workspace
- **DMARC**: `v=DMARC1; p=quarantine; rua=mailto:your-email@domain.com`

## 📊 Monitoring & Analytics

### Firebase Functions Monitoring
- Monitor function execution in Firebase Console
- Set up alerts for function failures
- Track email delivery success rates

### Email Delivery Tracking
- Check SMTP provider's delivery reports
- Monitor bounce rates and spam complaints
- Track verification completion rates

## 🔒 Security Best Practices

### ✅ Implemented Security Features
- **Token expiration** (24 hours)
- **One-time use tokens**
- **Rate limiting** (1 minute cooldown)
- **User authentication required**
- **Secure token generation** (crypto.randomBytes)

### 🛡️ Additional Recommendations
- **Monitor for abuse** (excessive requests)
- **Implement IP-based rate limiting**
- **Log all verification attempts**
- **Regular security audits**

## 📞 Support & Troubleshooting

If you encounter issues:
1. Check Firebase Functions logs
2. Verify SMTP credentials
3. Test with different email providers
4. Check spam folders
5. Ensure proper DNS configuration

Your custom SMTP email verification system is now ready! 🎉

This system provides:
- ✅ **Reliable email delivery** via SMTP
- ✅ **Beautiful bilingual emails** with your branding
- ✅ **Comprehensive error handling** and fallbacks
- ✅ **Security features** and rate limiting
- ✅ **Professional user experience**
