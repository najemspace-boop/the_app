import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import toast from 'react-hot-toast';

// Import step components
import BasicsStep from './steps/BasicsStep';
import LocationStep from './steps/LocationStep';
import DetailsStep from './steps/DetailsStep';
import AmenitiesStep from './steps/AmenitiesStep';
import MediaStep from './steps/MediaStep';
import PropertyOptionsStep from './steps/PropertyOptionsStep';
import PoliciesStep from './steps/PoliciesStep';
import PricingStep from './steps/PricingStep';
import PreviewStep from './steps/PreviewStep';

const NewListingPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Basics
    title: '',
    description: '',
    descriptionRich: '',
    listingType: 'rent', // rent or sale
    propertyCategory: 'residential',
    subCategory: '',
    
    // Step 2: Location
    location: {
      city: '',
      district: '',
      address: '',
      lat: null,
      lng: null
    },
    
    // Step 3: Details
    propertyOptions: {
      area: '',
      bedrooms: '',
      bathrooms: '',
      floors: '',
      facing: '',
      readyStatus: '',
      ownership: '',
      furnishing: ''
    },
    
    // Step 4: Amenities
    amenities: [],
    
    // Step 5: Media
    photos: [],
    coverPhoto: '',
    videoUrl: '',
    
    // Step 6: Property Options (additional)
    extras: {
      pool: false,
      balcony: false,
      elevator: false,
      parking: false,
      garden: false,
      security: false
    },
    
    // Step 7: Policies
    policies: {
      rules: '',
      restrictions: '',
      cancellationPolicy: 'flexible'
    },
    
    // Step 8: Pricing & Availability
    pricing: {
      basePrice: '',
      currency: 'USD',
      discounts: {
        weekly: 0,
        monthly: 0
      }
    },
    availability: {
      availableFrom: '',
      minimumStay: 1,
      maximumStay: 365
    }
  });

  const steps = [
    { title: 'Basics', component: BasicsStep },
    { title: 'Location', component: LocationStep },
    { title: 'Details', component: DetailsStep },
    { title: 'Amenities', component: AmenitiesStep },
    { title: 'Media', component: MediaStep },
    { title: 'Property Options', component: PropertyOptionsStep },
    { title: 'Policies', component: PoliciesStep },
    { title: 'Pricing & Availability', component: PricingStep },
    { title: 'Preview', component: PreviewStep }
  ];

  // Check if user can create listings
  if (userProfile?.role !== 'owner' || userProfile?.kycStatus !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Access Denied</CardTitle>
            <CardDescription className="text-red-700">
              {userProfile?.role !== 'owner' 
                ? 'Only property owners can create listings.'
                : 'Please complete KYC verification to create listings.'
              }
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const updateFormData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadPhotos = async (photos) => {
    const uploadPromises = photos.map(async (photo, index) => {
      const photoRef = ref(storage, `listings/${user.uid}/${Date.now()}_${index}_${photo.name}`);
      const snapshot = await uploadBytes(photoRef, photo);
      return getDownloadURL(snapshot.ref);
    });
    
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (isDraft = false) => {
    setLoading(true);
    try {
      // Upload photos
      let photoUrls = [];
      if (formData.photos.length > 0) {
        photoUrls = await uploadPhotos(formData.photos);
      }

      // Prepare listing data
      const listingData = {
        ...formData,
        ownerId: user.uid,
        photos: photoUrls,
        coverPhoto: photoUrls[0] || '',
        status: isDraft ? 'draft' : 'published',
        rating: 0,
        reviewsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Remove file objects from the data
      delete listingData.photos;
      listingData.photos = photoUrls;

      // Create listing in Firestore
      const docRef = await addDoc(collection(db, 'listings'), listingData);
      
      toast.success(`Listing ${isDraft ? 'saved as draft' : 'published'} successfully!`);
      navigate('/dashboard/listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2 text-sm font-medium text-gray-700">
          {steps[currentStep].title}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-3">
          {currentStep === steps.length - 1 ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <span>{loading ? 'Publishing...' : 'Publish Listing'}</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewListingPage;
