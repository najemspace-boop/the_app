import React, { useState } from 'react';
import { Input, Button, Select, SelectItem } from '@heroui/react';
import { Search, MapPin, Home, Building } from 'lucide-react';

const SearchHeader = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [listingType, setListingType] = useState('');

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching...', { searchLocation, propertyType, listingType });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 search-header-glass">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Property Type Selector */}
          <div className="w-full sm:w-auto">
            <Select
              placeholder="For Sale/Rent"
              value={listingType}
              onSelectionChange={setListingType}
              className="min-w-[140px]"
              classNames={{
                trigger: "search-input-glass border-0 text-foreground",
                popover: "search-header-glass",
              }}
              startContent={<Building className="h-4 w-4" />}
            >
              <SelectItem key="sale" value="sale">For Sale</SelectItem>
              <SelectItem key="rent" value="rent">For Rent</SelectItem>
            </Select>
          </div>

          {/* Property Type Selector */}
          <div className="w-full sm:w-auto">
            <Select
              placeholder="Property Type"
              value={propertyType}
              onSelectionChange={setPropertyType}
              className="min-w-[140px]"
              classNames={{
                trigger: "search-input-glass border-0 text-foreground",
                popover: "search-header-glass",
              }}
              startContent={<Home className="h-4 w-4" />}
            >
              <SelectItem key="apartment" value="apartment">Apartment</SelectItem>
              <SelectItem key="house" value="house">House</SelectItem>
              <SelectItem key="villa" value="villa">Villa</SelectItem>
              <SelectItem key="studio" value="studio">Studio</SelectItem>
              <SelectItem key="penthouse" value="penthouse">Penthouse</SelectItem>
              <SelectItem key="townhouse" value="townhouse">Townhouse</SelectItem>
            </Select>
          </div>

          {/* Location Search Input */}
          <div className="flex-1 w-full">
            <Input
              placeholder="Where are you going?"
              value={searchLocation}
              onValueChange={setSearchLocation}
              startContent={<MapPin className="h-4 w-4 text-default-400" />}
              classNames={{
                input: "text-foreground placeholder:text-default-400",
                inputWrapper: "search-input-glass border-0 bg-transparent",
              }}
              size="lg"
            />
          </div>

          {/* Search Button */}
          <Button
            color="primary"
            size="lg"
            onPress={handleSearch}
            className="w-full sm:w-auto min-w-[100px] font-medium"
            startContent={<Search className="h-4 w-4" />}
          >
            Search
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
