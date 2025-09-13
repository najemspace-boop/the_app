import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
// Separator component not available, will use inline div
import { Alert, AlertDescription } from "../ui/Alert";
import { 
  Eye, 
  Edit, 
  CheckCircle,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  Wifi,
  Home,
  Shield,
  AlertTriangle
} from "lucide-react";

const StepPreview = ({ data, onSubmit, onBack, onEdit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error submitting listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompletionStatus = () => {
    const requiredFields = [
      data.title,
      data.description,
      data.listingType,
      data.propertyCategory,
      data.address,
      data.city,
      data.basePrice > 0,
      data.images && data.images.length > 0
    ];
    
    const completedFields = requiredFields.filter(Boolean).length;
    const totalFields = requiredFields.length;
    
    return {
      completed: completedFields,
      total: totalFields,
      percentage: Math.round((completedFields / totalFields) * 100)
    };
  };

  const status = getCompletionStatus();
  const isComplete = status.percentage === 100;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Review & Publish
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Status */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Listing Completion</h3>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {status.percentage}% Complete
            </Badge>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${status.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isComplete 
              ? "Your listing is ready to publish!" 
              : `Complete ${status.total - status.completed} more fields to publish`
            }
          </p>
        </div>

        {!isComplete && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please complete all required fields before publishing your listing.
            </AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Basic Information</h3>
            <Button size="sm" variant="outline" onClick={() => onEdit(0)}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">{data.title || "Untitled Property"}</h4>
            <p className="text-muted-foreground">{data.description || "No description provided"}</p>
            <div className="flex gap-2">
              {data.listingType && (
                <Badge variant="secondary" className="capitalize">{data.listingType}</Badge>
              )}
              {data.propertyCategory && (
                <Badge variant="outline" className="capitalize">{data.propertyCategory}</Badge>
              )}
              {data.residentialType && (
                <Badge variant="outline" className="capitalize">{data.residentialType}</Badge>
              )}
              {data.commercialType && (
                <Badge variant="outline" className="capitalize">{data.commercialType}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="border-t my-4"></div>

        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
            <Button size="sm" variant="outline" onClick={() => onEdit(1)}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
          <p className="text-sm">
            {[data.address, data.city, data.state, data.country].filter(Boolean).join(', ') || "Location not specified"}
          </p>
          {data.zipcode && (
            <p className="text-sm text-muted-foreground">ZIP: {data.zipcode}</p>
          )}
        </div>

        <div className="border-t my-4"></div>

        {/* Photos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Photos ({data.images?.length || 0})</h3>
            <Button size="sm" variant="outline" onClick={() => onEdit(5)}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
          {data.images && data.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {data.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-1 left-1 text-xs">Main</Badge>
                  )}
                </div>
              ))}
              {data.images.length > 4 && (
                <div className="flex items-center justify-center bg-muted rounded h-24">
                  <span className="text-sm text-muted-foreground">
                    +{data.images.length - 4} more
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">No photos uploaded</p>
            </div>
          )}
        </div>

        <div className="border-t my-4"></div>

        {/* Property Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Home className="h-4 w-4" />
                Property Details
              </h3>
              <Button size="sm" variant="outline" onClick={() => onEdit(2)}>
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              {data.bedrooms && (
                <div className="flex justify-between">
                  <span>Bedrooms:</span>
                  <span>{data.bedrooms}</span>
                </div>
              )}
              {data.bathrooms && (
                <div className="flex justify-between">
                  <span>Bathrooms:</span>
                  <span>{data.bathrooms}</span>
                </div>
              )}
              {data.buildArea && (
                <div className="flex justify-between">
                  <span>Build Area:</span>
                  <span>{data.buildArea} m²</span>
                </div>
              )}
              {data.totalArea && (
                <div className="flex justify-between">
                  <span>Total Area:</span>
                  <span>{data.totalArea} m²</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Amenities ({data.amenities?.length || 0})
              </h3>
              <Button size="sm" variant="outline" onClick={() => onEdit(3)}>
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            {data.amenities && data.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.amenities.slice(0, 8).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {data.amenities.length > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.amenities.length - 8} more
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No amenities selected</p>
            )}
          </div>
        </div>

        <div className="border-t my-4"></div>

        {/* Pricing */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing
            </h3>
            <Button size="sm" variant="outline" onClick={() => onEdit(6)}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base price per night:</span>
                <span className="font-medium">${data.basePrice || 0}</span>
              </div>
              {data.weekendPrice > 0 && (
                <div className="flex justify-between">
                  <span>Weekend price:</span>
                  <span>${data.weekendPrice}</span>
                </div>
              )}
              {data.cleaningFee > 0 && (
                <div className="flex justify-between">
                  <span>Cleaning fee:</span>
                  <span>${data.cleaningFee}</span>
                </div>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {data.weeklyDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Weekly discount:</span>
                  <span>{data.weeklyDiscount}%</span>
                </div>
              )}
              {data.monthlyDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Monthly discount:</span>
                  <span>{data.monthlyDiscount}%</span>
                </div>
              )}
              {data.securityDeposit > 0 && (
                <div className="flex justify-between">
                  <span>Security deposit:</span>
                  <span>${data.securityDeposit}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t my-4"></div>

        {/* Policies */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Policies
            </h3>
            <Button size="sm" variant="outline" onClick={() => onEdit(7)}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>{data.checkInTime || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>{data.checkOutTime || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum stay:</span>
                <span>{data.minimumStay || 1} night(s)</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cancellation policy:</span>
                <span className="capitalize">{data.cancellationPolicy || "Not set"}</span>
              </div>
            </div>
          </div>

          {/* House Rules */}
          {data.houseRules && data.houseRules.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">House Rules</h3>
              <ul className="text-sm space-y-1">
                {data.houseRules.slice(0, 5).map((rule, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-foreground rounded-full"></span>
                    {rule}
                  </li>
                ))}
                {data.houseRules.length > 5 && (
                  <li className="text-muted-foreground">
                    +{data.houseRules.length - 5} more rules
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete || isSubmitting}
            className="min-w-32"
          >
            {isSubmitting ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Publish Listing
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepPreview;
