import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { CheckCircle, Clock, AlertCircle, FileText, Upload } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

const KYCStatusChecker = ({ showActions = true }) => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [kycRequest, setKycRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYCStatus();
  }, [user]);

  const fetchKYCStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const kycQuery = query(
        collection(db, 'kycRequests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(kycQuery);
      if (!querySnapshot.empty) {
        setKycRequest(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'KYC Approved - You can now list properties';
      case 'pending':
        return 'KYC Under Review - We\'ll notify you once processed';
      case 'rejected':
        return 'KYC Rejected - Please submit new documents';
      default:
        return 'KYC Required - Complete verification to list properties';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'border-green-200 bg-green-50';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const shouldShowKYC = () => {
    return userProfile?.role === 'owner' && userProfile?.kycStatus !== 'approved';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  if (!shouldShowKYC()) {
    return null;
  }

  const status = userProfile?.kycStatus || 'not_required';

  return (
    <Alert className={getStatusColor(status)}>
      <div className="flex items-start space-x-3">
        {getStatusIcon(status)}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{getStatusText(status)}</h4>
          
          {status === 'pending' && kycRequest && (
            <p className="text-xs text-gray-600 mt-1">
              Submitted on {new Date(kycRequest.createdAt?.toDate()).toLocaleDateString()}
            </p>
          )}
          
          {status === 'rejected' && (
            <p className="text-xs text-red-600 mt-1">
              Please review the requirements and submit new documents.
            </p>
          )}

          {showActions && (status === 'not_required' || status === 'rejected') && (
            <div className="mt-2">
              <Button asChild size="sm" variant="outline">
                <Link to="/kyc">
                  <Upload className="h-4 w-4 mr-1" />
                  Submit KYC Documents
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default KYCStatusChecker;