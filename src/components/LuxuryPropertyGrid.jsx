import React from 'react';
import LuxuryPropertyCard from './LuxuryPropertyCard';

const LuxuryPropertyGrid = ({ 
  properties = [], 
  onPropertyClick, 
  onFavoriteToggle,
  favorites = new Set(),
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="luxury-grid-properties">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="luxury-card">
            <div className="aspect-[4/3] luxury-skeleton mb-4"></div>
            <div className="space-y-3">
              <div className="luxury-skeleton h-6 w-3/4"></div>
              <div className="luxury-skeleton h-4 w-1/2"></div>
              <div className="luxury-skeleton h-5 w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="luxury-card max-w-md mx-auto">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="luxury-subheading text-xl text-luxury-charcoal mb-2">
            No Properties Found
          </h3>
          <p className="luxury-body text-luxury-charcoal-light">
            Refine your search criteria to discover exceptional properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-grid-properties">
      {properties.map((property) => (
        <LuxuryPropertyCard
          key={property.id}
          property={property}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={favorites.has(property.id)}
          onClick={onPropertyClick}
        />
      ))}
    </div>
  );
};

export default LuxuryPropertyGrid;