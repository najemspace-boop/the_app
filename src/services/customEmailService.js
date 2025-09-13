import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

// Custom email verification service using Firebase Functions + SMTP
export class CustomEmailService {
  constructor() {
    this.sendVerificationEmail = httpsCallable(functions, 'sendCustomEmailVerification');
    this.verifyToken = httpsCallable(functions, 'verifyEmailToken');
    this.resendEmail = httpsCallable(functions, 'resendVerificationEmail');
  }

  // Send custom email verification via SMTP
  async sendEmailVerification() {
    try {
      console.log('🔄 Sending custom email verification via SMTP...');
      
      const result = await this.sendVerificationEmail();
      
      console.log('✅ Custom email verification sent:', result.data);
      return {
        success: true,
        message: result.data.message,
        messageId: result.data.messageId
      };
      
    } catch (error) {
      console.error('❌ Custom email verification failed:', error);
      
      let errorMessage = 'Failed to send verification email';
      
      if (error.code === 'functions/unauthenticated') {
        errorMessage = 'Please sign in to send verification email';
      } else if (error.code === 'functions/resource-exhausted') {
        errorMessage = 'Please wait before requesting another email';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        code: error.code
      };
    }
  }

  // Resend verification email with rate limiting
  async resendEmailVerification() {
    try {
      console.log('🔄 Resending custom email verification...');
      
      const result = await this.resendEmail();
      
      console.log('✅ Custom email verification resent:', result.data);
      return {
        success: true,
        message: result.data.message,
        messageId: result.data.messageId
      };
      
    } catch (error) {
      console.error('❌ Custom email resend failed:', error);
      
      let errorMessage = 'Failed to resend verification email';
      
      if (error.code === 'functions/resource-exhausted') {
        errorMessage = 'Please wait 1 minute before requesting another email';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        code: error.code
      };
    }
  }

  // Verify email token (for programmatic verification)
  async verifyEmailToken(token, uid) {
    try {
      console.log('🔄 Verifying email token...');
      
      const result = await this.verifyToken({ token, uid });
      
      console.log('✅ Email token verified:', result.data);
      return {
        success: true,
        message: result.data.message
      };
      
    } catch (error) {
      console.error('❌ Email token verification failed:', error);
      
      return {
        success: false,
        error: error.message || 'Invalid or expired verification token',
        code: error.code
      };
    }
  }
}

// Create singleton instance
export const customEmailService = new CustomEmailService();
