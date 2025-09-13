import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Slider } from '../../components/ui/Slider';
import { 
  Filter, 
  DollarSign, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Wifi, 
  Tv, 
  Coffee,
  X
} from 'lucide-react';

const SearchFilters = ({ filters, onFiltersChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Home },
    { value: 'house', label: 'House', icon: Home },
    { value: 'villa', label: 'Villa', icon: Home },
    { value: 'studio', label: 'Studio', icon: Home },
    { value: 'townhouse', label: 'Townhouse', icon: Home },
    { value: 'penthouse', label: 'Penthouse', icon: Home }
  ];

  const amenities = [
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'tv', label: 'TV', icon: Tv },
    { value: 'kitchen', label: 'Kitchen', icon: Coffee },
    { value: 'parking', label: 'Parking', icon: Car },
    { value: 'pool', label: 'Pool', icon: Home },
    { value: 'gym', label: 'Gym', icon: Home },
    { value: 'balcony', label: 'Balcony', icon: Home },
    { value: 'garden', label: 'Garden', icon: Home }
  ];

  const conditions = [
    { value: 'ready_to_move', label: 'Ready to Move' },
    { value: 'under_construction', label: 'Under Construction' },
    { value: 'off_plan', label: 'Off Plan' },
    { value: 'brand_new', label: 'Brand New' },
    { value: 'renovated', label: 'Recently Renovated' }
  ];

  const furnishingOptions = [
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi_furnished', label: 'Semi-Furnished' },
    { value: 'fully_furnished', label: 'Fully Furnished' },
    { value: 'luxury_furnished', label: 'Luxury Furnished' }
  ];

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key, value) => {
    const currentArray = filters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 10000) count++;
    if (filters.propertyTypes?.length > 0) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.minArea || filters.maxArea) count++;
    if (filters.amenities?.length > 0) count++;
    if (filters.conditions?.length > 0) count++;
    if (filters.furnishing?.length > 0) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>

        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" onClick={onClear} size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Filters</span>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <Label className="flex items-center space-x-2 mb-3">
                <DollarSign className="h-4 w-4" />
                <span>Price Range</span>
              </Label>
              <div className="space-y-3">
                <Slider
                  value={filters.priceRange || [0, 10000]}
                  onValueChange={(value) => updateFilter('priceRange', value)}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>${(filters.priceRange?.[0] || 0).toLocaleString()}</span>
                  <span>-</span>
                  <span>${(filters.priceRange?.[1] || 10000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Property Types */}
            <div>
              <Label className="flex items-center space-x-2 mb-3">
                <Home className="h-4 w-4" />
                <span>Property Type</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = filters.propertyTypes?.includes(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => toggleArrayFilter('propertyTypes', type.value)}
                      className={`p-3 border rounded-lg flex items-center space-x-2 text-sm transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Bed className="h-4 w-4" />
                  <span>Bedrooms</span>
                </Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateFilter('bedrooms', filters.bedrooms === num ? null : num)}
                      className={`flex-1 py-2 px-3 border rounded text-sm transition-colors ${
                        filters.bedrooms === num
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Bath className="h-4 w-4" />
                  <span>Bathrooms</span>
                </Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateFilter('bathrooms', filters.bathrooms === num ? null : num)}
                      className={`flex-1 py-2 px-3 border rounded text-sm transition-colors ${
                        filters.bathrooms === num
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Area Range */}
            <div>
              <Label className="flex items-center space-x-2 mb-3">
                <Square className="h-4 w-4" />
                <span>Area (sq ft)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min area"
                  value={filters.minArea || ''}
                  onChange={(e) => updateFilter('minArea', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max area"
                  value={filters.maxArea || ''}
                  onChange={(e) => updateFilter('maxArea', e.target.value)}
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label className="mb-3">Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = filters.amenities?.includes(amenity.value);
                  return (
                    <button
                      key={amenity.value}
                      onClick={() => toggleArrayFilter('amenities', amenity.value)}
                      className={`p-2 border rounded-lg flex items-center space-x-2 text-sm transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{amenity.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Condition */}
            <div>
              <Label className="mb-3">Property Condition</Label>
              <div className="space-y-2">
                {conditions.map((condition) => {
                  const isSelected = filters.conditions?.includes(condition.value);
                  return (
                    <button
                      key={condition.value}
                      onClick={() => toggleArrayFilter('conditions', condition.value)}
                      className={`w-full p-3 border rounded-lg text-left text-sm transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {condition.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <Label className="mb-3">Furnishing</Label>
              <div className="space-y-2">
                {furnishingOptions.map((option) => {
                  const isSelected = filters.furnishing?.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleArrayFilter('furnishing', option.value)}
                      className={`w-full p-3 border rounded-lg text-left text-sm transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchFilters;
