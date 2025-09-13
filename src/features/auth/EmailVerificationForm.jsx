import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailVerificationForm = () => {
  const { user, resendEmailVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await resendEmailVerification();
      setEmailSent(true);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (userProfile?.emailVerified) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your email has been verified successfully!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-800">
          <Mail className="h-5 w-5" />
          <span>Email Verification Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            Please verify your email address to access all features of the platform.
          </p>
          <p className="text-xs">
            Check your inbox for a verification email from us. If you don't see it, check your spam folder.
          </p>
        </div>

        {emailSent && (
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Verification email sent to {user?.email}. Please check your inbox and click the verification link.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleResendVerification}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <Button
            onClick={handleRefresh}
            size="sm"
            className="flex-1"
          >
            I've Verified - Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationForm;
