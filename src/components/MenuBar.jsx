import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu, User, Globe, Heart, Settings, LogOut, LogIn, UserPlus, Home, Shield, Building, Plus, Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "./ThemeProvider";

export function MenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await logout();
  };

  // Status checking functions
  const getEmailVerificationStatus = () => {
    return userProfile?.emailVerified ? 'verified' : 'required';
  };

  const getKYCStatus = () => {
    if (!userProfile?.emailVerified) return 'email_required';
    if (userProfile?.kycStatus === 'approved') return 'verified';
    return 'required';
  };

  const handleDisabledClick = (feature, requirement) => {
    if (requirement === 'email_required') {
      alert('Please verify your email first to access this feature.');
    } else if (requirement === 'kyc_required') {
      alert('Please complete KYC verification to access this feature.');
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-transparent max-w-7xl">
        <div className="flex items-center justify-between h-16 bg-transparent">
          {/* Left - Logo/Home */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-13 w-12 object-contain"
            />
          </Link>

          {/* Center - Language Toggle */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Button variant="ghost" size="sm" className="flex" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-2" />
              {language.toUpperCase()}
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

            {user ? (
              <div className="flex items-center space-x-2">
                {/* Favorites for authenticated users */}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/favorites">
                    <Heart className="h-4 w-4 text-slate-500" />
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                      <Menu className="h-4 w-4" />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.photoURL || "/placeholder.svg"} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 backdrop-blur-xl bg-popover border border-border shadow-xl">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookings">
                        <Settings className="h-4 w-4 mr-2" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* My Favorites - Always accessible */}
                    <DropdownMenuItem asChild>
                      <Link to="/favorites" className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          My Favorites
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    {/* ID Verification - Show status */}
                    <DropdownMenuItem
                      asChild={getEmailVerificationStatus() === 'verified'}
                      onClick={getEmailVerificationStatus() !== 'verified' ? () => handleDisabledClick('ID Verification', 'email_required') : undefined}
                    >
                      {getEmailVerificationStatus() === 'verified' ? (
                        <Link to="/kyc" className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            ID Verification
                          </div>
                          <span className="text-xs text-green-600">
                            {getKYCStatus() === 'verified' ? 'Verified' : 'Verified'}
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between text-gray-400 cursor-pointer px-2 py-1.5 hover:bg-gray-100">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            ID Verification
                          </div>
                          <span className="text-xs text-red-500">Required</span>
                        </div>
                      )}
                    </DropdownMenuItem>

                    {/* My Properties - Show KYC status */}
                    <DropdownMenuItem
                      asChild={getKYCStatus() === 'verified'}
                      onClick={getKYCStatus() !== 'verified' ? () => handleDisabledClick('My Properties', getKYCStatus() === 'email_required' ? 'email_required' : 'kyc_required') : undefined}
                    >
                      {getKYCStatus() === 'verified' ? (
                        <Link to="/dashboard" className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            My Properties
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between text-gray-400 cursor-pointer px-2 py-1.5 hover:bg-gray-100">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            My Properties
                          </div>
                          <span className="text-xs text-orange-500">
                            {getKYCStatus() === 'email_required' ? 'Required' : 'KYC Required'}
                          </span>
                        </div>
                      )}
                    </DropdownMenuItem>

                    {/* Add Property - Show KYC status */}
                    <DropdownMenuItem
                      asChild={getKYCStatus() === 'verified'}
                      onClick={getKYCStatus() !== 'verified' ? () => handleDisabledClick('Add Property', getKYCStatus() === 'email_required' ? 'email_required' : 'kyc_required') : undefined}
                    >
                      {getKYCStatus() === 'verified' ? (
                        <Link to="/listings/new" className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Property
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between text-gray-400 cursor-pointer px-2 py-1.5 hover:bg-gray-100">
                          <div className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Property
                          </div>
                          <span className="text-xs text-orange-500">
                            {getKYCStatus() === 'email_required' ? 'Required' : 'KYC Required'}
                          </span>
                        </div>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Theme Selection */}
                    <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light Theme
                      </div>
                      {theme === 'light' && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark Theme
                      </div>
                      {theme === 'dark' && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        System Theme
                      </div>
                      {theme === 'system' && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <Menu className="h-4 w-4" />
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-popover border border-border shadow-xl">
                  <DropdownMenuItem asChild>
                    <Link to="/auth/register">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/listings/new">
                      <Home className="h-4 w-4 mr-2" />
                      Host your home
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Theme Selection for non-authenticated users */}
                  <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Light Theme
                    </div>
                    {theme === 'light' && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Theme
                    </div>
                    {theme === 'dark' && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2" />
                      System Theme
                    </div>
                    {theme === 'system' && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}