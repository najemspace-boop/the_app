import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Wifi, 
  Car, 
  Utensils, 
  Tv, 
  Waves, 
  Dumbbell, 
  Wind, 
  Shirt,
  Coffee,
  Zap,
  Shield,
  Baby
} from "lucide-react";

const StepAmenities = ({ data, onNext, onBack }) => {
  const [selectedAmenities, setSelectedAmenities] = useState(data.amenities || []);

  const amenityCategories = [
    {
      title: "Internet & Technology",
      amenities: [
        { id: "wifi", label: "High-speed WiFi", icon: <Wifi className="h-4 w-4" /> },
        { id: "tv", label: "TV with streaming", icon: <Tv className="h-4 w-4" /> },
        { id: "workspace", label: "Dedicated workspace", icon: <Coffee className="h-4 w-4" /> },
      ]
    },
    {
      title: "Kitchen & Dining",
      amenities: [
        { id: "kitchen", label: "Full kitchen", icon: <Utensils className="h-4 w-4" /> },
        { id: "coffee_maker", label: "Coffee maker", icon: <Coffee className="h-4 w-4" /> },
        { id: "dishwasher", label: "Dishwasher", icon: <Utensils className="h-4 w-4" /> },
      ]
    },
    {
      title: "Climate & Comfort",
      amenities: [
        { id: "ac", label: "Air conditioning", icon: <Wind className="h-4 w-4" /> },
        { id: "heating", label: "Heating", icon: <Zap className="h-4 w-4" /> },
        { id: "washer", label: "Washer", icon: <Shirt className="h-4 w-4" /> },
        { id: "dryer", label: "Dryer", icon: <Shirt className="h-4 w-4" /> },
      ]
    },
    {
      title: "Recreation & Fitness",
      amenities: [
        { id: "pool", label: "Swimming pool", icon: <Waves className="h-4 w-4" /> },
        { id: "gym", label: "Fitness center", icon: <Dumbbell className="h-4 w-4" /> },
        { id: "balcony", label: "Balcony/Terrace", icon: <Coffee className="h-4 w-4" /> },
      ]
    },
    {
      title: "Safety & Security",
      amenities: [
        { id: "security_cameras", label: "Security cameras", icon: <Shield className="h-4 w-4" /> },
        { id: "smoke_alarm", label: "Smoke alarm", icon: <Shield className="h-4 w-4" /> },
        { id: "first_aid", label: "First aid kit", icon: <Shield className="h-4 w-4" /> },
      ]
    },
    {
      title: "Parking & Transportation",
      amenities: [
        { id: "free_parking", label: "Free parking", icon: <Car className="h-4 w-4" /> },
        { id: "garage", label: "Private garage", icon: <Car className="h-4 w-4" /> },
      ]
    },
    {
      title: "Family-Friendly",
      amenities: [
        { id: "crib", label: "Baby crib", icon: <Baby className="h-4 w-4" /> },
        { id: "high_chair", label: "High chair", icon: <Baby className="h-4 w-4" /> },
        { id: "baby_bath", label: "Baby bath", icon: <Baby className="h-4 w-4" /> },
      ]
    }
  ];

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ amenities: selectedAmenities });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Property Amenities
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select all amenities available at your property. This helps guests find what they need.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {amenityCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h3 className="font-semibold text-lg">{category.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.amenities.map((amenity) => (
                  <Button
                    key={amenity.id}
                    type="button"
                    variant={selectedAmenities.includes(amenity.id) ? "default" : "outline"}
                    className="h-auto p-4 justify-start"
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <div className="flex items-center gap-3">
                      {amenity.icon}
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Selected Amenities Summary */}
          {selectedAmenities.length > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Selected Amenities ({selectedAmenities.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAmenities.map((amenityId) => {
                  const amenity = amenityCategories
                    .flatMap(cat => cat.amenities)
                    .find(a => a.id === amenityId);
                  return amenity ? (
                    <Badge key={amenityId} variant="secondary">
                      {amenity.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Next: Media Upload
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepAmenities;