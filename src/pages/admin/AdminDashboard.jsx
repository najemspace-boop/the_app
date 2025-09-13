import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  Home, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  MessageSquare,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    pendingKYC: 0,
    totalBookings: 0,
    activeReports: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user stats
        const usersSnapshot = await getDocs(collection(db, 'profiles'));
        const totalUsers = usersSnapshot.size;

        // Fetch listings stats
        const listingsSnapshot = await getDocs(collection(db, 'listings'));
        const totalListings = listingsSnapshot.size;

        // Fetch pending KYC requests
        const kycQuery = query(
          collection(db, 'kycRequests'),
          where('status', '==', 'pending')
        );
        const kycSnapshot = await getDocs(kycQuery);
        const pendingKYC = kycSnapshot.size;

        // Fetch bookings stats
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        const totalBookings = bookingsSnapshot.size;

        setStats({
          totalUsers,
          totalListings,
          pendingKYC,
          totalBookings,
          activeReports: 0 // Placeholder for reports system
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.role === 'admin') {
      fetchStats();
    }
  }, [userProfile]);

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'KYC Reviews',
      description: `${stats.pendingKYC} pending reviews`,
      icon: FileText,
      link: '/admin/kyc',
      color: 'bg-orange-500',
      urgent: stats.pendingKYC > 0
    },
    {
      title: 'User Management',
      description: `${stats.totalUsers} total users`,
      icon: Users,
      link: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Listings Management',
      description: `${stats.totalListings} total listings`,
      icon: Home,
      link: '/admin/listings',
      color: 'bg-green-500'
    },
    {
      title: 'Bookings Overview',
      description: `${stats.totalBookings} total bookings`,
      icon: Calendar,
      link: '/admin/bookings',
      color: 'bg-purple-500'
    },
    {
      title: 'Reports & Issues',
      description: `${stats.activeReports} active reports`,
      icon: AlertTriangle,
      link: '/admin/reports',
      color: 'bg-red-500'
    },
    {
      title: 'Analytics',
      description: 'Platform insights',
      icon: TrendingUp,
      link: '/admin/analytics',
      color: 'bg-indigo-500'
    },
    {
      title: 'Content Management',
      description: 'Amenities, categories',
      icon: MessageSquare,
      link: '/admin/content',
      color: 'bg-teal-500'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform operations and monitor system health</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending KYC</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingKYC}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Link key={index} to={card.link}>
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  card.urgent ? 'ring-2 ring-orange-200' : ''
                }`}>
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${card.color}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <p className="text-sm text-gray-600">{card.description}</p>
                    {card.urgent && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Needs Attention
                        </span>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
