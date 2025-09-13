import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Bed, 
  Bath, 
  Layers,
  Compass,
  Key,
  Sofa
} from "lucide-react";

interface StepDetailsProps {
  data: {
    propertyOptions?: {
      area?: string;
      bedrooms?: string;
      bathrooms?: string;
      floors?: string;
      facing?: string;
      readyStatus?: string;
      ownership?: string;
      furnishing?: string;
    };
  };
  onNext: (data: any) => void;
  onBack?: () => void;
}

const StepDetails = ({ data, onNext, onBack }: StepDetailsProps) => {
  const [formData, setFormData] = useState({
    propertyOptions: {
      area: data.propertyOptions?.area || '',
      bedrooms: data.propertyOptions?.bedrooms || '',
      bathrooms: data.propertyOptions?.bathrooms || '',
      floors: data.propertyOptions?.floors || '',
      facing: data.propertyOptions?.facing || '',
      readyStatus: data.propertyOptions?.readyStatus || '',
      ownership: data.propertyOptions?.ownership || '',
      furnishing: data.propertyOptions?.furnishing || '',
    }
  });

  const updatePropertyOption = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      propertyOptions: {
        ...prev.propertyOptions,
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    onNext(formData);
  };

  const facingOptions = [
    'North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'
  ];

  const readyStatusOptions = [
    'Ready to Move', 'Under Construction', 'New Launch', 'Resale'
  ];

  const ownershipOptions = [
    'Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney'
  ];

  const furnishingOptions = [
    'Fully Furnished', 'Semi Furnished', 'Unfurnished'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Provide specific details about your property's size, layout, and characteristics.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Property Area (sq ft)
            </Label>
            <Input
              id="area"
              type="number"
              value={formData.propertyOptions.area}
              onChange={(e) => updatePropertyOption('area', e.target.value)}
              placeholder="Enter total area in square feet"
            />
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Bedrooms
              </Label>
              <Select
                value={formData.propertyOptions.bedrooms}
                onValueChange={(value) => updatePropertyOption('bedrooms', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4 Bedrooms</SelectItem>
                  <SelectItem value="5">5+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="flex items-center gap-2">
                <Bath className="h-4 w-4" />
                Bathrooms
              </Label>
              <Select
                value={formData.propertyOptions.bathrooms}
                onValueChange={(value) => updatePropertyOption('bathrooms', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bathroom</SelectItem>
                  <SelectItem value="2">2 Bathrooms</SelectItem>
                  <SelectItem value="3">3 Bathrooms</SelectItem>
                  <SelectItem value="4">4 Bathrooms</SelectItem>
                  <SelectItem value="5">5+ Bathrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Floors */}
          <div className="space-y-2">
            <Label htmlFor="floors" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Floor Number
            </Label>
            <Input
              id="floors"
              value={formData.propertyOptions.floors}
              onChange={(e) => updatePropertyOption('floors', e.target.value)}
              placeholder="e.g., Ground Floor, 2nd Floor, 10th Floor"
            />
          </div>

          {/* Facing Direction */}
          <div className="space-y-2">
            <Label htmlFor="facing" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Facing Direction
            </Label>
            <Select
              value={formData.propertyOptions.facing}
              onValueChange={(value) => updatePropertyOption('facing', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select facing direction" />
              </SelectTrigger>
              <SelectContent>
                {facingOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ready Status */}
          <div className="space-y-2">
            <Label htmlFor="readyStatus" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Ready Status
            </Label>
            <Select
              value={formData.propertyOptions.readyStatus}
              onValueChange={(value) => updatePropertyOption('readyStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ready status" />
              </SelectTrigger>
              <SelectContent>
                {readyStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ownership Type */}
          <div className="space-y-2">
            <Label htmlFor="ownership" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Ownership Type
            </Label>
            <Select
              value={formData.propertyOptions.ownership}
              onValueChange={(value) => updatePropertyOption('ownership', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                {ownershipOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Furnishing */}
          <div className="space-y-2">
            <Label htmlFor="furnishing" className="flex items-center gap-2">
              <Sofa className="h-4 w-4" />
              Furnishing Status
            </Label>
            <Select
              value={formData.propertyOptions.furnishing}
              onValueChange={(value) => updatePropertyOption('furnishing', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select furnishing status" />
              </SelectTrigger>
              <SelectContent>
                {furnishingOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button 
          onClick={handleNext}
          className={!onBack ? "ml-auto" : ""}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepDetails;