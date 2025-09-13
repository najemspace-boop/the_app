import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import ListingCard from "../components/ListingCard";
import { HeroSection } from "../components/HeroSection";
import { MapPin, ChevronDown, Plus, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const [activeFilter, setActiveFilter] = useState("All");

  // Get real listings from Firestore
  const { listings: realListings, loading } = useListings({}, 8);

  // Mock property listings with real property images as fallback
  const mockListings = [{
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Apartment in Downtown Dubai",
    price: 586,
    duration: "for 2 nights",
    rating: 4.87,
    isGuestFavorite: true,
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"]
  }, {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d480", 
    title: "Apartment in Downtown Dubai",
    price: 661,
    duration: "for 2 nights",
    rating: 5.0,
    isGuestFavorite: true,
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"]
  }, {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d481",
    title: "Apartment in Downtown Dubai",
    price: 1384,
    duration: "for 2 nights",
    rating: 4.98,
    isGuestFavorite: true,
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"]
  }, {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d482",
    title: "Apartment in Downtown Dubai",
    price: 1875,
    duration: "for 2 nights",
    rating: 4.84,
    isGuestFavorite: true,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"]
  }, {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d483",
    title: "Apartment in Downtown Dubai",
    price: 1435,
    duration: "for 2 nights",
    rating: 4.82,
    isGuestFavorite: true,
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"]
  }, {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d484",
    title: "Contemporary Family Villa",
    location: "Dubai Hills . USD 4,900,000",
    price: 4900000,
    rating: 4.98,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
  }, {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d485",
    title: "Modern Townhouse",
    location: "Al Barari . USD 3,200,000",
    price: 3200000,
    rating: 4.9,
    reviews: 27,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
  }, {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d486",
    title: "Luxury Family Villa",
    location: "Dubai Hills Estate . USD 7,800,000",
    price: 7800000,
    rating: 5.0,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  }];

  // Transform real listings to match the expected format
  const transformedRealListings = realListings.map(listing => ({
    id: listing.id,
    title: listing.title,
    price: listing.pricing?.basePrice || 0,
    duration: "for 2 nights",
    rating: listing.rating || 4.5,
    isGuestFavorite: Math.random() > 0.5,
    images: [listing.coverPhoto || (listing.photos && listing.photos[0])]
  }));

  // Use real listings if available, otherwise use mock data
  const displayListings = transformedRealListings.length > 0 ? transformedRealListings : mockListings;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="mx-6 mt-6 mb-8">
        <HeroSection />
      </div>

      {/* Listings Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">
              Discover our handpicked selection of premium properties
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Card key={item} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* View All Properties Button */}
          <div className="text-center mt-12">
            <Link to="/search">
              <Button size="lg" className="px-8">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
