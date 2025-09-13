import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Star, MapPin, Users, Bed, Bath } from "lucide-react";
import { Link } from "react-router-dom";

const SimilarListings = ({ currentListingId, price, location }) => {
  // Mock similar listings data
  const mockSimilarListings = [
    {
      id: '2',
      title: 'Modern Beach House',
      price_per_night: 220,
      rating: 4.7,
      reviewCount: 89,
      city: 'Miami Beach',
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '3',
      title: 'Luxury Ocean View Condo',
      price_per_night: 280,
      rating: 4.9,
      reviewCount: 124,
      city: 'Miami Beach',
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '4',
      title: 'Cozy Beachfront Apartment',
      price_per_night: 180,
      rating: 4.6,
      reviewCount: 67,
      city: 'Miami Beach',
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '5',
      title: 'Stylish Downtown Loft',
      price_per_night: 195,
      rating: 4.5,
      reviewCount: 43,
      city: 'Miami Beach',
      max_guests: 5,
      bedrooms: 2,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // Filter out current listing
  const filteredListings = mockSimilarListings.filter(listing => listing.id !== currentListingId);

  return (
    <Card className="rounded-[18px] p-6">
      <h3 className="text-xl font-semibold mb-6">Similar listings in {location}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredListings.map((listing) => (
          <Link key={listing.id} to={`/listing/${listing.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-white text-black">
                  ${listing.price_per_night}/night
                </Badge>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg truncate">{listing.title}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{listing.city}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{listing.max_guests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{listing.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{listing.bathrooms} bath</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {listing.reviewCount} reviews
                  </span>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default SimilarListings;
