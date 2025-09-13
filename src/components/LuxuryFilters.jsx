import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Slider } from './ui/Slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { 
  SlidersHorizontal, 
  DollarSign, 
  Home, 
  Bed, 
  Bath, 
  Maximize,
  Star,
  Wifi,
  Car,
  Waves,
  Shield,
  X
} from 'lucide-react';

const LuxuryFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  isOpen,
  onToggle 
}) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 10000000]);

  const amenityOptions = [
    { id: 'wifi', label: 'High-Speed WiFi', icon: <Wifi className="h-4 w-4" /> },
    { id: 'parking', label: 'Private Parking', icon: <Car className="h-4 w-4" /> },
    { id: 'pool', label: 'Swimming Pool', icon: <Waves className="h-4 w-4" /> },
    { id: 'gym', label: 'Fitness Center', icon: <Star className="h-4 w-4" /> },
    { id: 'concierge', label: 'Concierge Service', icon: <Shield className="h-4 w-4" /> },
    { id: 'spa', label: 'Spa & Wellness', icon: <Star className="h-4 w-4" /> },
    { id: 'garden', label: 'Private Garden', icon: <Home className="h-4 w-4" /> },
    { id: 'balcony', label: 'Balcony/Terrace', icon: <Home className="h-4 w-4" /> },
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Luxury Apartment' },
    { value: 'villa', label: 'Private Villa' },
    { value: 'penthouse', label: 'Penthouse Suite' },
    { value: 'mansion', label: 'Estate Mansion' },
    { value: 'townhouse', label: 'Executive Townhouse' },
    { value: 'loft', label: 'Designer Loft' },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenityId) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    handleFilterChange('amenities', newAmenities);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.propertyType) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000)) count++;
    if (filters.amenities?.length > 0) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggle}
          className="luxury-btn-ghost flex items-center space-x-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <Badge className="luxury-badge-gold ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="luxury-btn-ghost text-luxury-ruby"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <div className="luxury-card-premium">
          <div className="p-6 space-y-8">
            {/* Property Type */}
            <div className="space-y-4">
              <h3 className="luxury-subheading text-luxury-charcoal">Property Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange('propertyType', 
                      filters.propertyType === type.value ? '' : type.value
                    )}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      filters.propertyType === type.value
                        ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold-dark'
                        : 'border-luxury-platinum-dark hover:border-luxury-gold/50 text-luxury-charcoal'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="luxury-subheading text-luxury-charcoal flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-luxury-gold" />
                Price Range
              </h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value);
                    handleFilterChange('priceRange', value);
                  }}
                  max={10000000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-luxury-charcoal-light">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="luxury-subheading text-luxury-charcoal flex items-center gap-2">
                  <Bed className="h-5 w-5 text-luxury-gold" />
                  Bedrooms
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleFilterChange('bedrooms', 
                        filters.bedrooms === num ? null : num
                      )}
                      className={`w-12 h-12 rounded-lg border-2 transition-all font-medium ${
                        filters.bedrooms === num
                          ? 'border-luxury-gold bg-luxury-gold text-white'
                          : 'border-luxury-platinum-dark hover:border-luxury-gold/50 text-luxury-charcoal'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="luxury-subheading text-luxury-charcoal flex items-center gap-2">
                  <Bath className="h-5 w-5 text-luxury-gold" />
                  Bathrooms
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleFilterChange('bathrooms', 
                        filters.bathrooms === num ? null : num
                      )}
                      className={`w-12 h-12 rounded-lg border-2 transition-all font-medium ${
                        filters.bathrooms === num
                          ? 'border-luxury-gold bg-luxury-gold text-white'
                          : 'border-luxury-platinum-dark hover:border-luxury-gold/50 text-luxury-charcoal'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Luxury Amenities */}
            <div className="space-y-4">
              <h3 className="luxury-subheading text-luxury-charcoal">Luxury Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium flex items-center gap-2 ${
                      filters.amenities?.includes(amenity.id)
                        ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold-dark'
                        : 'border-luxury-platinum-dark hover:border-luxury-gold/50 text-luxury-charcoal'
                    }`}
                  >
                    {amenity.icon}
                    {amenity.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="pt-4 border-t border-luxury-gold/20">
              <Button
                onClick={onToggle}
                className="luxury-btn-primary w-full"
              >
                Apply Filters ({getActiveFiltersCount()})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuxuryFilters;