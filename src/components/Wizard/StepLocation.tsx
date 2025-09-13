import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="e.g., 123 Main Street, Apartment 4B"
              required
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g., New York"
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
                placeholder="e.g., NY"
                required
              />
            </div>
          </div>

          {/* Country and ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="e.g., United States"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipcode">ZIP/Postal Code *</Label>
              <Input
                id="zipcode"
                type="text"
                value={formData.zipcode}
                onChange={(e) => updateField('zipcode', e.target.value)}
                placeholder="e.g., 10001"
                required
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="space-y-3">
            <Label>GPS Coordinates (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              className="w-full md:w-auto"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Use Current Location
            </Button>
          </div>

          {/* Location Preview */}
          {formData.latitude && formData.longitude && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Location Preview:</p>
              <p className="text-sm text-muted-foreground">
                {formData.address}, {formData.city}, {formData.state} {formData.zipcode}, {formData.country}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {formData.latitude}, {formData.longitude}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit"
              disabled={!formData.address || !formData.city || !formData.state || !formData.country || !formData.zipcode}
            >
              Next: Amenities
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepLocation;