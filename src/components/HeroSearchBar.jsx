import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

const HeroSearchBar = () => {
  const navigate = useNavigate();
  
  const [location, setLocation] = useState("");
  const [listingType, setListingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const handleListingTypeChange = (value) => {
    setListingType(value);
    setPropertyType("");
    setSubCategory("");
  };

  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
    setSubCategory("");
  };

  const getSubCategories = () => {
    if (!listingType || !propertyType) return [];

    if (listingType === "sale") {
      if (propertyType === "residential") {
        return [
          { value: "flat", label: "Flat" },
          { value: "villa", label: "Villa" },
          { value: "farm", label: "Farm" },
          { value: "folklore_house", label: "Folklore House" },
          { value: "other", label: "Other" },
        ];
      } else if (propertyType === "commercial") {
        return [
          { value: "office", label: "Office" },
          { value: "shop", label: "Shop" },
          { value: "warehouse", label: "Warehouse" },
          { value: "showroom", label: "Showroom" },
          { value: "factory", label: "Factory" },
          { value: "commercial_land", label: "Land" },
          { value: "workshop", label: "Workshop" },
          { value: "other", label: "Other" },
        ];
      }
    } else if (listingType === "rent") {
      if (propertyType === "residential") {
        return [
          { value: "flat", label: "Flat" },
          { value: "villa", label: "Villa" },
          { value: "room", label: "Room" },
          { value: "motel_room", label: "Motel" },
          { value: "farm", label: "Farm" },
          { value: "hotel_room", label: "Hotel" },
          { value: "folklore_house", label: "Folklore" },
          { value: "ballroom", label: "Ballroom" },
          { value: "other", label: "Other" },
        ];
      } else if (propertyType === "commercial") {
        return [
          { value: "office", label: "Office" },
          { value: "shop", label: "Shop" },
          { value: "warehouse", label: "Warehouse" },
          { value: "showroom", label: "Showroom" },
          { value: "workshop", label: "Workshop" },
          { value: "other", label: "Other" },
        ];
      }
    }
    return [];
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (location) searchParams.set("location", location);
    if (propertyType) searchParams.set("propertyType", propertyType);
    if (listingType) searchParams.set("listingType", listingType);
    if (subCategory) searchParams.set("subCategory", subCategory);

    // Navigate to search page with parameters
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 dark:bg-gray-800/70 backdrop-blur-md shadow-lg rounded-3xl border -mt-12 relative z-10 bg-transparent text-slate-200 border-slate-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Select value={listingType} onValueChange={handleListingTypeChange}>
          <SelectTrigger className="w-full h-9 rounded-2xl">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Property" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={propertyType} onValueChange={handlePropertyTypeChange} disabled={!listingType}>
          <SelectTrigger className="w-full h-9 rounded-2xl">
            <div className="flex items-center text-gray-300">
              <Home className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-9 rounded-2xl pl-10"
          />
        </div>

        {listingType && propertyType && getSubCategories().length > 0 && (
          <Select value={subCategory} onValueChange={setSubCategory}>
            <SelectTrigger className="w-full h-9 rounded-2xl">
              <div className="flex items-center">
                <Home className="h-4 w-4 text-muted-foreground mr-2" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {getSubCategories().map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          onClick={handleSearch}
          className={`w-full h-9 rounded-2xl ${
            listingType && propertyType && getSubCategories().length > 0
              ? "sm:col-span-2 md:col-span-1"
              : "sm:col-span-2 md:col-span-1"
          }`}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default HeroSearchBar;
