import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { Calendar, Users, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format, differenceInDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const BookingFlow = ({ listing, checkIn, checkOut, guests, onBookingComplete }) => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    specialRequests: '',
    guestDetails: {
      firstName: userProfile?.displayName?.split(' ')[0] || '',
      lastName: userProfile?.displayName?.split(' ')[1] || '',
      email: user?.email || '',
      phone: userProfile?.phoneNumber || ''
    }
  });
  const [pricing, setPricing] = useState({
    basePrice: 0,
    nights: 0,
    subtotal: 0,
    serviceFee: 0,
    taxes: 0,
    total: 0
  });

  useEffect(() => {
    calculatePricing();
  }, [checkIn, checkOut, listing]);

  const calculatePricing = () => {
    if (!checkIn || !checkOut || !listing) return;

    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn));
    const basePrice = listing.price || 0;
    const subtotal = basePrice * nights;
    const serviceFee = subtotal * 0.12; // 12% service fee
    const taxes = subtotal * 0.08; // 8% taxes
    const total = subtotal + serviceFee + taxes;

    setPricing({
      basePrice,
      nights,
      subtotal,
      serviceFee,
      taxes,
      total
    });
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateBookingData = () => {
    const { guestDetails } = bookingData;
    
    if (!guestDetails.firstName || !guestDetails.lastName) {
      toast.error('Please provide your full name');
      return false;
    }
    
    if (!guestDetails.email || !guestDetails.phone) {
      toast.error('Please provide your contact information');
      return false;
    }
    
    return true;
  };

  const createBooking = async () => {
    if (!validateBookingData()) return;

    setLoading(true);
    try {
      // Create booking document
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        listingId: listing.id,
        guestId: user.uid,
        hostId: listing.ownerId,
        checkIn: parseISO(checkIn),
        checkOut: parseISO(checkOut),
        guests: parseInt(guests),
        status: 'pending',
        pricing: pricing,
        guestDetails: bookingData.guestDetails,
        specialRequests: bookingData.specialRequests,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        hostTimeoutMinutes: 1440 // 24 hours for host to respond
      });

      // Create notification for host
      await addDoc(collection(db, 'notifications'), {
        userId: listing.ownerId,
        type: 'booking_request',
        title: 'New Booking Request',
        message: `${bookingData.guestDetails.firstName} wants to book your property`,
        data: {
          bookingId: bookingRef.id,
          listingId: listing.id,
          checkIn,
          checkOut,
          guests
        },
        read: false,
        createdAt: serverTimestamp()
      });

      toast.success('Booking request sent! The host has 24 hours to respond.');
      onBookingComplete?.(bookingRef.id);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Guest Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <Input
              value={bookingData.guestDetails.firstName}
              onChange={(e) => handleInputChange('guestDetails.firstName', e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <Input
              value={bookingData.guestDetails.lastName}
              onChange={(e) => handleInputChange('guestDetails.lastName', e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={bookingData.guestDetails.email}
              onChange={(e) => handleInputChange('guestDetails.email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <Input
              type="tel"
              value={bookingData.guestDetails.phone}
              onChange={(e) => handleInputChange('guestDetails.phone', e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          value={bookingData.specialRequests}
          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Any special requests or requirements..."
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setStep(2)}>
          Continue to Review
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
        
        {/* Trip Details */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Check-in</div>
                  <div className="font-medium">{format(parseISO(checkIn), 'MMM d, yyyy')}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Check-out</div>
                  <div className="font-medium">{format(parseISO(checkOut), 'MMM d, yyyy')}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Guests</div>
                  <div className="font-medium">{guests} {guests === 1 ? 'guest' : 'guests'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Price Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>${pricing.basePrice} × {pricing.nights} nights</span>
              <span>${pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${pricing.serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${pricing.taxes.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${pricing.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Guest Details Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {bookingData.guestDetails.firstName} {bookingData.guestDetails.lastName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {bookingData.guestDetails.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {bookingData.guestDetails.phone}
              </div>
              {bookingData.specialRequests && (
                <div>
                  <span className="font-medium">Special Requests:</span>
                  <p className="text-gray-600 mt-1">{bookingData.specialRequests}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Your booking request will be sent to the host. They have 24 hours to accept or decline your request.
          If not responded to within this time, the request will automatically expire.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Back to Details
        </Button>
        <Button onClick={createBooking} disabled={loading}>
          {loading ? 'Sending Request...' : 'Send Booking Request'}
        </Button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to make a booking request.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className={`flex items-center space-x-1 ${step >= 1 ? 'text-primary-600' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span>Details</span>
          </div>
          <div className={`flex items-center space-x-1 ${step >= 2 ? 'text-primary-600' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span>Review</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
      </CardContent>
    </Card>
  );
};

export default BookingFlow;
