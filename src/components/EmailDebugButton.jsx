import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { debugEmailVerification } from '../utils/emailDebugger';

const EmailDebugButton = () => {
  const { user } = useAuth();

  const handleDebug = async () => {
    if (!user) {
      alert("Please sign in first to debug email verification");
      return;
    }

    console.clear();
    console.log("🚀 Starting Email Verification Debug...");
    
    // Run comprehensive debug
    const result = await debugEmailVerification();
    
    if (result.success) {
      console.log("✅ Debug completed successfully");
    } else {
      console.error("❌ Debug found issues:", result.error);
    }
  };

  if (!user || userProfile?.emailVerified) {
    return null;
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-semibold text-yellow-800 mb-2">
        🔍 Email Verification Debug
      </h3>
      <p className="text-sm text-yellow-700 mb-3">
        Not receiving verification emails? Click below to run diagnostics.
      </p>
      <Button 
        onClick={handleDebug}
        variant="outline"
        size="sm"
        className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
      >
        🔧 Debug Email Issues
      </Button>
    </div>
  );
};

export default EmailDebugButton;
