import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/Slider";
import PropertyCard from "../components/PropertyCard";
import InteractiveMap from "../components/InteractiveMap";
import { Filter, SlidersHorizontal, MapPin, Search, Home, DollarSign } from "lucide-react";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("relevant");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [priceIndex, setPriceIndex] = useState({ min: 0, max: 5000 }); // Dynamic price limits from server
  const [propertyCategory, setPropertyCategory] = useState("all"); // Commercial or Residential
  const [propertyType, setPropertyType] = useState("all"); // Sub-category based on main category
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [furnishingType, setFurnishingType] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [areaRange, setAreaRange] = useState([0, 5000]);
  const [floorRange, setFloorRange] = useState([1, 50]);
  const [petFriendly, setPetFriendly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Search bar states
  const [searchLocation, setSearchLocation] = useState("");
  const [searchPropertyType, setSearchPropertyType] = useState("");
  const [searchListingType, setSearchListingType] = useState("");

  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // Initialize filters from URL params
  useEffect(() => {
    if (minPrice) setPriceRange(prev => [parseInt(minPrice), prev[1]]);
    if (maxPrice) setPriceRange(prev => [prev[0], parseInt(maxPrice)]);
    if (type && type !== "all") setPropertyType(type);
  }, [minPrice, maxPrice, type]);

  // Mock search function - replace with actual API call
  const searchProperties = async (filters) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    return [
      {
        id: "1",
        title: "Luxury Villa in Dubai Marina",
        location: { area: "Dubai Marina", city: "Dubai" },
        price: 2500,
        features: { bedrooms: 3, bathrooms: 2, built_up_area: 1200 },
        rating: 4.8,
        reviewCount: 24,
        primaryImage: "/api/placeholder/400/300",
        currency: "USD",
        isFeatured: true
      },
      {
        id: "2",
        title: "Modern Apartment in Downtown",
        location: { area: "Downtown", city: "Dubai" },
        price: 1800,
        features: { bedrooms: 2, bathrooms: 1, built_up_area: 900 },
        rating: 4.5,
        reviewCount: 18,
        primaryImage: "/api/placeholder/400/300",
        currency: "USD",
        isFeatured: false
      }
    ];
  };

  const getPropertyCount = async (filters) => {
    // Mock count - replace with actual API call
    return 2;
  };

  // Apply filters function
  const applyFilters = async () => {
    setLoading(true);
    try {
      const filters = {
        location: location || undefined,
        propertyType: propertyType !== "all" ? propertyType : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
        bedrooms: selectedBedrooms.length > 0 ? selectedBedrooms : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        sortBy,
      };

      const [searchResults, count] = await Promise.all([
        searchProperties(filters),
        getPropertyCount(filters)
      ]);

      setProperties(searchResults);
      setPropertyCount(count);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error("Failed to search properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    applyFilters();
  }, []);

  // Handle bedroom selection
  const toggleBedroom = (bedroom) => {
    setSelectedBedrooms(prev => 
      prev.includes(bedroom) 
        ? prev.filter(b => b !== bedroom)
        : [...prev, bedroom]
    );
  };

  // Get property sub-types based on main category
  const getPropertySubTypes = () => {
    if (propertyCategory === "residential") {
      return [
        { value: "all", label: "All Residential" },
        { value: "apartment", label: "Apartment" },
        { value: "villa", label: "Villa" },
        { value: "studio", label: "Studio" },
        { value: "penthouse", label: "Penthouse" },
        { value: "townhouse", label: "Townhouse" }
      ];
    } else if (propertyCategory === "commercial") {
      return [
        { value: "all", label: "All Commercial" },
        { value: "office", label: "Office" },
        { value: "retail", label: "Retail" },
        { value: "warehouse", label: "Warehouse" },
        { value: "land", label: "Land" },
        { value: "building", label: "Building" }
      ];
    }
    return [{ value: "all", label: "All Types" }];
  };

  // Check if current selection should show bedrooms
  const shouldShowBedrooms = () => {
    if (propertyCategory === "commercial") {
      return propertyType === "office" || propertyType === "all";
    }
    return propertyCategory === "residential" && propertyType !== "land";
  };

  // Check if current selection should show floors
  const shouldShowFloors = () => {
    return propertyType !== "land" && propertyType !== "studio";
  };

  // Check if current selection should show furnishing
  const shouldShowFurnishing = () => {
    if (propertyCategory === "commercial") {
      return propertyType === "office" || propertyType === "retail";
    }
    return propertyCategory === "residential";
  };

  // Fetch price index from server based on current filters
  const fetchPriceIndex = async () => {
    try {
      // This would be your actual API call to get price index
      // Example: const response = await fetch('/api/price-index', { method: 'POST', body: JSON.stringify({ propertyCategory, propertyType, location }) });
      
      // Mock implementation - replace with actual API call
      let mockPriceIndex = { min: 0, max: 5000 };
      
      if (propertyCategory === "residential") {
        if (propertyType === "studio") {
          mockPriceIndex = { min: 500, max: 2000 };
        } else if (propertyType === "apartment") {
          mockPriceIndex = { min: 800, max: 3500 };
        } else if (propertyType === "villa") {
          mockPriceIndex = { min: 2000, max: 15000 };
        } else if (propertyType === "penthouse") {
          mockPriceIndex = { min: 3000, max: 25000 };
        } else {
          mockPriceIndex = { min: 500, max: 25000 };
        }
      } else if (propertyCategory === "commercial") {
        if (propertyType === "office") {
          mockPriceIndex = { min: 1000, max: 10000 };
        } else if (propertyType === "retail") {
          mockPriceIndex = { min: 1500, max: 8000 };
        } else if (propertyType === "warehouse") {
          mockPriceIndex = { min: 800, max: 5000 };
        } else if (propertyType === "land") {
          mockPriceIndex = { min: 10000, max: 500000 };
        } else if (propertyType === "building") {
          mockPriceIndex = { min: 50000, max: 2000000 };
        } else {
          mockPriceIndex = { min: 800, max: 2000000 };
        }
      } else {
        // All categories
        mockPriceIndex = { min: 500, max: 2000000 };
      }
      
      setPriceIndex(mockPriceIndex);
      // Reset price range to new limits
      setPriceRange([mockPriceIndex.min, mockPriceIndex.max]);
      
    } catch (error) {
      console.error('Error fetching price index:', error);
      toast.error('Failed to load price range');
    }
  };

  // Handle search bar functionality
  const handleSearch = () => {
    // Update URL params and trigger search
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (searchPropertyType) params.set("type", searchPropertyType);
    if (searchListingType) params.set("listingType", searchListingType);
    
    // Navigate to search results with new params
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    
    // Apply filters with new search criteria
    applyFilters();
    toast.success("Search updated!");
  };

  // Reset dependent filters when category changes
  const handleCategoryChange = (newCategory) => {
    setPropertyCategory(newCategory);
    setPropertyType("all");
    setSelectedBedrooms([]);
    setFurnishingType("all");
  };

  // Handle amenity selection
  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setPropertyCategory("all");
    setPropertyType("all");
    setPriceRange([priceIndex.min, priceIndex.max]); // Use dynamic price limits
    setSelectedBedrooms([]);
    setSelectedAmenities([]);
    setFurnishingType("all");
    setListingType("all");
    setAreaRange([0, 5000]);
    setFloorRange([1, 50]);
    setPetFriendly(false);
    setSortBy("relevant");
  };

  // Fetch price index when category or type changes
  useEffect(() => {
    fetchPriceIndex();
  }, [propertyCategory, propertyType, location]);

  // Apply filters when sort changes
  useEffect(() => {
    if (properties.length > 0) {
      applyFilters();
    }
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Luxury Glassmorphism Search Bar */}
        <div className="mb-8">
          <div className="bg-gradient-card shadow-elevated rounded-xl p-6 backdrop-blur-sm border border-primary/10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Location Search */}
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
                  <Input
                    placeholder="Where are you going?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border-primary/20 focus:border-primary/40 rounded-lg"
                  />
                </div>
              </div>
              
              {/* Property Type */}
              <div className="lg:w-48">
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60 z-10" />
                  <Select value={searchPropertyType} onValueChange={setSearchPropertyType}>
                    <SelectTrigger className="pl-10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border-primary/20 focus:border-primary/40 rounded-lg">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card backdrop-blur-md border-primary/20">
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Listing Type */}
              <div className="lg:w-40">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60 z-10" />
                  <Select value={searchListingType} onValueChange={setSearchListingType}>
                    <SelectTrigger className="pl-10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border-primary/20 focus:border-primary/40 rounded-lg">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card backdrop-blur-md border-primary/20">
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results Header */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="glass-sidebar rounded-xl sticky top-4">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                </div>
                <div className="space-y-5">
                  {/* Property Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Property Category</label>
                  <Select value={propertyCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Sub-Type */}
                {propertyCategory !== "all" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Property Type</label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPropertySubTypes().map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Price Range - Dynamic based on price index */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </label>
                  <div className="px-1">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={priceIndex.max}
                      min={priceIndex.min}
                      step={Math.max(1, Math.floor((priceIndex.max - priceIndex.min) / 100))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>${priceIndex.min.toLocaleString()}</span>
                      <span>${priceIndex.max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Bedrooms - Only for residential or office */}
                {shouldShowBedrooms() && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      {propertyCategory === "commercial" ? "Rooms" : "Bedrooms"}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5].map((bed) => (
                        <Button 
                          key={bed} 
                          variant={selectedBedrooms.includes(bed) ? "default" : "outline"} 
                          size="sm"
                          className="h-8 min-w-[2.5rem]"
                          onClick={() => toggleBedroom(bed)}
                        >
                          {bed === 5 ? "5+" : bed}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Listing Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Listing Type</label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="short-term">Short Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Area: {areaRange[0]} - {areaRange[1]} sq ft
                  </label>
                  <div className="px-1">
                    <Slider
                      value={areaRange}
                      onValueChange={setAreaRange}
                      max={5000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>0 sq ft</span>
                      <span>5,000 sq ft</span>
                    </div>
                  </div>
                </div>

                {/* Furnishing Type - Only for residential and some commercial */}
                {shouldShowFurnishing() && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Furnishing</label>
                    <Select value={furnishingType} onValueChange={setFurnishingType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select furnishing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="furnished">Furnished</SelectItem>
                        <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                        <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Floor Range - Not for land or studio */}
                {shouldShowFloors() && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Floor: {floorRange[0]} - {floorRange[1]}
                    </label>
                    <div className="px-1">
                      <Slider
                        value={floorRange}
                        onValueChange={setFloorRange}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>1st Floor</span>
                        <span>50th Floor</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pet Friendly */}
                <div className="py-1">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded h-4 w-4" 
                      checked={petFriendly}
                      onChange={(e) => setPetFriendly(e.target.checked)}
                    />
                    <span className="text-sm font-medium text-foreground">Pet Friendly</span>
                  </label>
                </div>

                {/* Amenities - Horizontal Layout */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Amenities</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["WiFi", "Parking", "Pool", "Gym", "Security", "AC", "Balcony", "Garden", "Elevator", "Laundry", "Storage", "Concierge"].map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded h-4 w-4" 
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                        />
                        <span className="text-sm text-foreground">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="pt-6 border-t space-y-3">
                  <Button 
                    className="w-full h-10" 
                    onClick={applyFilters}
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Apply Filters"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-10" 
                    onClick={clearFilters}
                    disabled={loading}
                  >
                    Clear All
                  </Button>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header - Luxury Theme */}
            <div className="w-full p-6 bg-gradient-card shadow-elevated rounded-xl border mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Search Results
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>Found {propertyCount} properties</span>
                    {location && <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">{location}</Badge>}
                    {type && <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">{type}</Badge>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border-primary/20 hover:border-primary/40"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  <Button
                    variant={showMap ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setShowMap(!showMap)}
                    className={showMap ? "" : "bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border-primary/20 hover:border-primary/40"}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {showMap ? "Hide Map" : "Show Map"}
                  </Button>
                
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border-primary/20 hover:border-primary/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevant">Most Relevant</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Map View */}
            {showMap && (
              <div className="mb-6">
                <InteractiveMap 
                  properties={properties}
                  onPropertySelect={(property) => {
                    // Handle property selection from map
                    console.log('Selected property:', property);
                  }}
                />
              </div>
            )}

            {/* Property Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading properties...</div>
              </div>
            ) : (
              <div className={`property-grid ${showMap ? 'lg:grid-cols-2' : ''}`}>
                {properties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    id={property.id}
                    title={property.title}
                    location={`${property.location.area}, ${property.location.city}`}
                    price={property.price}
                    bedrooms={property.features.bedrooms}
                    bathrooms={property.features.bathrooms}
                    area={property.features.built_up_area}
                    rating={property.rating}
                    reviews={property.reviewCount}
                    image={property.primaryImage}
                    currency={property.currency}
                    featured={property.isFeatured}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && properties.length === 0 && (
              <div className="text-center py-16">
                <div className="text-lg font-medium mb-2">No properties found</div>
                <div className="text-muted-foreground mb-4">Try adjusting your search criteria</div>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Load More */}
            {!loading && properties.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline">Load More Properties</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
