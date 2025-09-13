import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/Label";
import { 
  Waves, 
  TreePine, 
  MoveVertical as Elevator, 
  Car, 
  Shield, 
  Home,
  Star
} from "lucide-react";

const StepPropertyOptions = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    pool: data.pool || false,
    balcony: data.balcony || false,
    elevator: data.elevator || false,
    parking: data.parking || false,
    garden: data.garden || false,
    security: data.security || false,
  });

  const propertyFeatures = [
    {
      id: 'pool',
      label: 'Swimming Pool',
      description: 'Private or shared swimming pool',
      icon: <Waves className="h-5 w-5" />
    },
    {
      id: 'balcony',
      label: 'Balcony/Terrace',
      description: 'Private outdoor space',
      icon: <Home className="h-5 w-5" />
    },
    {
      id: 'elevator',
      label: 'Elevator',
      description: 'Building has elevator access',
      icon: <Elevator className="h-5 w-5" />
    },
    {
      id: 'parking',
      label: 'Parking Space',
      description: 'Dedicated parking spot',
      icon: <Car className="h-5 w-5" />
    },
    {
      id: 'garden',
      label: 'Garden/Yard',
      description: 'Private or shared garden area',
      icon: <TreePine className="h-5 w-5" />
    },
    {
      id: 'security',
      label: 'Security System',
      description: '24/7 security or security system',
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedCount = Object.values(formData).filter(Boolean).length;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Property Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-sm text-muted-foreground mb-6">
            Select the special features and facilities that your property offers. These help make your listing stand out.
          </div>

          <div className="grid gap-4">
            {propertyFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.label}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  checked={formData[feature.id]}
                  onCheckedChange={(checked) => updateField(feature.id, checked)}
                />
              </div>
            ))}
          </div>

          {/* Selected Features Summary */}
          {selectedCount > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-3">Selected Features ({selectedCount})</h3>
              <div className="flex flex-wrap gap-2">
                {propertyFeatures
                  .filter(feature => formData[feature.id])
                  .map((feature) => (
                    <Badge key={feature.id} variant="secondary" className="text-xs">
                      {feature.label}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Next: Photos & Media
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepPropertyOptions;
