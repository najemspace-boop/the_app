import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties = [], onPropertyClick, onFavoriteToggle }) => {
  const [favorites, setFavorites] = useState(new Set());

  const handleFavoriteToggle = (propertyId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
    onFavoriteToggle?.(propertyId, newFavorites.has(propertyId));
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-medium mb-2">No properties found</h3>
        <p className="text-sm">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          images={property.images}
          title={property.title}
          location={property.location}
          price={property.price}
          rating={property.rating}
          duration={property.duration || property.dates}
          isFavorite={favorites.has(property.id)}
          isGuestFavorite={property.isGuestFavorite}
          onFavoriteToggle={handleFavoriteToggle}
          onClick={onPropertyClick}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
