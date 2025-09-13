import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { customEmailService } from '../services/customEmailService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckCircle, XCircle, Loader2, Home, User } from 'lucide-react';

const EmailVerifiedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const success = searchParams.get('success');
      const token = searchParams.get('token');
      const uid = searchParams.get('uid');

      // If success=true, email was already verified by the server
      if (success === 'true') {
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        
        // Refresh user profile to update email verification status
        if (refreshProfile) {
          await refreshProfile();
        }
        return;
      }

      // If we have token and uid, verify programmatically
      if (token && uid) {
        try {
          const result = await customEmailService.verifyEmailToken(token, uid);
          
          if (result.success) {
            setStatus('success');
            if (result.alreadyVerified) {
              setMessage('Your email was already verified! You have full access to all features.');
            } else {
              setMessage('Your email has been successfully verified!');
            }
            
            // Refresh user profile
            if (refreshProfile) {
              await refreshProfile();
            }
          } else {
            setStatus('error');
            setMessage(result.error || 'Email verification failed');
          }
        } catch (error) {
          setStatus('error');
          setMessage('Email verification failed. The link may be expired or invalid.');
        }
      } else {
        setStatus('error');
        setMessage('Invalid verification link');
      }
    };

    verifyEmail();
  }, [searchParams, refreshProfile]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
          </div>
          
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && '✅ Email Verified!'}
            {status === 'error' && '❌ Verification Failed'}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {status === 'loading' && 'Please wait while we verify your email address...'}
            {message}
          </p>

          {status === 'success' && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">🎉 Welcome to بيوت Property Platform!</p>
                <p className="text-green-700 text-sm mt-1">
                  Your email has been verified. You now have full access to all features.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleGoHome}
                  className="flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go to Home</span>
                </Button>
                
                {user && (
                  <Button 
                    onClick={handleGoToProfile}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Verification Failed</p>
                <p className="text-red-700 text-sm mt-1">
                  The verification link may be expired, invalid, or already used.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go to Home</span>
                </Button>
                
                {user && !userProfile?.emailVerified && (
                  <p className="text-sm text-gray-600">
                    You can request a new verification email from your profile page.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerifiedPage;
