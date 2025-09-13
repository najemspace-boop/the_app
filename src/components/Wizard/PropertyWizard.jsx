import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useAuth } from "../../contexts/AuthContext";
import {
  CheckCircle,
  Circle,
  Home,
  MapPin,
  Star,
  Camera,
  DollarSign,
  FileText,
  Eye
} from "lucide-react";

import StepBasics from "./StepBasics";
import StepLocation from "./StepLocation";
import StepDetails from "./StepDetails";
import StepAmenities from "./StepAmenities";
import StepPropertyOptions from "./StepPropertyOptions";
import StepMedia from "./StepMedia";
import StepPricingAvailability from "./StepPricingAvailability";
import StepPolicies from "./StepPolicies";
import StepPreview from "./StepPreview";

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const PropertyWizard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState({});

  const steps = [
    { id: "basics", title: "Property Basics", description: "Tell us about your property", icon: <Home className="h-4 w-4" />, component: StepBasics },
    { id: "location", title: "Location", description: "Where is your property located?", icon: <MapPin className="h-4 w-4" />, component: StepLocation },
    { id: "details", title: "Property Details", description: "Size, rooms, and specifications", icon: <Home className="h-4 w-4" />, component: StepDetails },
    { id: "amenities", title: "Amenities", description: "What does your property offer?", icon: <Star className="h-4 w-4" />, component: StepAmenities },
    { id: "propertyOptions", title: "Property Features", description: "Additional features and facilities", icon: <Star className="h-4 w-4" />, component: StepPropertyOptions },
    { id: "media", title: "Photos & Media", description: "Show off your space", icon: <Camera className="h-4 w-4" />, component: StepMedia },
    { id: "pricing", title: "Pricing & Availability", description: "Set your rates and calendar", icon: <DollarSign className="h-4 w-4" />, component: StepPricingAvailability },
    { id: "policies", title: "Policies & Rules", description: "Set your house rules", icon: <FileText className="h-4 w-4" />, component: StepPolicies },
    { id: "preview", title: "Review & Publish", description: "Final review before going live", icon: <Eye className="h-4 w-4" /> }
  ];

  const regularSteps = steps.slice(0, -1);
  const CurrentStepComponent = regularSteps[currentStep]?.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = (stepData) => {
    const updatedData = { ...wizardData, ...stepData };
    setWizardData(updatedData);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalData) => {
    if (!user) {
      toast.error("Please sign in to create a listing.");
      return;
    }
    
    // Check if user can create listings (same as NewListingPage)
    if (userProfile?.role !== 'owner' || userProfile?.kycStatus !== 'approved') {
      toast.error(userProfile?.role !== 'owner' 
        ? 'Only property owners can create listings.'
        : 'Please complete KYC verification to create listings.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare listing data matching NewListingPage protocol
      const listingData = {
        // Basic info
        title: finalData.title || '',
        description: finalData.description || '',
        listingType: finalData.listingType || 'rent',
        propertyCategory: finalData.propertyCategory || 'residential',
        subCategory: finalData.subCategory || '',
        
        // Location
        location: finalData.location || {},
        
        // Property details
        propertyOptions: finalData.propertyOptions || {},
        
        // Amenities
        amenities: finalData.amenities || [],
        
        // Media
        photos: finalData.photos || [],
        coverPhoto: finalData.coverPhoto || '',
        videoUrl: finalData.videoUrl || '',
        
        // Property extras
        extras: finalData.extras || {},
        
        // Policies
        policies: finalData.policies || {},
        
        // Pricing
        pricing: finalData.pricing || {},
        availability: finalData.availability || {},
        
        // System fields
        ownerId: user.uid,
        status: 'published',
        rating: 0,
        reviewsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Create listing in Firestore
      const docRef = await addDoc(collection(db, 'listings'), listingData);
      
      toast.success('Listing published successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">List Your Property</h1>
          <p className="text-muted-foreground">Follow our step-by-step guide to create your listing</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg">Progress</CardTitle>
              <Badge variant="secondary">Step {currentStep + 1} of {steps.length}</Badge>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex items-center space-x-2 min-w-0 flex-shrink-0 ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : index === currentStep ? (
                    <Circle className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          {currentStep === steps.length - 1 ? (
            <StepPreview
              data={wizardData}
              onSubmit={() => handleSubmit(wizardData)}
              onBack={handleBack}
              onEdit={(stepIndex) => setCurrentStep(stepIndex)}
            />
          ) : (
            <CurrentStepComponent
              data={wizardData}
              onNext={handleNext}
              onBack={currentStep > 0 ? handleBack : undefined}
            />
          )}
        </div>

        <Card className="sm:hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
              <span className="text-sm text-muted-foreground">{currentStep + 1} / {steps.length}</span>
              <div className="w-16" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyWizard;
