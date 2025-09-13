import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import toast from 'react-hot-toast';

const KYCPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'national_id',
    file: null
  });

  const documentTypes = [
    { value: 'national_id', label: 'National ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' }
  ];

  const validateFile = (file) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return false;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and PDF files are allowed');
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setFormData({ ...formData, file });
      toast.success('File uploaded successfully!');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setFormData({ ...formData, file });
        toast.success('File uploaded successfully!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error('Please select a document to upload');
      return;
    }

    setLoading(true);
    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `kyc/${user.uid}/${Date.now()}_${formData.file.name}`);
      const snapshot = await uploadBytes(fileRef, formData.file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      // Create KYC request in Firestore
      await addDoc(collection(db, 'kycRequests'), {
        userId: user.uid,
        documentType: formData.documentType,
        fileUrl,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      toast.success('KYC document submitted successfully! We\'ll review it within 24-48 hours.');
      navigate('/dashboard');
    } catch (error) {
      console.error('KYC submission error:', error);
      toast.error('Failed to submit KYC document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getKYCStatusIcon = (status) => {
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

  const getKYCStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Your KYC has been approved! You can now list properties.';
      case 'pending':
        return 'Your KYC is under review. We\'ll notify you once it\'s processed.';
      case 'rejected':
        return 'Your KYC was rejected. Please submit new documents.';
      default:
        return 'Complete KYC verification to start listing properties.';
    }
  };

  const getKYCStatusColor = (status) => {
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">KYC Verification</h1>
        <p className="text-gray-600">
          Complete your identity verification to start listing properties on our platform.
        </p>
      </div>

      {/* Current KYC Status */}
      <Card className={`mb-8 ${getKYCStatusColor(userProfile?.kycStatus)}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getKYCStatusIcon(userProfile?.kycStatus)}
            <span>Verification Status</span>
          </CardTitle>
          <CardDescription>
            {getKYCStatusText(userProfile?.kycStatus)}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* KYC Form */}
      {(!userProfile?.kycStatus || userProfile?.kycStatus === 'not_required' || userProfile?.kycStatus === 'rejected') && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Verification Documents</CardTitle>
            <CardDescription>
              Upload a clear photo of your government-issued ID for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document
                </label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                    dragActive 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 5MB
                    </p>
                    {dragActive && (
                      <p className="text-sm text-primary-600 font-medium">
                        Drop your file here!
                      </p>
                    )}
                  </div>
                </div>
                {formData.file && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{formData.file.name}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Document Requirements
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Document must be clear and readable</li>
                        <li>All corners of the document should be visible</li>
                        <li>Document should not be expired</li>
                        <li>File size should be less than 5MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !formData.file}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pending Status Info */}
      {userProfile?.kycStatus === 'pending' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Review Process</p>
                  <p>Our team will review your documents within 24-48 hours.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Notification</p>
                  <p>You'll receive an email notification once the review is complete.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Start Listing</p>
                  <p>Once approved, you can immediately start listing your properties.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KYCPage;
