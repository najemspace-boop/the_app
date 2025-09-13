import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { MapPin } from "lucide-react";

const StepLocation = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    country: data.country || '',
    zipcode: data.zipcode || '',
    latitude: data.latitude || null,
    longitude: data.longitude || null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Enter your property's street address"
              required
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="City"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="State or Province"
                required
              />
            </div>
          </div>

          {/* Country and Zipcode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="Country"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipcode">ZIP/Postal Code</Label>
              <Input
                id="zipcode"
                type="text"
                value={formData.zipcode}
                onChange={(e) => updateField('zipcode', e.target.value)}
                placeholder="ZIP or Postal Code"
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>GPS Coordinates (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetCurrentLocation}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Get Current Location
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude || ''}
                  onChange={(e) => updateField('latitude', parseFloat(e.target.value) || null)}
                  placeholder="e.g., 40.7128"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude || ''}
                  onChange={(e) => updateField('longitude', parseFloat(e.target.value) || null)}
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Interactive map will be displayed here
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Click on the map to set your property's exact location
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit"
              disabled={!formData.address || !formData.city || !formData.state || !formData.country}
            >
              Next: Property Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepLocation;
