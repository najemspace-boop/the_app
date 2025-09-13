import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Calendar, Clock, Users, MapPin, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    message: ''
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingDoc = await getDoc(doc(db, 'listings', id));
        if (listingDoc.exists()) {
          setListing({ id: listingDoc.id, ...listingDoc.data() });
        } else {
          toast.error('Listing not found');
          navigate('/search');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, navigate]);

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const basePrice = listing?.pricing?.basePrice || 0;
    const cleaningFee = listing?.pricing?.cleaningFee || 0;
    const serviceFee = Math.round(basePrice * nights * 0.14); // 14% service fee
    return (basePrice * nights) + cleaningFee + serviceFee;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to make a booking');
      navigate('/auth/login');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (bookingData.guests < 1) {
      toast.error('Please specify number of guests');
      return;
    }

    setSubmitting(true);

    try {
      const nights = calculateNights();
      const total = calculateTotal();
      
      // Create booking request
      const bookingRequest = {
        listingId: id,
        guestId: user.uid,
        hostId: listing.ownerId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        nights,
        pricing: {
          basePrice: listing.pricing.basePrice,
          cleaningFee: listing.pricing.cleaningFee || 0,
          serviceFee: Math.round(listing.pricing.basePrice * nights * 0.14),
          total
        },
        message: bookingData.message,
        status: 'pending', // pending, approved, rejected, expired
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        listingTitle: listing.title,
        listingImage: listing.coverPhoto || listing.photos?.[0]
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingRequest);
      
      toast.success('Booking request sent! You will receive a response within 24 hours.');
      navigate(`/booking-confirmation/${docRef.id}`);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/property/${id}`)}
            className="mb-4"
          >
            ← Back to Property
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Request to Book</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Trip</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in
                      </label>
                      <Input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out
                      </label>
                      <Input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guests
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={listing.details?.maxGuests || 10}
                      value={bookingData.guests}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guests: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message to Host (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows="4"
                      placeholder="Tell the host about your trip, who's coming, and why you're excited to stay..."
                      value={bookingData.message}
                      onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitting}
                  >
                    {submitting ? 'Sending Request...' : 'Request to Book'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            {/* Property Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <img
                    src={listing.coverPhoto || listing.photos?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'}
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {listing.location?.district}, {listing.location?.city}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">
                        {listing.rating || 4.5} ({listing.reviewsCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Price Details</CardTitle>
              </CardHeader>
              <CardContent>
                {nights > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>${listing.pricing?.basePrice || 0} x {nights} nights</span>
                      <span>${(listing.pricing?.basePrice || 0) * nights}</span>
                    </div>
                    
                    {listing.pricing?.cleaningFee > 0 && (
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>${listing.pricing.cleaningFee}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${Math.round((listing.pricing?.basePrice || 0) * nights * 0.14)}</span>
                    </div>
                    
                    <hr />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                )}
                
                {nights === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Select dates to see pricing
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Booking Policies */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Policies</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Host has 24 hours to respond to your request</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Free cancellation before check-in</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Maximum {listing.details?.maxGuests || 10} guests allowed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
