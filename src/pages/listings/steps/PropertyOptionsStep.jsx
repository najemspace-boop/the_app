import { Check } from 'lucide-react';

const PropertyOptionsStep = ({ formData, updateFormData }) => {
  const handleExtrasChange = (field, value) => {
    updateFormData({
      extras: {
        ...formData.extras,
        [field]: value
      }
    });
  };

  const extraOptions = [
    { id: 'pool', name: 'Swimming Pool', icon: '🏊' },
    { id: 'balcony', name: 'Balcony/Terrace', icon: '🏠' },
    { id: 'elevator', name: 'Elevator', icon: '🛗' },
    { id: 'parking', name: 'Parking Space', icon: '🅿️' },
    { id: 'garden', name: 'Garden/Yard', icon: '🌿' },
    { id: 'security', name: '24/7 Security', icon: '🔒' },
    { id: 'concierge', name: 'Concierge Service', icon: '🛎️' },
    { id: 'storage', name: 'Storage Room', icon: '📦' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Options</h3>
        <p className="text-gray-600 mb-6">
          Select additional features and options available with your property.
        </p>
      </div>

      {/* Extra Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Additional Features
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {extraOptions.map((option) => {
            const isSelected = formData.extras?.[option.id] || false;
            
            return (
              <div
                key={option.id}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleExtrasChange(option.id, !isSelected)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <h4 className="text-sm font-medium text-gray-900">{option.name}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Highlights (Optional)
        </label>
        <textarea
          placeholder="Mention any special features, recent renovations, or unique selling points..."
          value={formData.highlights || ''}
          onChange={(e) => updateFormData({ highlights: e.target.value })}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Highlight what makes your property special or unique
        </p>
      </div>

      {/* Nearby Attractions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nearby Attractions & Landmarks
        </label>
        <textarea
          placeholder="List nearby attractions, restaurants, shopping centers, schools, etc..."
          value={formData.nearbyAttractions || ''}
          onChange={(e) => updateFormData({ nearbyAttractions: e.target.value })}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Help guests understand what's around your property
        </p>
      </div>

      {/* Transportation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transportation Access
        </label>
        <textarea
          placeholder="Describe public transport, metro stations, bus stops, airport distance..."
          value={formData.transportation || ''}
          onChange={(e) => updateFormData({ transportation: e.target.value })}
          rows={2}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Information about getting to and from your property
        </p>
      </div>

      {/* Selected Features Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="font-medium text-gray-900 mb-2">Selected Features</h4>
        {Object.entries(formData.extras || {}).some(([_, value]) => value) ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(formData.extras || {}).map(([key, value]) => {
              if (!value) return null;
              const option = extraOptions.find(o => o.id === key);
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {option?.icon} {option?.name}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No additional features selected</p>
        )}
      </div>
    </div>
  );
};

export default PropertyOptionsStep;
