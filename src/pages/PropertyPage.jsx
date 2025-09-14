import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import ReservationCalendar from '../components/ui/reservation-calendar';
import { MapPin, Bed, Bath, Home, Calendar, Star, MessageCircle } from 'lucide-react';

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching property data
    setTimeout(() => {
      setProperty({
        id,
        title: 'Luxury Downtown Apartment',
        description: 'Beautiful modern apartment in the heart of the city with stunning views and premium amenities.',
        price: 1200,
        listingType: 'rent',
        location: { city: 'Damascus', district: 'Mazzeh' },
        propertyOptions: {
          bedrooms: 2,
          bathrooms: 2,
          area: 1200
        },
        amenities: ['WiFi', 'Parking', 'Pool', 'Gym'],
        photos: [],
        rating: 4.8,
        reviewsCount: 24
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="aspect-video bg-gray-200 rounded-lg mb-6">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Property Images Placeholder
            </div>
          </div>

          {/* Property Details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{property.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location.district}, {property.location.city}</span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    ${property.price}{property.listingType === 'rent' ? '/mo' : ''}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{property.rating}</span>
                    <span className="text-gray-500">({property.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-1">
                  <Bed className="h-5 w-5 text-gray-500" />
                  <span>{property.propertyOptions.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bath className="h-5 w-5 text-gray-500" />
                  <span>{property.propertyOptions.bathrooms} bathrooms</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Home className="h-5 w-5 text-gray-500" />
                  <span>{property.propertyOptions.area} sqft</span>
                </div>
              </div>
              <p className="text-gray-700">{property.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-lg" style={{backgroundColor: '#7043c7'}}>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Booking Card */}
          <Card className="mb-6 sticky top-4">
            <CardHeader>
              <CardTitle>
                {property.listingType === 'rent' ? 'Book This Property' : 'Contact Owner'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.listingType === 'rent' && (
                <ReservationCalendar
                  onDateRangeSelect={(range) => {
                    console.log('Selected date range:', range);
                  }}
                  onGuestsChange={(guestCount) => {
                    console.log('Selected guests:', guestCount);
                  }}
                  maxGuests={property.propertyOptions?.maxGuests || 8}
                  bookedDates={[
                    new Date(2024, 2, 15),
                    new Date(2024, 2, 16),
                    new Date(2024, 2, 20),
                    new Date(2024, 2, 21)
                  ]}
                  pricePerDate={{
                    '2024-03-01': 250,
                    '2024-03-02': 250,
                    '2024-03-03': 325,
                    '2024-03-04': 325,
                    '2024-03-05': 280,
                    '2024-03-06': 280,
                    '2024-03-07': 250
                  }}
                />
              )}
              
              <Button className="w-full">
                {property.listingType === 'rent' ? 'Request Booking' : 'Contact Owner'}
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
            </CardContent>
          </Card>

          {/* Host Info */}
          <Card>
            <CardHeader>
              <CardTitle>Hosted by John Doe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-500">Host since 2020</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Response rate:</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response time:</span>
                  <span className="font-medium">Within an hour</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
