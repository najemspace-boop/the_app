import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const LuxuryFooter = () => {
  return (
    <footer className="luxury-glass mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="luxury-heading text-xl text-luxury-charcoal">
                PropertyHub
              </span>
            </div>
            <p className="luxury-body text-luxury-charcoal-light mb-6">
              Discover extraordinary properties in the world's most prestigious locations. 
              Where luxury meets lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="luxury-btn-ghost p-2">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="luxury-btn-ghost p-2">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="luxury-btn-ghost p-2">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="luxury-subheading text-luxury-charcoal mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search?type=luxury" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Luxury Properties
                </Link>
              </li>
              <li>
                <Link to="/search?type=penthouse" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Penthouse Suites
                </Link>
              </li>
              <li>
                <Link to="/search?type=villa" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Private Villas
                </Link>
              </li>
              <li>
                <Link to="/search?type=waterfront" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Waterfront Homes
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="luxury-subheading text-luxury-charcoal mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/concierge" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Concierge Service
                </Link>
              </li>
              <li>
                <Link to="/property-management" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Property Management
                </Link>
              </li>
              <li>
                <Link to="/investment" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Investment Advisory
                </Link>
              </li>
              <li>
                <Link to="/valuation" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark transition-colors">
                  Property Valuation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="luxury-subheading text-luxury-charcoal mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-luxury-gold" />
                <span className="luxury-body text-luxury-charcoal-light">
                  123 Luxury Avenue<br />
                  Premium District, City
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-luxury-gold" />
                <span className="luxury-body text-luxury-charcoal-light">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-luxury-gold" />
                <span className="luxury-body text-luxury-charcoal-light">
                  hello@propertyhub.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-luxury-gold/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="luxury-body text-luxury-charcoal-light text-sm">
              © 2024 PropertyHub. All rights reserved. Crafted with excellence.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="luxury-body text-luxury-charcoal-light hover:text-luxury-gold-dark text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;