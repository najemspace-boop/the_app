import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckCircle, Clock, XCircle, Calendar, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (!id) {
      navigate('/dashboard');
      return;
    }

    // Set up real-time listener for booking status updates
    const unsubscribe = onSnapshot(
      doc(db, 'bookings', id),
      (doc) => {
        if (doc.exists()) {
          const bookingData = { id: doc.id, ...doc.data() };
          
          // Check if user is authorized to view this booking
          if (bookingData.guestId !== user.uid && bookingData.hostId !== user.uid) {
            toast.error('You are not authorized to view this booking');
            navigate('/dashboard');
            return;
          }
          
          setBooking(bookingData);
        } else {
          toast.error('Booking not found');
          navigate('/dashboard');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id, user, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'expired':
        return <XCircle className="h-8 w-8 text-gray-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Booking Request Sent',
          message: 'Your booking request has been sent to the host. You will receive a response within 24 hours.',
          color: 'text-yellow-600'
        };
      case 'approved':
        return {
          title: 'Booking Confirmed!',
          message: 'Congratulations! Your booking has been approved by the host. You will receive further instructions via email.',
          color: 'text-green-600'
        };
      case 'rejected':
        return {
          title: 'Booking Declined',
          message: 'Unfortunately, the host has declined your booking request. Please try booking different dates or another property.',
          color: 'text-red-600'
        };
      case 'expired':
        return {
          title: 'Booking Request Expired',
          message: 'Your booking request has expired as the host did not respond within 24 hours. Please try booking again.',
          color: 'text-gray-600'
        };
      default:
        return {
          title: 'Booking Status Unknown',
          message: 'There was an issue loading your booking status.',
          color: 'text-gray-600'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {getStatusIcon(booking.status)}
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>
            {statusInfo.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {statusInfo.message}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Info */}
              <div className="flex space-x-4">
                <img
                  src={booking.listingImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'}
                  alt={booking.listingTitle}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {booking.listingTitle}
                  </h3>
                  <p className="text-gray-600">Booking ID: {booking.id}</p>
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-gray-600">{formatDate(booking.checkIn)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-gray-600">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-gray-600">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">{booking.nights} night{booking.nights > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Message to Host */}
              {booking.message && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message to Host</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {booking.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>${booking.pricing.basePrice} x {booking.nights} nights</span>
                  <span>${booking.pricing.basePrice * booking.nights}</span>
                </div>
                
                {booking.pricing.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>${booking.pricing.cleaningFee}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${booking.pricing.serviceFee}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${booking.pricing.total}</span>
                </div>
              </div>

              {/* Booking Status Timeline */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-4">Booking Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Request Sent</p>
                      <p className="text-sm text-gray-600">
                        {booking.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                      </p>
                    </div>
                  </div>
                  
                  {booking.status === 'approved' && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Booking Approved</p>
                        <p className="text-sm text-gray-600">Host accepted your request</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.status === 'rejected' && (
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Booking Declined</p>
                        <p className="text-sm text-gray-600">Host declined your request</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.status === 'pending' && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Awaiting Response</p>
                        <p className="text-sm text-gray-600">
                          Expires: {new Date(booking.expiresAt.toDate()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          
          {booking.status === 'approved' && (
            <Link to={`/property/${booking.listingId}`}>
              <Button>View Property</Button>
            </Link>
          )}
          
          {(booking.status === 'rejected' || booking.status === 'expired') && (
            <Link to="/search">
              <Button>Find Another Property</Button>
            </Link>
          )}
          
          {booking.status === 'pending' && (
            <Link to={`/property/${booking.listingId}`}>
              <Button variant="outline">View Property</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
