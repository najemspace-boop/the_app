import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { MenuBar } from './components/MenuBar';
import ProtectedRoute from './components/ProtectedRoute';
import Toaster from './components/Toaster';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import PropertyPage from './pages/PropertyPage';
import ProfilePage from './pages/ProfilePage';
import KYCPage from './pages/KYCPage';
import PropertyWizard from './components/Wizard/PropertyWizard.jsx';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingsPage from './pages/BookingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminKYCPage from './pages/admin/AdminKYCPage';
import FavoritesPage from './pages/FavoritesPage';
import PropertyShowcase from './pages/PropertyShowcase';
import ListingDetailPage from './pages/ListingDetailPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import { ShadcnUIShowcase } from './components/ShadcnUIShowcase';
import { DaisyUITest } from './components/DaisyUITest';
import VanillaExtractDemo from './components/VanillaExtractDemo';
import MantineAuthPage from './pages/auth/MantineAuthPage';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-transparent pb-20">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PropertyShowcase />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/details/:id" element={<PropertyDetailsPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/reset" element={<ResetPasswordPage />} />

          {/* Email Verification Routes */}
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route path="/verify-email" element={<EmailVerifiedPage />} />

          {/* UI Component Showcases */}
          <Route path="/shadcn-showcase" element={<ShadcnUIShowcase />} />
          <Route path="/daisyui-test" element={<DaisyUITest />} />
          <Route path="/vanilla-extract-demo" element={<VanillaExtractDemo />} />
          <Route path="/mantine-auth" element={<MantineAuthPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/kyc" element={
            <ProtectedRoute>
              <KYCPage />
            </ProtectedRoute>
          } />

          <Route path="/listings/new" element={
            <ProtectedRoute requiredRole="owner" requireEmailVerification={true} requireKYC={true}>
              <PropertyWizard />
            </ProtectedRoute>
          } />

          <Route path="/book/:id" element={
            <ProtectedRoute requireEmailVerification={true}>
              <BookingPage />
            </ProtectedRoute>
          } />

          <Route path="/booking-confirmation/:id" element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          } />

          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/kyc" element={
            <ProtectedRoute requiredRole="admin">
              <AdminKYCPage />
            </ProtectedRoute>
          } />

          <Route path="/favorites" element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } />
        </Routes>

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MenuBar />
        </div>

        <Toaster />
      </div>
    </LanguageProvider>
  );
}

export default App;
