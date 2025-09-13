import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { CheckCircle, X, Clock, Calendar, Users, DollarSign, MessageSquare } from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const BookingManager = ({ userRole = 'guest' }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, userRole]);

  const fetchBookings = () => {
    if (!user) return;

    setLoading(true);
    
    // Query based on user role
    const bookingsQuery = userRole === 'host' 
      ? query(
          collection(db, 'bookings'),
          where('hostId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
      : query(
          collection(db, 'bookings'),
          where('guestId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = [];
      snapshot.forEach((doc) => {
        bookingsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setBookings(bookingsData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const handleBookingAction = async (bookingId, action, reason = '') => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const booking = bookings.find(b => b.id === bookingId);
      
      if (action === 'accept') {
        // Move to reservations collection
        await addDoc(collection(db, 'reservations'), {
          ...booking,
          status: 'confirmed',
          confirmedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Update booking status
        await updateDoc(bookingRef, {
          status: 'accepted',
          acceptedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Create notification for guest
        await addDoc(collection(db, 'notifications'), {
          userId: booking.guestId,
          type: 'booking_accepted',
          title: 'Booking Confirmed!',
          message: 'Your booking request has been accepted',
          data: {
            bookingId,
            listingId: booking.listingId
          },
          read: false,
          createdAt: serverTimestamp()
        });

        toast.success('Booking accepted and confirmed!');
      } else if (action === 'decline') {
        await updateDoc(bookingRef, {
          status: 'declined',
          declinedAt: serverTimestamp(),
          declineReason: reason,
          updatedAt: serverTimestamp()
        });

        // Create notification for guest
        await addDoc(collection(db, 'notifications'), {
          userId: booking.guestId,
          type: 'booking_declined',
          title: 'Booking Declined',
          message: reason || 'Your booking request has been declined',
          data: {
            bookingId,
            listingId: booking.listingId
          },
          read: false,
          createdAt: serverTimestamp()
        });

        toast.success('Booking declined');
      } else if (action === 'cancel') {
        await updateDoc(bookingRef, {
          status: 'cancelled',
          cancelledAt: serverTimestamp(),
          cancelReason: reason,
          updatedAt: serverTimestamp()
        });

        // Create notification for host
        await addDoc(collection(db, 'notifications'), {
          userId: booking.hostId,
          type: 'booking_cancelled',
          title: 'Booking Cancelled',
          message: 'A guest has cancelled their booking',
          data: {
            bookingId,
            listingId: booking.listingId
          },
          read: false,
          createdAt: serverTimestamp()
        });

        toast.success('Booking cancelled');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'declined':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const BookingCard = ({ booking }) => {
    const [showDeclineForm, setShowDeclineForm] = useState(false);
    const [declineReason, setDeclineReason] = useState('');

    return (
      <Card key={booking.id} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {userRole === 'host' ? 'Booking Request' : 'Your Booking'}
            </CardTitle>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Check-in</div>
                <div className="font-medium">
                  {format(booking.checkIn.toDate(), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Check-out</div>
                <div className="font-medium">
                  {format(booking.checkOut.toDate(), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Guests</div>
                <div className="font-medium">{booking.guests}</div>
              </div>
            </div>
          </div>

          {/* Guest/Host Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              {userRole === 'host' ? 'Guest Information' : 'Booking Details'}
            </h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Name:</span> {booking.guestDetails.firstName} {booking.guestDetails.lastName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {booking.guestDetails.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {booking.guestDetails.phone}
              </div>
              {booking.specialRequests && (
                <div>
                  <span className="font-medium">Special Requests:</span>
                  <p className="text-gray-600 mt-1">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>Total Amount</span>
              </span>
              <span className="text-lg font-bold">${booking.pricing.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          {booking.status === 'pending' && (
            <div className="flex space-x-2">
              {userRole === 'host' ? (
                <>
                  <Button
                    onClick={() => handleBookingAction(booking.id, 'accept')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeclineForm(!showDeclineForm)}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleBookingAction(booking.id, 'cancel', 'Cancelled by guest')}
                >
                  Cancel Request
                </Button>
              )}
            </div>
          )}

          {/* Decline Form */}
          {showDeclineForm && (
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for declining (optional)
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Let the guest know why you're declining..."
              />
              <div className="flex space-x-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    handleBookingAction(booking.id, 'decline', declineReason);
                    setShowDeclineForm(false);
                    setDeclineReason('');
                  }}
                >
                  Confirm Decline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeclineForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Message Button */}
          <div className="border-t pt-4">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Message {userRole === 'host' ? 'Guest' : 'Host'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {userRole === 'host' ? 'Booking Requests' : 'My Bookings'}
        </h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {['all', 'pending', 'accepted', 'declined', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Alert>
          <AlertDescription>
            {filter === 'all' 
              ? `No ${userRole === 'host' ? 'booking requests' : 'bookings'} found.`
              : `No ${filter} ${userRole === 'host' ? 'booking requests' : 'bookings'} found.`
            }
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManager;