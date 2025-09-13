import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
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
        { id: "air_conditioning", label: "Air conditioning", icon: <Wind className="h-4 w-4" /> },
        { id: "heating", label: "Heating", icon: <Zap className="h-4 w-4" /> },
        { id: "washer", label: "Washer", icon: <Shirt className="h-4 w-4" /> },
        { id: "dryer", label: "Dryer", icon: <Shirt className="h-4 w-4" /> },
      ]
    },
    {
      title: "Recreation & Wellness",
      amenities: [
        { id: "pool", label: "Swimming pool", icon: <Waves className="h-4 w-4" /> },
        { id: "gym", label: "Gym/Fitness center", icon: <Dumbbell className="h-4 w-4" /> },
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-sm text-muted-foreground mb-6">
            Select all amenities that your property offers. This helps guests understand what's available during their stay.
          </div>

          {amenityCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="font-medium text-sm">{category.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {category.amenities.map((amenity) => (
                  <Button
                    key={amenity.id}
                    type="button"
                    variant={selectedAmenities.includes(amenity.id) ? "default" : "outline"}
                    className="h-auto p-3 flex items-center gap-2 justify-start"
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    {amenity.icon}
                    <span className="text-sm">{amenity.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Selected Amenities Summary */}
          {selectedAmenities.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-3">Selected Amenities ({selectedAmenities.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAmenities.map((amenityId) => {
                  const amenity = amenityCategories
                    .flatMap(cat => cat.amenities)
                    .find(a => a.id === amenityId);
                  return amenity ? (
                    <Badge key={amenityId} variant="secondary" className="text-xs">
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
              Next: Property Features
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepAmenities;
