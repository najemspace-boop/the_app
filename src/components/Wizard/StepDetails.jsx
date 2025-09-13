import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Home, Ruler, Bed, Bath, Building, Compass, Calendar, Key, Sofa } from "lucide-react";

const StepDetails = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    area: data.area || '',
    bedrooms: data.bedrooms || 1,
    bathrooms: data.bathrooms || 1,
    floors: data.floors || 1,
    facing: data.facing || '',
    readyStatus: data.readyStatus || '',
    ownership: data.ownership || '',
    furnishing: data.furnishing || '',
  });

  const facingOptions = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'northeast', label: 'North-East' },
    { value: 'northwest', label: 'North-West' },
    { value: 'southeast', label: 'South-East' },
    { value: 'southwest', label: 'South-West' },
  ];

  const readyStatusOptions = [
    { value: 'ready_to_move', label: 'Ready to Move' },
    { value: 'under_construction', label: 'Under Construction' },
    { value: 'new_launch', label: 'New Launch' },
  ];

  const ownershipOptions = [
    { value: 'freehold', label: 'Freehold' },
    { value: 'leasehold', label: 'Leasehold' },
    { value: 'cooperative_society', label: 'Cooperative Society' },
    { value: 'power_of_attorney', label: 'Power of Attorney' },
  ];

  const furnishingOptions = [
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi_furnished', label: 'Semi-Furnished' },
    { value: 'fully_furnished', label: 'Fully Furnished' },
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
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Property Area (sq ft) *
            </Label>
            <Input
              id="area"
              type="number"
              min="1"
              value={formData.area}
              onChange={(e) => updateField('area', parseFloat(e.target.value) || '')}
              placeholder="e.g., 1200"
              required
            />
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Bedrooms *
              </Label>
              <Select value={formData.bedrooms.toString()} onValueChange={(value) => updateField('bedrooms', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="flex items-center gap-2">
                <Bath className="h-4 w-4" />
                Bathrooms *
              </Label>
              <Select value={formData.bathrooms.toString()} onValueChange={(value) => updateField('bathrooms', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Floors */}
          <div className="space-y-2">
            <Label htmlFor="floors" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Number of Floors
            </Label>
            <Select value={formData.floors.toString()} onValueChange={(value) => updateField('floors', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select floors" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Floor' : 'Floors'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Facing Direction */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Facing Direction
            </Label>
            <RadioGroup 
              value={formData.facing} 
              onValueChange={(value) => updateField('facing', value)}
              className="grid grid-cols-2 gap-4"
            >
              {facingOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Ready Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ready Status *
            </Label>
            <RadioGroup 
              value={formData.readyStatus} 
              onValueChange={(value) => updateField('readyStatus', value)}
              className="space-y-2"
            >
              {readyStatusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Ownership */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Ownership Type *
            </Label>
            <RadioGroup 
              value={formData.ownership} 
              onValueChange={(value) => updateField('ownership', value)}
              className="space-y-2"
            >
              {ownershipOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Furnishing */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sofa className="h-4 w-4" />
              Furnishing Status *
            </Label>
            <RadioGroup 
              value={formData.furnishing} 
              onValueChange={(value) => updateField('furnishing', value)}
              className="space-y-2"
            >
              {furnishingOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit"
              disabled={!formData.area || !formData.readyStatus || !formData.ownership || !formData.furnishing}
            >
              Next: Amenities
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepDetails;
