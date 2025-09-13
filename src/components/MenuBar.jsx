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
    null
  );
}