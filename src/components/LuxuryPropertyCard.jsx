import React, { useState } from 'react';
import { Heart, Star, MapPin, Bed, Bath, Maximize, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const LuxuryPropertyCard = ({ 
  property,
  onFavoriteToggle,
  isFavorite = false,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(property.id);
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getImageSrc = () => {
    if (imageError) {
      return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
    }
    return property.image || property.coverPhoto || property.photos?.[0] || 
           'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className={`luxury-property-card luxury-hover-lift ${className}`}>
      <Link to={`/property/${property.id}`} className="block">
        {/* Property Image */}
        <div className="luxury-property-image">
          <img
            src={getImageSrc()}
            alt={property.title}
            className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 luxury-skeleton" />
          )}
          
          {/* Featured Badge */}
          {property.featured && (
            <div className="luxury-property-badge">
              Featured
            </div>
          )}
          
          {/* Property Type Badge */}
          {property.listingType && (
            <Badge className="absolute top-3 right-3 luxury-badge-gold">
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </Badge>
          )}
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-16 bg-white/90 hover:bg-white backdrop-blur-sm"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`} 
            />
          </Button>
          
          {/* Quick View Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Property Content */}
        <div className="luxury-property-content">
          {/* Title and Location */}
          <h3 className="luxury-property-title">
            {property.title}
          </h3>
          
          <div className="luxury-property-location">
            <MapPin className="h-4 w-4 text-luxury-gold" />
            <span>{property.location}</span>
          </div>
          
          {/* Property Features */}
          <div className="luxury-property-features">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                <span>{property.area} sqft</span>
              </div>
            )}
          </div>
          
          {/* Rating and Price */}
          <div className="luxury-property-price">
            <div>
              <span className="luxury-price-amount">
                {formatPrice(property.price, property.currency)}
              </span>
              <span className="luxury-price-period">
                {property.listingType === 'rent' ? '/month' : ''}
              </span>
            </div>
            
            {property.rating && (
              <div className="luxury-rating">
                <Star className="h-4 w-4 fill-current" />
                <span>{property.rating}</span>
                {property.reviews && (
                  <span className="text-xs">({property.reviews})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LuxuryPropertyCard;