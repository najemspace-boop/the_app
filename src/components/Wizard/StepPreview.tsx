import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
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

  // Validation checks
  const validationIssues = [];
  if (!data.title) validationIssues.push("Property title is required");
  if (!data.description) validationIssues.push("Property description is required");
  if (!data.basePrice || data.basePrice <= 0) validationIssues.push("Base price must be set");
  if (!data.images || data.images.length === 0) validationIssues.push("At least one photo is required");
  if (!data.address) validationIssues.push("Address is required");

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview Your Listing
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Review all information before publishing your property listing.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Validation Alerts */}
        {validationIssues.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Please fix these issues before publishing:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationIssues.map((issue, index) => (
                  <li key={index} className="text-sm">{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Property Preview */}
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{data.title || "Property Title"}</h1>
                <Button size="sm" variant="outline" onClick={() => onEdit(0)}>
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{data.city}, {data.state}, {data.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{data.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span>{data.bedrooms} bed • {data.bathrooms} bath</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${data.basePrice || 0}</div>
              <div className="text-sm text-muted-foreground">per night</div>
            </div>
          </div>

          {/* Images Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Photos ({data.images?.length || 0})</h3>
              <Button size="sm" variant="outline" onClick={() => onEdit(3)}>
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
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">No photos added yet</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Description</h3>
                  <Button size="sm" variant="outline" onClick={() => onEdit(0)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.description || "No description provided"}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Amenities ({data.amenities?.length || 0})
                  </h3>
                  <Button size="sm" variant="outline" onClick={() => onEdit(2)}>
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
                <div className="text-sm space-y-1">
                  <p>{data.address}</p>
                  <p>{data.city}, {data.state} {data.zipcode}</p>
                  <p>{data.country}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing
                  </h3>
                  <Button size="sm" variant="outline" onClick={() => onEdit(5)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base price:</span>
                    <span className="font-medium">${data.basePrice || 0}/night</span>
                  </div>
                  {data.weekendPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Weekend price:</span>
                      <span className="font-medium">${data.weekendPrice}/night</span>
                    </div>
                  )}
                  {data.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span>Cleaning fee:</span>
                      <span className="font-medium">${data.cleaningFee}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Policies */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Policies
                  </h3>
                  <Button size="sm" variant="outline" onClick={() => onEdit(4)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
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
                  <div className="flex justify-between">
                    <span>Cancellation:</span>
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
          </div>
        </div>

        <Separator />

        {/* Publishing Options */}
        <div className="space-y-4">
          <h3 className="font-medium">Ready to Publish?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Publish Now</p>
                  <p className="text-sm text-muted-foreground">
                    Make your listing live and available for bookings
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 opacity-75">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-muted-foreground">Save as Draft</p>
                  <p className="text-sm text-muted-foreground">
                    Save progress and publish later
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={validationIssues.length > 0 || isSubmitting}
              className="px-8"
            >
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepPreview;