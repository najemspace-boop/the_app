import React, { useState } from 'react';
import { LuxuryHeroSection } from '../components/LuxuryHeroSection';
import LuxuryPropertyGrid from '../components/LuxuryPropertyGrid';
import LuxuryLayout from '../components/LuxuryLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Star, TrendingUp, Award, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';

const LuxuryHomePage = () => {
  const [favorites, setFavorites] = useState(new Set());
  
  // Get real listings from Firestore
  const { listings: realListings, loading } = useListings({}, 8);

  // Luxury mock properties with high-end imagery
  const luxuryMockProperties = [
    {
      id: "luxury-1",
      title: "Penthouse Suite with Panoramic Views",
      location: "Dubai Marina, UAE",
      price: 8500000,
      currency: "USD",
      listingType: "sale",
      bedrooms: 4,
      bathrooms: 5,
      area: 4200,
      rating: 4.98,
      reviews: 12,
      featured: true,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "luxury-2", 
      title: "Waterfront Villa with Private Beach",
      location: "Palm Jumeirah, Dubai",
      price: 12000000,
      currency: "USD",
      listingType: "sale",
      bedrooms: 6,
      bathrooms: 7,
      area: 8500,
      rating: 5.0,
      reviews: 8,
      featured: true,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "luxury-3",
      title: "Modern Architectural Masterpiece",
      location: "Emirates Hills, Dubai",
      price: 15000000,
      currency: "USD",
      listingType: "sale",
      bedrooms: 7,
      bathrooms: 8,
      area: 12000,
      rating: 4.95,
      reviews: 15,
      featured: true,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "luxury-4",
      title: "Executive Penthouse Residence",
      location: "Downtown Dubai, UAE",
      price: 6800000,
      currency: "USD",
      listingType: "sale",
      bedrooms: 3,
      bathrooms: 4,
      area: 3200,
      rating: 4.92,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "luxury-5",
      title: "Contemporary Villa Estate",
      location: "Al Barari, Dubai",
      price: 9200000,
      currency: "USD",
      listingType: "sale",
      bedrooms: 5,
      bathrooms: 6,
      area: 6800,
      rating: 4.89,
      reviews: 22,
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "luxury-6",
      title: "Luxury Family Compound",
      location: "Dubai Hills Estate, UAE",
      price: 18500000,
      currency: "USD",
      listingType: "sale",
      bedrooms: 8,
      bathrooms: 10,
      area: 15000,
      rating: 5.0,
      reviews: 6,
      featured: true,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Transform real listings to luxury format
  const transformedRealListings = realListings.map(listing => ({
    id: listing.id,
    title: listing.title,
    location: `${listing.location?.district}, ${listing.location?.city}`,
    price: listing.pricing?.basePrice || 0,
    currency: listing.pricing?.currency || 'USD',
    listingType: listing.listingType,
    bedrooms: listing.propertyOptions?.bedrooms,
    bathrooms: listing.propertyOptions?.bathrooms,
    area: listing.propertyOptions?.area,
    rating: listing.rating || 4.5,
    reviews: listing.reviewsCount || 0,
    image: listing.coverPhoto || (listing.photos && listing.photos[0])
  }));

  // Use real listings if available, otherwise use luxury mock data
  const displayProperties = transformedRealListings.length > 0 ? transformedRealListings : luxuryMockProperties;

  const handleFavoriteToggle = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const featuredProperties = displayProperties.filter(p => p.featured);
  const regularProperties = displayProperties.filter(p => !p.featured);

  return (
    <LuxuryLayout>
      {/* Hero Section */}
      <LuxuryHeroSection />

      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-6 w-6 text-luxury-gold" />
                <Badge className="luxury-badge-gold">Exclusive</Badge>
              </div>
              <h2 className="luxury-heading text-4xl text-luxury-charcoal mb-4">
                Featured Luxury Properties
              </h2>
              <p className="luxury-body text-xl text-luxury-charcoal-light max-w-2xl mx-auto">
                Handpicked exceptional properties offering unparalleled luxury and sophistication
              </p>
            </div>
            
            <LuxuryPropertyGrid
              properties={featuredProperties}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
              loading={loading}
            />
          </div>
        </section>
      )}

      {/* All Properties Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-platinum-light/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="luxury-heading text-3xl text-luxury-charcoal mb-4">
                Premium Properties
              </h2>
              <p className="luxury-body text-lg text-luxury-charcoal-light">
                Discover our curated collection of exceptional properties
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-luxury-emerald" />
                <span className="luxury-body text-luxury-charcoal-light">
                  {displayProperties.length} Properties
                </span>
              </div>
              <Link to="/search">
                <Button className="luxury-btn-secondary">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
          
          <LuxuryPropertyGrid
            properties={regularProperties}
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
            loading={loading}
          />

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="luxury-card-premium max-w-2xl mx-auto p-8">
              <Award className="h-12 w-12 text-luxury-gold mx-auto mb-4" />
              <h3 className="luxury-heading text-2xl text-luxury-charcoal mb-4">
                Ready to Find Your Dream Property?
              </h3>
              <p className="luxury-body text-luxury-charcoal-light mb-6">
                Explore our complete collection of luxury properties and find the perfect match for your lifestyle.
              </p>
              <Link to="/search">
                <Button className="luxury-btn-primary px-8 py-3">
                  Start Your Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LuxuryLayout>
  );
};

export default LuxuryHomePage;