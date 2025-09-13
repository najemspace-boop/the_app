import React from 'react';
import { MenuBar } from './MenuBar';
import LuxuryFooter from './LuxuryFooter';

const LuxuryLayout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Luxury Navigation */}
      <div className="luxury-nav">
        <MenuBar />
      </div>
      
      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
      
      {/* Luxury Footer */}
      {showFooter && <LuxuryFooter />}
    </div>
  );
};

export default LuxuryLayout;