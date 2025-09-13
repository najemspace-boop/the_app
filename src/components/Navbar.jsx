import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Home, Search, User, LogOut, Plus, Calendar } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Force navigation to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to home
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900">PropertyHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/search">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </Link>

            <LanguageToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                {userProfile?.role === 'owner' && (
                  <Link to="/listings/new">
                    <Button size="sm" className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Property</span>
                    </Button>
                  </Link>
                )}
                
                <Link to="/bookings">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Bookings</span>
                  </Button>
                </Link>

                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
