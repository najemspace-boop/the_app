import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import PriceBox from "../components/PriceBox";
import PropertyMap from "../components/PropertyMap";
import ReviewsSection from "../components/ReviewsSection";
import SimilarListings from "../components/SimilarListings";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Utensils,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  AtSign,
  Phone
} from "lucide-react";

const ListingDetailPage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  
  // Favorites state
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  
  // Check if listing is in user's favorites
  const checkIfFavorite = useCallback(async () => {
    if (!user || !profile || !id) return;
    
    try {
      // Mock implementation - replace with Firebase
      console.log('Mock check favorite for listing:', id);
      setIsFavorite(false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [user, profile, id]);

  // Mock listing data
  const mockListing = {
    id: id || '1',
    title: 'Beautiful Waterfront Villa',
    description: 'Experience luxury living in this stunning waterfront villa with panoramic views of the ocean. This property features modern amenities, spacious rooms, and direct beach access. Perfect for families or groups looking for an unforgettable vacation experience.',
    price_per_night: 250,
    max_guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    city: 'Miami Beach',
    location: 'Miami Beach, Florida, USA',
    latitude: 25.7907,
    longitude: -80.1300,
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    host: {
      full_name: 'Sarah Johnson',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80',
      created_at: '2023-01-01'
    }
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentImageIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    setIsLoadingFavorite(true);
    try {
      // Mock implementation - replace with Firebase
      console.log('Mock toggle favorite for listing:', id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{mockListing.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mockListing.rating}</span>
                  <span>({mockListing.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{mockListing.city}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                disabled={isLoadingFavorite}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {mockListing.images.map((image, index) => (
                <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                  <img
                    src={image}
                    alt={`${mockListing.title} - Photo ${index + 1}`}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={scrollPrev}
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={scrollNext}
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {mockListing.images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <Card className="rounded-[18px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockListing.host.avatar_url} />
                    <AvatarFallback>
                      {mockListing.host.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Hosted by {mockListing.host.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Host since {new Date(mockListing.host.created_at).getFullYear()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <AtSign className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card className="rounded-[18px] p-6">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{mockListing.max_guests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">{mockListing.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">{mockListing.bathrooms}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">What this place offers</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Free parking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Utensils className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Kitchen</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="rounded-[18px] p-6">
              <h3 className="text-xl font-semibold mb-4">About this place</h3>
              <p className="text-muted-foreground leading-relaxed">
                {mockListing.description}
              </p>
            </Card>

            {/* Map */}
            <PropertyMap
              latitude={mockListing.latitude}
              longitude={mockListing.longitude}
              address={mockListing.location}
              title={mockListing.title}
            />

            {/* Reviews */}
            <ReviewsSection propertyId={mockListing.id} />

            {/* Similar Listings */}
            <SimilarListings
              currentListingId={mockListing.id}
              price={mockListing.price_per_night}
              location={mockListing.city}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PriceBox
                price={mockListing.price_per_night}
                rating={mockListing.rating}
                reviewCount={mockListing.reviewCount}
                onReserve={(data) => {
                  console.log('Mock reservation:', data);
                  toast.success('Reservation functionality coming soon!');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
