import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const AmenitiesStep = ({ formData, updateFormData }) => {
  const [availableAmenities] = useState([
    { id: 'wifi', name: 'WiFi', icon: '📶' },
    { id: 'parking', name: 'Parking', icon: '🅿️' },
    { id: 'pool', name: 'Swimming Pool', icon: '🏊' },
    { id: 'gym', name: 'Gym/Fitness Center', icon: '💪' },
    { id: 'elevator', name: 'Elevator', icon: '🛗' },
    { id: 'balcony', name: 'Balcony', icon: '🏠' },
    { id: 'garden', name: 'Garden', icon: '🌿' },
    { id: 'security', name: '24/7 Security', icon: '🔒' },
    { id: 'laundry', name: 'Laundry', icon: '👕' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'air_conditioning', name: 'Air Conditioning', icon: '❄️' },
    { id: 'heating', name: 'Heating', icon: '🔥' },
    { id: 'tv', name: 'TV', icon: '📺' },
    { id: 'workspace', name: 'Dedicated Workspace', icon: '💻' },
    { id: 'pets_allowed', name: 'Pets Allowed', icon: '🐕' },
    { id: 'smoking_allowed', name: 'Smoking Allowed', icon: '🚬' }
  ]);

  const toggleAmenity = (amenityId) => {
    const currentAmenities = formData.amenities || [];
    const isSelected = currentAmenities.includes(amenityId);
    
    let newAmenities;
    if (isSelected) {
      newAmenities = currentAmenities.filter(id => id !== amenityId);
    } else {
      newAmenities = [...currentAmenities, amenityId];
    }
    
    updateFormData({ amenities: newAmenities });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
        <p className="text-gray-600 mb-6">
          What amenities does your property offer? Select all that apply.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableAmenities.map((amenity) => {
          const isSelected = formData.amenities?.includes(amenity.id);
          
          return (
            <div
              key={amenity.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleAmenity(amenity.id)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              
              <div className="text-center">
                <div className="text-2xl mb-2">{amenity.icon}</div>
                <h4 className="text-sm font-medium text-gray-900">{amenity.name}</h4>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="font-medium text-gray-900 mb-2">Selected Amenities</h4>
        {formData.amenities?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenityId) => {
              const amenity = availableAmenities.find(a => a.id === amenityId);
              return (
                <span
                  key={amenityId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {amenity?.icon} {amenity?.name}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No amenities selected yet</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">Amenity Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• More amenities can attract more guests and higher rates</li>
          <li>• Be honest about what's available to avoid disappointed guests</li>
          <li>• Essential amenities like WiFi and parking are highly valued</li>
        </ul>
      </div>
    </div>
  );
};

export default AmenitiesStep;
