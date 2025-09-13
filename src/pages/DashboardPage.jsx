import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { 
  User, 
  FileText, 
  Home, 
  Search, 
  Plus, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Calendar,
  Users,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SeedDatabase from '../components/SeedDatabase';

const DashboardPage = () => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    bookings: 0,
    listings: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch booking stats
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('guestId', '==', user.uid)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        
        // Fetch host booking requests if user is owner
        let hostBookingsSnapshot = { size: 0 };
        let pendingCount = 0;
        
        if (userProfile?.role === 'owner') {
          const hostBookingsQuery = query(
            collection(db, 'bookings'),
            where('hostId', '==', user.uid)
          );
          hostBookingsSnapshot = await getDocs(hostBookingsQuery);
          
          // Count pending bookings
          const pendingQuery = query(
            collection(db, 'bookings'),
            where('hostId', '==', user.uid),
            where('status', '==', 'pending')
          );
          const pendingSnapshot = await getDocs(pendingQuery);
          pendingCount = pendingSnapshot.size;
        }

        // Fetch listings count if user is owner
        let listingsCount = 0;
        if (userProfile?.role === 'owner') {
          const listingsQuery = query(
            collection(db, 'listings'),
            where('ownerId', '==', user.uid)
          );
          const listingsSnapshot = await getDocs(listingsQuery);
          listingsCount = listingsSnapshot.size;
        }

        setStats({
          bookings: bookingsSnapshot.size,
          listings: listingsCount,
          pendingBookings: pendingCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user, userProfile]);

  const buyerCards = [
    {
      title: 'Search Properties',
      description: 'Find your perfect rental or purchase',
      icon: Home,
      link: '/search',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'My Bookings',
      description: `View your ${stats.bookings} booking${stats.bookings !== 1 ? 's' : ''}`,
      icon: Calendar,
      link: '/bookings',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Saved Properties',
      description: 'View your bookmarked listings',
      icon: Star,
      link: '/saved',
      color: 'bg-yellow-50 text-yellow-600'
    }
  ];

  const ownerCards = [
    {
      title: 'My Listings',
      description: `Manage your ${stats.listings} listing${stats.listings !== 1 ? 's' : ''}`,
      icon: Home,
      link: '/dashboard/listings',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Booking Requests',
      description: `${stats.pendingBookings} pending request${stats.pendingBookings !== 1 ? 's' : ''}`,
      icon: Calendar,
      link: '/bookings',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Add Property',
      description: 'List a new property',
      icon: Plus,
      link: '/listings/new',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Messages',
      description: 'Chat with tenants',
      icon: MessageCircle,
      link: '/messages',
      color: 'bg-purple-500'
    }
  ];

  const cards = userProfile?.role === 'owner' ? ownerCards : buyerCards;

  return (
    <div className="clay-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 clay-card">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {userProfile?.firstName || user?.displayName || 'User'}!
          </p>
        </div>

        {/* KYC Status for Owners */}
        {userProfile?.role === 'owner' && userProfile?.kycStatus !== 'approved' && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">KYC Verification Required</CardTitle>
              <CardDescription className="text-yellow-700">
                {userProfile?.kycStatus === 'pending' 
                  ? 'Your KYC verification is under review. You\'ll be able to list properties once approved.'
                  : 'Please complete KYC verification to start listing properties.'
                }
              </CardDescription>
            </CardHeader>
            {userProfile?.kycStatus !== 'pending' && (
              <CardContent>
                <Link to="/kyc">
                  <Button>Complete KYC Verification</Button>
                </Link>
              </CardContent>
            )}
          </Card>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Link key={index} to={card.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${card.color}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Database Seeding Section - Admin Only */}
        {userProfile?.role === 'admin' && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Setup</h2>
                <p className="text-gray-600 mb-6">
                  Get started by seeding your Firebase database with sample data including amenities, 
                  property categories, and example listings.
                </p>
              </div>
              <div className="lg:w-96">
                <SeedDatabase />
              </div>
            </div>
          </div>
        )}


        {/* Profile Section */}
        <Card className="clay-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{userProfile?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <p className="text-gray-900 capitalize">{userProfile?.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                <p className={userProfile?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                  {userProfile?.emailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
