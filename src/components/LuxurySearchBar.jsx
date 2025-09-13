import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';

const LuxurySearchBar = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    listingType: '',
    propertyType: '',
    subCategory: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const getSubCategories = () => {
    if (!searchData.listingType || !searchData.propertyType) return [];

    if (searchData.listingType === "sale") {
      if (searchData.propertyType === "residential") {
        return [
          { value: "apartment", label: "Luxury Apartment" },
          { value: "villa", label: "Private Villa" },
          { value: "penthouse", label: "Penthouse Suite" },
          { value: "townhouse", label: "Executive Townhouse" },
          { value: "mansion", label: "Estate Mansion" },
        ];
      } else if (searchData.propertyType === "commercial") {
        return [
          { value: "office", label: "Premium Office" },
          { value: "retail", label: "Retail Space" },
          { value: "warehouse", label: "Commercial Warehouse" },
          { value: "hotel", label: "Boutique Hotel" },
          { value: "restaurant", label: "Fine Dining Venue" },
        ];
      }
    } else if (searchData.listingType === "rent") {
      if (searchData.propertyType === "residential") {
        return [
          { value: "apartment", label: "Luxury Apartment" },
          { value: "villa", label: "Private Villa" },
          { value: "penthouse", label: "Penthouse Suite" },
          { value: "studio", label: "Designer Studio" },
          { value: "loft", label: "Modern Loft" },
        ];
      } else if (searchData.propertyType === "commercial") {
        return [
          { value: "office", label: "Executive Office" },
          { value: "retail", label: "Premium Retail" },
          { value: "coworking", label: "Luxury Coworking" },
          { value: "event", label: "Event Space" },
        ];
      }
    }
    return [];
  };

  return (
    <div className="luxury-search-container luxury-backdrop">
      <div className="luxury-search-grid">
        {/* Listing Type */}
        <div className="luxury-search-field">
          <label className="luxury-search-label">Property Listing</label>
          <Select 
            value={searchData.listingType} 
            onValueChange={(value) => handleInputChange('listingType', value)}
          >
            <SelectTrigger className="luxury-select">
              <SelectValue placeholder="For Sale/Rent" />
            </SelectTrigger>
            <SelectContent className="luxury-dropdown">
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="luxury-search-field">
          <label className="luxury-search-label">Property Type</label>
          <Select 
            value={searchData.propertyType} 
            onValueChange={(value) => handleInputChange('propertyType', value)}
          >
            <SelectTrigger className="luxury-select">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="luxury-dropdown">
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sub Category */}
        {searchData.listingType && searchData.propertyType && getSubCategories().length > 0 && (
          <div className="luxury-search-field">
            <label className="luxury-search-label">Category</label>
            <Select 
              value={searchData.subCategory} 
              onValueChange={(value) => handleInputChange('subCategory', value)}
            >
              <SelectTrigger className="luxury-select">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="luxury-dropdown">
                {getSubCategories().map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location */}
        <div className="luxury-search-field">
          <label className="luxury-search-label">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-gold" />
            <input
              type="text"
              placeholder="City, District, or Area"
              value={searchData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="luxury-search-input pl-10"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="luxury-search-field">
          <label className="luxury-search-label">Price Range</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-gold" />
              <input
                type="number"
                placeholder="Min"
                value={searchData.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                className="luxury-search-input pl-10 text-sm"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-gold" />
              <input
                type="number"
                placeholder="Max"
                value={searchData.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                className="luxury-search-input pl-10 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="luxury-search-field">
          <label className="luxury-search-label opacity-0">Search</label>
          <button
            onClick={handleSearch}
            className="luxury-search-btn w-full"
          >
            <Search className="h-4 w-4" />
            <span>Search Properties</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LuxurySearchBar;