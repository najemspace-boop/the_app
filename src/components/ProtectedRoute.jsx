import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from './ui/Alert';
import { Button } from './ui/Button';
import { AlertCircle, Mail, Shield } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = null, requireEmailVerification = false, requireKYC = false }) => {
  const { user, userProfile, loading, resendEmailVerification } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check email verification for sensitive operations
  if (requireEmailVerification && !userProfile?.emailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="space-y-3">
                <p className="font-medium">Email verification required</p>
                <p className="text-sm">
                  Please verify your email address to access this feature. Check your inbox for a verification link.
                </p>
                <Button
                  size="sm"
                  onClick={resendEmailVerification}
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Resend verification email</span>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Check KYC verification for sensitive operations
  if (requireKYC && userProfile?.kycStatus !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-3">
                <p className="font-medium">KYC Verification Required</p>
                <p className="text-sm">
                  You need to complete identity verification to access this feature. This helps keep our platform secure.
                </p>
                <Button
                  size="sm"
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link to="/kyc">
                    <Shield className="h-4 w-4" />
                    <span>Complete KYC Verification</span>
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
