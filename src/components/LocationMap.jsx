import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { MapPin, Navigation, Share2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LocationMap = ({ property }) => {
  const { language } = useLanguage();
  const [showExactLocation, setShowExactLocation] = useState(false);

  // Mock coordinates - in real app, these would come from property data
  const coordinates = property?.coordinates || {
    lat: 25.2048,
    lng: 55.2708 // Dubai coordinates as default
  };

  const address = property?.address || {
    en: "Downtown Dubai, Dubai, UAE",
    ar: "وسط مدينة دبي، دبي، الإمارات العربية المتحدة"
  };

  const neighborhood = property?.neighborhood || {
    en: "Downtown Dubai",
    ar: "وسط مدينة دبي"
  };

  const translations = {
    en: {
      exactLocation: "Exact location",
      approximateArea: "Approximate area",
      showExactLocation: "Show exact location",
      hideExactLocation: "Hide exact location",
      getDirections: "Get directions",
      shareLocation: "Share location",
      openInMaps: "Open in Google Maps",
      nearbyPlaces: "Nearby places",
      walkingDistance: "Walking distance",
      drivingDistance: "Driving distance",
      publicTransport: "Public transport nearby",
      locationPrivacy: "For your privacy, we show the approximate area until you book.",
      restaurants: "Restaurants",
      shopping: "Shopping",
      transport: "Transport",
      attractions: "Attractions"
    },
    ar: {
      exactLocation: "الموقع الدقيق",
      approximateArea: "المنطقة التقريبية",
      showExactLocation: "إظهار الموقع الدقيق",
      hideExactLocation: "إخفاء الموقع الدقيق",
      getDirections: "الحصول على الاتجاهات",
      shareLocation: "مشاركة الموقع",
      openInMaps: "فتح في خرائط جوجل",
      nearbyPlaces: "الأماكن القريبة",
      walkingDistance: "مسافة المشي",
      drivingDistance: "مسافة القيادة",
      publicTransport: "وسائل النقل العام القريبة",
      locationPrivacy: "لحماية خصوصيتك، نعرض المنطقة التقريبية حتى تقوم بالحجز.",
      restaurants: "المطاعم",
      shopping: "التسوق",
      transport: "النقل",
      attractions: "المعالم السياحية"
    }
  };

  const t = translations[language] || translations.en;

  // Mock nearby places data
  const nearbyPlaces = [
    {
      category: t.restaurants,
      icon: "🍽️",
      places: [
        { name: "Burj Al Arab Restaurant", distance: "0.5 km" },
        { name: "Dubai Mall Food Court", distance: "0.8 km" },
        { name: "Local Café", distance: "0.2 km" }
      ]
    },
    {
      category: t.shopping,
      icon: "🛍️",
      places: [
        { name: "Dubai Mall", distance: "0.8 km" },
        { name: "Souk Al Bahar", distance: "0.6 km" },
        { name: "Local Market", distance: "0.3 km" }
      ]
    },
    {
      category: t.transport,
      icon: "🚇",
      places: [
        { name: "Burj Khalifa Metro", distance: "0.7 km" },
        { name: "Bus Station", distance: "0.4 km" },
        { name: "Taxi Stand", distance: "0.1 km" }
      ]
    },
    {
      category: t.attractions,
      icon: "🏛️",
      places: [
        { name: "Burj Khalifa", distance: "0.9 km" },
        { name: "Dubai Fountain", distance: "0.8 km" },
        { name: "Dubai Opera", distance: "1.2 km" }
      ]
    }
  ];

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleShareLocation = async () => {
    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Property Location',
          text: address[language],
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            {/* Map Placeholder - In real app, integrate with Google Maps, Mapbox, or similar */}
            <div 
              className="w-full h-80 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-t-lg relative overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Location Pin */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`relative ${showExactLocation ? 'animate-bounce' : ''}`}>
                  <MapPin 
                    className={`w-12 h-12 ${showExactLocation ? 'text-red-500' : 'text-blue-500'} drop-shadow-lg`}
                    fill="currentColor"
                  />
                  {!showExactLocation && (
                    <div className="absolute -inset-8 border-2 border-blue-500 border-dashed rounded-full opacity-50 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleGetDirections}
                  className="shadow-lg"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {t.getDirections}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShareLocation}
                  className="shadow-lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t.shareLocation}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleOpenInMaps}
                  className="shadow-lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t.openInMaps}
                </Button>
              </div>

              {/* Location Type Indicator */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${showExactLocation ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <span className="text-sm font-medium">
                      {showExactLocation ? t.exactLocation : t.approximateArea}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {neighborhood[language]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address[language]}
                  </p>
                </div>
                <Button
                  variant={showExactLocation ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setShowExactLocation(!showExactLocation)}
                >
                  {showExactLocation ? t.hideExactLocation : t.showExactLocation}
                </Button>
              </div>

              {!showExactLocation && (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  {t.locationPrivacy}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Places */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t.nearbyPlaces}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyPlaces.map((category, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.places.map((place, placeIndex) => (
                    <div key={placeIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{place.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transportation Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t.publicTransport}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl mb-2">🚶‍♂️</div>
              <div className="font-medium">{t.walkingDistance}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">5-15 min</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl mb-2">🚗</div>
              <div className="font-medium">{t.drivingDistance}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">2-8 min</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl mb-2">🚇</div>
              <div className="font-medium">Metro</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">7 min walk</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationMap;