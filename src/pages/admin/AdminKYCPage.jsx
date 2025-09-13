import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  FileText, 
  User, 
  Calendar, 
  Download, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminKYCPage = () => {
  const { userProfile } = useAuth();
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    if (userProfile?.role !== 'admin') return;

    const q = query(
      collection(db, 'kycRequests'),
      where('status', 'in', ['pending', 'under_review'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setKycRequests(requests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile]);

  const handleKYCAction = async (requestId, action, reason = '') => {
    setProcessing(prev => ({ ...prev, [requestId]: true }));

    try {
      const kycRef = doc(db, 'kycRequests', requestId);
      const kycDoc = await getDoc(kycRef);
      
      if (!kycDoc.exists()) {
        toast.error('KYC request not found');
        return;
      }

      const kycData = kycDoc.data();
      const userId = kycData.userId;

      // Update KYC request status
      await updateDoc(kycRef, {
        status: action,
        reviewedAt: new Date(),
        reviewedBy: userProfile.uid,
        rejectionReason: action === 'rejected' ? reason : null,
        updatedAt: new Date()
      });

      // If approved, update user role to owner
      if (action === 'approved') {
        const userRef = doc(db, 'profiles', userId);
        await updateDoc(userRef, {
          role: 'owner',
          kycStatus: 'approved',
          kycApprovedAt: new Date(),
          updatedAt: new Date()
        });
      } else if (action === 'rejected') {
        const userRef = doc(db, 'profiles', userId);
        await updateDoc(userRef, {
          kycStatus: 'rejected',
          kycRejectedAt: new Date(),
          updatedAt: new Date()
        });
      }

      toast.success(`KYC request ${action} successfully`);
    } catch (error) {
      console.error('Error processing KYC:', error);
      toast.error('Failed to process KYC request');
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status] || variants.pending}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access KYC reviews.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KYC Reviews</h1>
          <p className="text-gray-600">Review and approve KYC verification requests</p>
        </div>

        {kycRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending KYC requests</h3>
              <p className="text-gray-600">All KYC requests have been processed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {kycRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{request.personalInfo?.fullName || 'Unknown User'}</span>
                    </CardTitle>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Full Name:</span>
                          <span className="font-medium">{request.personalInfo?.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date of Birth:</span>
                          <span className="font-medium">{request.personalInfo?.dateOfBirth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nationality:</span>
                          <span className="font-medium">{request.personalInfo?.nationality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{request.personalInfo?.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-right max-w-xs">
                            {request.personalInfo?.address}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-gray-900 mb-2">Business Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Business Type:</span>
                            <span className="font-medium">{request.businessInfo?.businessType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Experience:</span>
                            <span className="font-medium">{request.businessInfo?.experience}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Properties:</span>
                            <span className="font-medium">{request.businessInfo?.propertyCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents & Actions */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Documents</h4>
                      <div className="space-y-3">
                        {request.fileUrl ? (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-sm">{request.documentType?.replace('_', ' ').toUpperCase() || 'Identity Document'}</p>
                                <p className="text-xs text-gray-600">
                                  Submitted document
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(request.fileUrl, '_blank')}
                              className="flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                            No documents found
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {formatDate(request.createdAt)}</span>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleKYCAction(request.id, 'approved')}
                              disabled={processing[request.id]}
                              className="flex-1 flex items-center justify-center space-x-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const reason = prompt('Please provide a reason for rejection:');
                                if (reason) {
                                  handleKYCAction(request.id, 'rejected', reason);
                                }
                              }}
                              disabled={processing[request.id]}
                              className="flex-1 flex items-center justify-center space-x-2"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </Button>
                          </div>
                        )}

                        {processing[request.id] && (
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKYCPage;
