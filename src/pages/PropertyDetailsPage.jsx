import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { ReservationBox } from "../components/ReservationBox";
import LocationMap from "../components/LocationMap";
import ReviewsSection from "../components/ReviewsSection";
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Phone,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";

const PropertyDetailsPage = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRTL = language === 'ar';

  // Translation helper (simplified for now)
  const t = (key) => {
    const translations = {
      en: {
        showAllPhotos: 'Show all photos',
        reviews: 'reviews',
        bedrooms: 'bedrooms',
        bathrooms: 'bathrooms',
        description: 'Description',
        propertyFeatures: 'Property Features',
        amenities: 'Amenities',
        propertyOwner: 'Property Owner',
        viewProfile: 'View Profile',
        viewAllReviews: 'View All Reviews',
        verifiedReviews: 'verified reviews from previous tenants',
        contactOwner: 'Contact Owner',
        shareProperty: 'Share Property',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        backToListings: 'Back to Listings'
      },
      ar: {
        showAllPhotos: 'عرض جميع الصور',
        reviews: 'تقييمات',
        bedrooms: 'غرف نوم',
        bathrooms: 'حمامات',
        description: 'الوصف',
        propertyFeatures: 'مميزات العقار',
        amenities: 'المرافق',
        propertyOwner: 'مالك العقار',
        viewProfile: 'عرض الملف الشخصي',
        viewAllReviews: 'عرض جميع التقييمات',
        verifiedReviews: 'تقييمات موثقة من المستأجرين السابقين',
        contactOwner: 'تواصل مع المالك',
        shareProperty: 'مشاركة العقار',
        addToFavorites: 'إضافة للمفضلة',
        removeFromFavorites: 'إزالة من المفضلة',
        backToListings: 'العودة للقوائم'
      }
    };
    return translations[language]?.[key] || key;
  };

  // Fetch property data from Firebase
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const propertyDoc = await getDoc(doc(db, 'listings', id));
        
        if (propertyDoc.exists()) {
          const propertyData = { id: propertyDoc.id, ...propertyDoc.data() };
          setProperty(propertyData);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      setIsFavorite(!isFavorite);
      // TODO: Implement favorite functionality with Firebase
      toast.success(isFavorite ? t('removeFromFavorites') : t('addToFavorites'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
      setIsFavorite(!isFavorite); // Revert on error
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title || 'Property Details',
          text: property?.description || 'Check out this property',
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Property link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share property');
    }
  };

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <Link to="/listings">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToListings')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'text-arabic' : ''}`}>
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/listings">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToListings')}
          </Button>
        </Link>
      </div>
      
      <div className="container mx-auto px-4 pb-8">
        {/* Image Gallery Grid */}
        <div className="relative mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-[400px] rounded-lg overflow-hidden">
            {/* Main large image - takes up 3/4 of the width */}
            <div className="lg:col-span-3 relative">
              <img 
                src={property.images?.[currentImageIndex] || '/placeholder.svg'} 
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity rounded-l-lg"
                onClick={() => setCurrentImageIndex(0)}
              />
              
              {/* Navigation arrows for main image */}
              {property.images?.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Grid of smaller images - takes up 1/4 of the width */}
            <div className="lg:col-span-1 grid grid-rows-2 gap-2 h-full">
              {/* Top right image */}
              <div className="relative">
                <img 
                  src={property.images?.[1] || property.images?.[0] || '/placeholder.svg'} 
                  alt={`${property.title} - Image 2`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setCurrentImageIndex(1)}
                />
              </div>
              
              {/* Bottom right image with overlay */}
              <div className="relative">
                <img 
                  src={property.images?.[2] || property.images?.[0] || '/placeholder.svg'} 
                  alt={`${property.title} - Image 3`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity rounded-br-lg"
                  onClick={() => setCurrentImageIndex(2)}
                />
                
                {/* Show all photos overlay */}
                {property.images?.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-all rounded-br-lg">
                    <div className="text-white text-center">
                      <div className="grid grid-cols-3 gap-0.5 mb-2 w-5 h-5 mx-auto">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="bg-white rounded-[1px] w-1 h-1"></div>
                        ))}
                      </div>
                      <span className="text-sm font-medium">{t('showAllPhotos')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`absolute top-4 flex gap-2 ${isRTL ? 'left-4' : 'right-4'}`}>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleFavoriteToggle}
              className="bg-white/90 hover:bg-white shadow-sm"
              title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handleShare}
              className="bg-white/90 hover:bg-white shadow-sm"
              title={t('shareProperty')}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div>
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="secondary">{property.listingType || 'For Rent'}</Badge>
                {property.rating && (
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-muted-foreground">({property.reviewCount || 0} {t('reviews')})</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              
              <div className={`flex items-center text-muted-foreground mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {property.location?.address || property.location?.city || 'Location not specified'}
              </div>

              <div className={`flex items-center gap-6 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Bed className="h-4 w-4" />
                  {property.bedrooms || 0} {t('bedrooms')}
                </div>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Bath className="h-4 w-4" />
                  {property.bathrooms || 0} {t('bathrooms')}
                </div>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Maximize className="h-4 w-4" />
                  {property.area || 'N/A'} sq ft
                </div>
              </div>

              {/* Price */}
              <div className="mt-4">
                <div className="text-3xl font-bold text-primary">
                  ${property.price || 'N/A'}
                  <span className="text-lg font-normal text-muted-foreground">
                    /{property.period || 'month'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">{t('description')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t('propertyFeatures')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t('amenities')}</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reservation System */}
            <ReservationBox 
              propertyId={id} 
              property={property}
              priceLabel={property.period || 'month'} 
            />

            {/* Location Map */}
            <LocationMap 
              latitude={property.location?.coordinates?.lat || 25.2048}
              longitude={property.location?.coordinates?.lng || 55.2708}
              address={property.location?.address || 'Address not specified'}
              city={property.location?.city || 'City not specified'}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('propertyOwner')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={property.owner?.avatar || '/placeholder.svg'} />
                    <AvatarFallback>
                      {property.owner?.name?.charAt(0) || 'O'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{property.owner?.name || 'Property Owner'}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {property.owner?.rating || 'N/A'} • {property.owner?.properties || 0} properties
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {property.owner?.joinedDate || 'Member since 2024'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    {t('viewProfile')}
                  </Button>
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('contactOwner')}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">{t('reviews')}</h2>
          <ReviewsSection property={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
