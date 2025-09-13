import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyGrid from '../components/PropertyGrid';
import SearchBar from '../components/SearchBar';

const PropertyShowcase = () => {
  const navigate = useNavigate();
  
  // Sample data matching the Airbnb design from your screenshot
  const sampleProperties = [
    {
      id: 1,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560449752-c4715c3d9c5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=400&fit=crop'
      ],
      title: 'Apartment in Marsa Dubai',
      location: 'Dubai, UAE',
      dates: 'for 2 nights',
      price: 380,
      rating: 4.87
    },
    {
      id: 2,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop'
      ],
      title: 'Apartment in Dubai',
      location: 'Dubai Marina, UAE',
      dates: 'for 2 nights',
      price: 493,
      rating: 5.0
    },
    {
      id: 3,
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop'
      ],
      title: 'Apartment in Downtown Dubai',
      location: 'Downtown Dubai, UAE',
      dates: 'for 2 nights',
      price: 603,
      rating: 4.98
    },
    {
      id: 4,
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=400&fit=crop'
      ],
      title: 'Apartment in Downtown Dubai',
      location: 'Business Bay, UAE',
      dates: 'for 2 nights',
      price: 528,
      rating: 4.84
    },
    {
      id: 5,
      images: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&h=400&fit=crop'
      ],
      title: 'Apartment in Marylebone',
      location: 'London, UK',
      dates: 'for 2 nights',
      price: 1789,
      rating: 4.82
    },
    {
      id: 6,
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
      ],
      title: 'Room in Islington',
      location: 'London, UK',
      dates: 'for 2 nights',
      price: 1235,
      rating: 4.98
    },
    {
      id: 7,
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=400&fit=crop'
      ],
      title: 'Room in Covent Garden',
      location: 'London, UK',
      dates: 'for 2 nights',
      price: 967,
      rating: 4.9
    },
    {
      id: 8,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=400&fit=crop'
      ],
      title: 'Room in Camden',
      location: 'London, UK',
      dates: 'for 2 nights',
      price: 969,
      rating: 5.0
    }
  ];

  const handlePropertyClick = (propertyId) => {
    console.log('Property clicked:', propertyId);
    // Navigate to property detail page
    navigate(`/property/${propertyId}`);
  };

  const handleFavoriteToggle = (propertyId, isFavorite) => {
    console.log('Favorite toggled:', propertyId, isFavorite);
    // Update favorites in backend/state
  };

  return (
    <div className="clay-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 clay-card">
          <SearchBar />
        </div>

        {/* Property Grid */}
        <div className="clay-card">
          <PropertyGrid
            properties={sampleProperties}
            onPropertyClick={handlePropertyClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyShowcase;
