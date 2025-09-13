import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Home, Building2, Castle, Tent, MapPin, TreePine, Bed, Hotel, Utensils, Calendar, Building, Store, Warehouse, Car, Factory, MapPin as Land, Wrench } from "lucide-react";

const StepBasics = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    listingType: data.listingType || '',
    propertyCategory: data.propertyCategory || '',
    residentialType: data.residentialType || '',
    commercialType: data.commercialType || '',
    title: data.title || '',
    description: data.description || '',
    bedrooms: data.bedrooms || 1,
    bathrooms: data.bathrooms || 1,
    buildArea: data.buildArea || '',
    totalArea: data.totalArea || '',
    location: data.location || '',
    specialFeatures: data.specialFeatures || '',
  });

  const residentialTypes = [
    { value: 'flat', label: 'Flat', icon: <Building2 className="h-4 w-4" /> },
    { value: 'villa', label: 'Villa', icon: <Castle className="h-4 w-4" /> },
    { value: 'room', label: 'Room', icon: <Bed className="h-4 w-4" /> },
    { value: 'motel_room', label: 'Motel Room', icon: <Hotel className="h-4 w-4" /> },
    { value: 'farm', label: 'Farm', icon: <TreePine className="h-4 w-4" /> },
    { value: 'hotel_room', label: 'Hotel Room', icon: <Hotel className="h-4 w-4" /> },
    { value: 'cultural_house', label: 'Cultural House', icon: <Home className="h-4 w-4" /> },
    { value: 'ballroom', label: 'Ballroom', icon: <Utensils className="h-4 w-4" /> },
    { value: 'other', label: 'Other', icon: <Home className="h-4 w-4" /> },
  ];

  const commercialTypes = [
    { value: 'office', label: 'Office', icon: <Building className="h-4 w-4" /> },
    { value: 'shop', label: 'Shop', icon: <Store className="h-4 w-4" /> },
    { value: 'warehouse', label: 'Warehouse', icon: <Warehouse className="h-4 w-4" /> },
    { value: 'showroom', label: 'Showroom', icon: <Car className="h-4 w-4" /> },
    { value: 'factory', label: 'Factory', icon: <Factory className="h-4 w-4" /> },
    { value: 'commercial_land', label: 'Commercial Land', icon: <Land className="h-4 w-4" /> },
    { value: 'farm', label: 'Farm', icon: <TreePine className="h-4 w-4" /> },
    { value: 'workshop', label: 'Workshop', icon: <Wrench className="h-4 w-4" /> },
    { value: 'other', label: 'Other', icon: <Building className="h-4 w-4" /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Property Basics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Type */}
          <div className="space-y-3">
            <Label>Choose Listing Type *</Label>
            <RadioGroup 
              value={formData.listingType} 
              onValueChange={(value) => updateField('listingType', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sell" id="sell" />
                <Label htmlFor="sell">Sell</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rent" id="rent" />
                <Label htmlFor="rent">Rent</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Property Category */}
          {formData.listingType && (
            <div className="space-y-3">
              <Label>Property Category *</Label>
              <RadioGroup 
                value={formData.propertyCategory} 
                onValueChange={(value) => updateField('propertyCategory', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="residential" id="residential" />
                  <Label htmlFor="residential">Residential</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial">Commercial</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Residential Property Type */}
          {formData.propertyCategory === 'residential' && (
            <div className="space-y-3">
              <Label>Property Type *</Label>
              <div className="grid grid-cols-3 gap-3">
                {residentialTypes.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={formData.residentialType === type.value ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => updateField('residentialType', type.value)}
                  >
                    {type.icon}
                    <span className="text-sm text-center">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Commercial Property Type */}
          {formData.propertyCategory === 'commercial' && (
            <div className="space-y-3">
              <Label>Property Type *</Label>
              <div className="grid grid-cols-3 gap-3">
                {commercialTypes.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={formData.commercialType === type.value ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => updateField('commercialType', type.value)}
                  >
                    {type.icon}
                    <span className="text-sm text-center">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Property Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Beautiful Downtown Villa with Garden View"
              required
            />
          </div>

          {/* Property Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your property, its features, and what makes it special..."
              rows={4}
              required
            />
          </div>

          {/* Bedrooms and Bathrooms - Only for Residential */}
          {formData.propertyCategory === 'residential' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.bedrooms}
                  onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.bathrooms}
                  onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>
          )}

          {/* Build Area and Total Area */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildArea">Build Area (m²) *</Label>
              <Input
                id="buildArea"
                type="number"
                min="1"
                value={formData.buildArea}
                onChange={(e) => updateField('buildArea', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 150"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalArea">Total Area (m²) *</Label>
              <Input
                id="totalArea"
                type="number"
                min="1"
                value={formData.totalArea}
                onChange={(e) => updateField('totalArea', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 200"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="Enter address or choose from map"
              required
            />
          </div>

          {/* Special Features */}
          <div className="space-y-2">
            <Label htmlFor="specialFeatures">Special Features</Label>
            <Textarea
              id="specialFeatures"
              value={formData.specialFeatures}
              onChange={(e) => updateField('specialFeatures', e.target.value)}
              placeholder="List any special features like pool, garden, garage, etc."
              rows={3}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {onBack ? (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button 
              type="submit"
              disabled={!formData.listingType || !formData.propertyCategory || 
                       (formData.propertyCategory === 'residential' && !formData.residentialType) ||
                       (formData.propertyCategory === 'commercial' && !formData.commercialType) ||
                       !formData.title || !formData.description || !formData.location}
            >
              Next: Location
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepBasics;
