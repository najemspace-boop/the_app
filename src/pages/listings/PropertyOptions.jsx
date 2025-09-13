import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Building, Home, Car, MoveVertical as Elevator, Sofa, Eye } from 'lucide-react';

const PropertyOptions = ({ data, onUpdate, onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    facing: data.facing || '',
    condition: data.condition || '',
    floors: data.floors || 1,
    hasElevator: data.hasElevator || false,
    parkingSpaces: data.parkingSpaces || 0,
    furnishing: data.furnishing || 'unfurnished',
    balconies: data.balconies || 0,
    ...data
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
    { value: 'front', label: 'Front Facing' },
    { value: 'back', label: 'Back Facing' },
    { value: 'both_sides', label: 'Both Sides' }
  ];

  const conditionOptions = [
    { value: 'ready_to_move', label: 'Ready to Move', description: 'Property is ready for immediate occupancy' },
    { value: 'under_construction', label: 'Under Construction', description: 'Property is still being built' },
    { value: 'off_plan', label: 'Off Plan', description: 'Property exists only in plans/blueprints' },
    { value: 'brand_new', label: 'Brand New', description: 'Newly constructed, never occupied' },
    { value: 'renovated', label: 'Recently Renovated', description: 'Property has been recently updated' },
    { value: 'needs_renovation', label: 'Needs Renovation', description: 'Property requires updates/repairs' }
  ];

  const furnishingOptions = [
    { value: 'unfurnished', label: 'Unfurnished', description: 'No furniture included' },
    { value: 'semi_furnished', label: 'Semi-Furnished', description: 'Basic furniture and appliances' },
    { value: 'fully_furnished', label: 'Fully Furnished', description: 'Complete furniture and appliances' },
    { value: 'luxury_furnished', label: 'Luxury Furnished', description: 'High-end furniture and premium appliances' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Options</h2>
        <p className="text-gray-600">Specify additional property details and features</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Facing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Property Facing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {facingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('facing', option.value)}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    formData.facing === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Condition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Property Condition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conditionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('condition', option.value)}
                  className={`w-full p-3 text-left border rounded-lg transition-colors ${
                    formData.condition === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Building Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Building Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="floors">Number of Floors</Label>
              <Input
                id="floors"
                type="number"
                min="1"
                max="200"
                value={formData.floors}
                onChange={(e) => handleInputChange('floors', parseInt(e.target.value) || 1)}
                placeholder="Enter number of floors"
              />
            </div>

            <div>
              <Label htmlFor="balconies">Number of Balconies</Label>
              <Input
                id="balconies"
                type="number"
                min="0"
                max="20"
                value={formData.balconies}
                onChange={(e) => handleInputChange('balconies', parseInt(e.target.value) || 0)}
                placeholder="Enter number of balconies"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="hasElevator"
                type="checkbox"
                checked={formData.hasElevator}
                onChange={(e) => handleInputChange('hasElevator', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <Label htmlFor="hasElevator" className="flex items-center space-x-2">
                <Elevator className="h-4 w-4" />
                <span>Has Elevator</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Parking & Furnishing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Parking & Furnishing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="parkingSpaces">Parking Spaces</Label>
              <Input
                id="parkingSpaces"
                type="number"
                min="0"
                max="20"
                value={formData.parkingSpaces}
                onChange={(e) => handleInputChange('parkingSpaces', parseInt(e.target.value) || 0)}
                placeholder="Number of parking spaces"
              />
            </div>

            <div>
              <Label>Furnishing Level</Label>
              <div className="space-y-2 mt-2">
                {furnishingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('furnishing', option.value)}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      formData.furnishing === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sofa className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext}>
          Next: Preview
        </Button>
      </div>
    </div>
  );
};

export default PropertyOptions;
