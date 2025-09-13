import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseService } from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    skipSnaps: false,
    dragFree: false
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  // Create array of images (use multiple images if available, otherwise repeat the main image)
  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [listing.image, listing.image, listing.image]; // Repeat main image for demo

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const handleImageClick = (e) => {
    e.preventDefault();
    navigate(`/listing/${listing.id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !profile) {
      toast({
        title: "Please sign in",
        description: "You need to register or sign in to add favorites.",
        variant: "destructive",
      });
      navigate("/auth/signin");
      return;
    }

    setIsAddingToFavorites(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        await FirebaseService.removeFromFavorites(profile.id, listing.id);

        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: "Property removed from your favorites.",
        });
      } else {
        // Add to favorites
        await FirebaseService.addToFavorites(profile.id, listing.id);

        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: "Property added to your favorites.",
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Check if listing is favorited on component mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !profile) return;

      try {
        const isFavorited = await FirebaseService.checkIfFavorited(profile.id, listing.id);
        setIsFavorited(isFavorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, profile, listing.id]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3 overflow-hidden rounded-xl">
        {/* Carousel Container */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {images.map((image, index) => (
              <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                <img 
                  src={image} 
                  alt={`${listing.title} - Photo ${index + 1}`} 
                  className="w-full aspect-square object-cover cursor-pointer rounded-[18px]"
                  style={{ aspectRatio: '1 / 1' }}
                  onClick={handleImageClick}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-1/2 left-3 -translate-y-1/2 w-8 h-8 p-0 bg-white/50 hover:bg-white/70 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={scrollPrev}
              style={{ display: canScrollPrev ? 'flex' : 'none' }}
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </Button>
            
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 p-0 bg-white/50 hover:bg-white/70 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={scrollNext}
              style={{ display: canScrollNext ? 'flex' : 'none' }}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </Button>
          </>
        )}
        
        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Guest favorite badge */}
        <Badge className="absolute top-3 left-3 bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded-md shadow-sm z-10">
          Guest favorite
        </Badge>
        
        {/* Heart icon */}
        <Button 
          size="sm" 
          variant="ghost" 
          className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/50 hover:bg-white/70 rounded-full shadow-sm hover:scale-110 transition-transform z-10"
          onClick={handleFavoriteClick}
          disabled={isAddingToFavorites}
        >
          <Heart className={`h-4 w-4 transition-colors ${
            isFavorited 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-600 hover:text-red-500'
          }`} />
        </Button>
      </div>
      
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground text-sm line-clamp-1">
            {listing.title}
          </h3>
          
          <p className="text-muted-foreground text-sm">
            {listing.price}/- for 2 nights
          </p>
          
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-foreground text-foreground" />
            <span className="text-sm text-foreground font-medium">{listing.rating}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ListingCard;