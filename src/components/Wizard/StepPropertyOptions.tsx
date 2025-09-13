import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Waves, 
  Building, 
  Car, 
  Trees, 
  Shield, 
  Home,
  CheckCircle,
  Circle
} from "lucide-react";

interface StepPropertyOptionsProps {
  data: {
    extras?: {
      pool?: boolean;
      balcony?: boolean;
      elevator?: boolean;
      parking?: boolean;
      garden?: boolean;
      security?: boolean;
    };
  };
  onNext: (data: any) => void;
  onBack?: () => void;
}

const StepPropertyOptions = ({ data, onNext, onBack }: StepPropertyOptionsProps) => {
  const [formData, setFormData] = useState({
    extras: {
      pool: data.extras?.pool || false,
      balcony: data.extras?.balcony || false,
      elevator: data.extras?.elevator || false,
      parking: data.extras?.parking || false,
      garden: data.extras?.garden || false,
      security: data.extras?.security || false,
    }
  });

  const propertyOptions = [
    {
      key: 'pool',
      label: 'Swimming Pool',
      description: 'Private or shared swimming pool',
      icon: <Waves className="h-5 w-5" />
    },
    {
      key: 'balcony',
      label: 'Balcony/Terrace',
      description: 'Outdoor space with balcony or terrace',
      icon: <Home className="h-5 w-5" />
    },
    {
      key: 'elevator',
      label: 'Elevator',
      description: 'Building has elevator access',
      icon: <Building className="h-5 w-5" />
    },
    {
      key: 'parking',
      label: 'Parking',
      description: 'Dedicated parking space available',
      icon: <Car className="h-5 w-5" />
    },
    {
      key: 'garden',
      label: 'Garden/Yard',
      description: 'Private or shared garden space',
      icon: <Trees className="h-5 w-5" />
    },
    {
      key: 'security',
      label: 'Security',
      description: 'Security system or guard service',
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const updateOption = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        [key]: value
      }
    }));
  };

  const handleNext = () => {
    onNext(formData);
  };

  const selectedCount = Object.values(formData.extras).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Features & Amenities
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the features and amenities available at your property. These help guests understand what makes your space special.
          </p>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="w-fit">
              {selectedCount} feature{selectedCount !== 1 ? 's' : ''} selected
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertyOptions.map((option) => (
              <Card key={option.key} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor={option.key} className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                        {formData.extras[option.key as keyof typeof formData.extras] && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={option.key}
                    checked={formData.extras[option.key as keyof typeof formData.extras]}
                    onCheckedChange={(checked) => updateOption(option.key, checked)}
                  />
                </div>
              </Card>
            ))}
          </div>

          {selectedCount === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Circle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No features selected yet</p>
              <p className="text-sm">Select the features that apply to your property</p>
            </div>
          )}
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

export default StepPropertyOptions;
