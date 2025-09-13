import { MapPin, Bed, Bath, Home, Star, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';

const PreviewStep = ({ formData }) => {
  const formatPrice = (price, currency = 'USD') => {
    return `${currency} ${price}`;
  };

  const getAmenityName = (amenityId) => {
    const amenityMap = {
      wifi: 'WiFi',
      parking: 'Parking',
      pool: 'Swimming Pool',
      gym: 'Gym/Fitness Center',
      elevator: 'Elevator',
      balcony: 'Balcony',
      garden: 'Garden',
      security: '24/7 Security',
      laundry: 'Laundry',
      kitchen: 'Kitchen',
      air_conditioning: 'Air Conditioning',
      heating: 'Heating',
      tv: 'TV',
      workspace: 'Dedicated Workspace',
      pets_allowed: 'Pets Allowed',
      smoking_allowed: 'Smoking Allowed'
    };
    return amenityMap[amenityId] || amenityId;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Your Listing</h3>
        <p className="text-gray-600 mb-6">
          Review how your listing will appear to potential guests. Make sure everything looks perfect!
        </p>
      </div>

      {/* Main Preview Card */}
      <Card className="overflow-hidden">
        {/* Image Placeholder */}
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          {formData.photos && formData.photos.length > 0 ? (
            <img
              src={URL.createObjectURL(formData.photos[0])}
              alt="Property cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <Home className="h-12 w-12 mx-auto mb-2" />
              <p>No photos uploaded</p>
            </div>
          )}
        </div>

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">{formData.title || 'Property Title'}</CardTitle>
              <CardDescription className="flex items-center space-x-1 mt-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {formData.location?.district && formData.location?.city
                    ? `${formData.location.district}, ${formData.location.city}`
                    : 'Location not specified'
                  }
                </span>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary-600">
                {formData.pricing?.basePrice
                  ? `${formatPrice(formData.pricing.basePrice, formData.pricing.currency)}${formData.listingType === 'rent' ? '/mo' : ''}`
                  : 'Price not set'
                }
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Star className="h-4 w-4" />
                <span>New listing</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Property Details */}
          <div className="flex items-center space-x-6 mb-4">
            {formData.propertyOptions?.bedrooms && (
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {formData.propertyOptions.bedrooms === '0' ? 'Studio' : `${formData.propertyOptions.bedrooms} bed${formData.propertyOptions.bedrooms !== '1' ? 's' : ''}`}
                </span>
              </div>
            )}
            {formData.propertyOptions?.bathrooms && (
              <div className="flex items-center space-x-1">
                <Bath className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formData.propertyOptions.bathrooms} bath{formData.propertyOptions.bathrooms !== '1' ? 's' : ''}</span>
              </div>
            )}
            {formData.propertyOptions?.area && (
              <div className="flex items-center space-x-1">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formData.propertyOptions.area} sqft</span>
              </div>
            )}
          </div>

          {/* Description */}
          {formData.description && (
            <p className="text-gray-700 mb-4 line-clamp-3">{formData.description}</p>
          )}

          {/* Amenities Preview */}
          {formData.amenities && formData.amenities.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.slice(0, 6).map((amenityId) => (
                  <span
                    key={amenityId}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {getAmenityName(amenityId)}
                  </span>
                ))}
                {formData.amenities.length > 6 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{formData.amenities.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Property Type & Category */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="capitalize">{formData.listingType || 'Not specified'}</span>
            <span>•</span>
            <span className="capitalize">{formData.propertyCategory || 'Not specified'}</span>
            {formData.subCategory && (
              <>
                <span>•</span>
                <span className="capitalize">{formData.subCategory}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="capitalize">{formData.listingType || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="capitalize">{formData.propertyCategory || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sub-category:</span>
              <span className="capitalize">{formData.subCategory || 'None'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Area:</span>
              <span>{formData.propertyOptions?.area ? `${formData.propertyOptions.area} sqft` : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span>{formData.propertyOptions?.bedrooms || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bathrooms:</span>
              <span>{formData.propertyOptions?.bathrooms || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Furnishing:</span>
              <span className="capitalize">{formData.propertyOptions?.furnishing?.replace('_', ' ') || 'Not set'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{formData.listingType === 'rent' ? 'Monthly rent:' : 'Sale price:'}</span>
              <span className="font-medium">
                {formData.pricing?.basePrice
                  ? formatPrice(formData.pricing.basePrice, formData.pricing.currency)
                  : 'Not set'
                }
              </span>
            </div>
            {formData.cleaningFee && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cleaning fee:</span>
                <span>{formatPrice(formData.cleaningFee, formData.pricing?.currency)}</span>
              </div>
            )}
            {formData.securityDeposit && (
              <div className="flex justify-between">
                <span className="text-gray-600">Security deposit:</span>
                <span>{formatPrice(formData.securityDeposit, formData.pricing?.currency)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Listing Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Basic Information', completed: !!(formData.title && formData.description && formData.listingType) },
              { label: 'Location', completed: !!(formData.location?.city && formData.location?.district) },
              { label: 'Property Details', completed: !!(formData.propertyOptions?.area && formData.propertyOptions?.bedrooms && formData.propertyOptions?.bathrooms) },
              { label: 'Photos', completed: !!(formData.photos && formData.photos.length >= 5) },
              { label: 'Pricing', completed: !!(formData.pricing?.basePrice) }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {item.completed && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                </div>
                <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Messages */}
      <div className="space-y-3">
        {!formData.title && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">⚠️ Property title is required</p>
          </div>
        )}
        {!formData.description && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">⚠️ Property description is required</p>
          </div>
        )}
        {(!formData.photos || formData.photos.length < 5) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">⚠️ At least 5 photos are required</p>
          </div>
        )}
        {!formData.pricing?.basePrice && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">⚠️ Pricing information is required</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewStep;
