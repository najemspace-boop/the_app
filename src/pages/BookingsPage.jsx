import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Calendar, Clock, Users, MapPin, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const BookingsPage = () => {
  const { user, userProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('guest'); // 'guest' or 'host'

  useEffect(() => {
    if (!user) return;

    const fetchBookings = () => {
      // Query for bookings where user is either guest or host
      const guestQuery = query(
        collection(db, 'bookings'),
        where('guestId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const hostQuery = query(
        collection(db, 'bookings'),
        where('hostId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      let guestBookings = [];
      let hostBookings = [];

      // Listen to guest bookings
      const unsubscribeGuest = onSnapshot(guestQuery, (snapshot) => {
        guestBookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'guest'
        }));
        updateBookings();
      });

      // Listen to host bookings (only if user is owner)
      let unsubscribeHost = () => {};
      if (userProfile?.role === 'owner') {
        unsubscribeHost = onSnapshot(hostQuery, (snapshot) => {
          hostBookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: 'host'
          }));
          updateBookings();
        });
      }

      const updateBookings = () => {
        const allBookings = [...guestBookings, ...hostBookings];
        setBookings(allBookings);
        setLoading(false);
      };

      return () => {
        unsubscribeGuest();
        unsubscribeHost();
      };
    };

    const unsubscribe = fetchBookings();
    return unsubscribe;
  }, [user, userProfile]);

  const handleBookingAction = async (bookingId, action) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: action,
        updatedAt: new Date()
      });

      toast.success(`Booking ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const guestBookings = bookings.filter(b => b.type === 'guest');
  const hostBookings = bookings.filter(b => b.type === 'host');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Bookings</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('guest')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'guest'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Trips ({guestBookings.length})
            </button>
            {userProfile?.role === 'owner' && (
              <button
                onClick={() => setActiveTab('host')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'host'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Hosting Requests ({hostBookings.length})
              </button>
            )}
          </div>
        </div>

        {/* Guest Bookings */}
        {activeTab === 'guest' && (
          <div className="space-y-6">
            {guestBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-6">Start exploring and book your first stay!</p>
                  <Link to="/search">
                    <Button>Browse Properties</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              guestBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex space-x-4">
                        <img
                          src={booking.listingImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'}
                          alt={booking.listingTitle}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {booking.listingTitle}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${booking.pricing.total}</p>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                        
                        <Link to={`/booking-confirmation/${booking.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Host Bookings */}
        {activeTab === 'host' && userProfile?.role === 'owner' && (
          <div className="space-y-6">
            {hostBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests</h3>
                  <p className="text-gray-600 mb-6">When guests request to book your properties, they'll appear here.</p>
                  <Link to="/listings/new">
                    <Button>Create a Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              hostBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex space-x-4">
                        <img
                          src={booking.listingImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'}
                          alt={booking.listingTitle}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {booking.listingTitle}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {booking.message && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Guest message:</span> {booking.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right mb-2">
                          <p className="text-2xl font-bold text-gray-900">${booking.pricing.total}</p>
                          <p className="text-sm text-gray-600">Total earnings</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleBookingAction(booking.id, 'approved')}
                                className="flex items-center space-x-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Accept</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBookingAction(booking.id, 'rejected')}
                                className="flex items-center space-x-1"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Decline</span>
                              </Button>
                            </>
                          )}
                          
                          <Link to={`/booking-confirmation/${booking.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
