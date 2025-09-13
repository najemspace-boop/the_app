import { Input } from '../../../components/ui/Input';

const DetailsStep = ({ formData, updateFormData }) => {
  const handlePropertyOptionsChange = (field, value) => {
    updateFormData({
      propertyOptions: {
        ...formData.propertyOptions,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
        <p className="text-gray-600 mb-6">
          Tell us about the size and structure of your property.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area (sqft) *
          </label>
          <Input
            type="number"
            placeholder="1200"
            value={formData.propertyOptions.area}
            onChange={(e) => handlePropertyOptionsChange('area', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms *
          </label>
          <select
            value={formData.propertyOptions.bedrooms}
            onChange={(e) => handlePropertyOptionsChange('bedrooms', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option value="0">Studio</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4 Bedrooms</option>
            <option value="5+">5+ Bedrooms</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms *
          </label>
          <select
            value={formData.propertyOptions.bathrooms}
            onChange={(e) => handlePropertyOptionsChange('bathrooms', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option value="1">1 Bathroom</option>
            <option value="1.5">1.5 Bathrooms</option>
            <option value="2">2 Bathrooms</option>
            <option value="2.5">2.5 Bathrooms</option>
            <option value="3">3 Bathrooms</option>
            <option value="3+">3+ Bathrooms</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Floors
          </label>
          <select
            value={formData.propertyOptions.floors}
            onChange={(e) => handlePropertyOptionsChange('floors', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option value="1">1 Floor</option>
            <option value="2">2 Floors</option>
            <option value="3">3 Floors</option>
            <option value="4+">4+ Floors</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facing Direction
          </label>
          <select
            value={formData.propertyOptions.facing}
            onChange={(e) => handlePropertyOptionsChange('facing', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="northeast">Northeast</option>
            <option value="northwest">Northwest</option>
            <option value="southeast">Southeast</option>
            <option value="southwest">Southwest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ready Status
          </label>
          <select
            value={formData.propertyOptions.readyStatus}
            onChange={(e) => handlePropertyOptionsChange('readyStatus', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option value="ready">Ready to Move</option>
            <option value="under_construction">Under Construction</option>
            <option value="renovation">Under Renovation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ownership Type
          </label>
          <select
            value={formData.propertyOptions.ownership}
            onChange={(e) => handlePropertyOptionsChange('ownership', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
            <option value="cooperative">Cooperative</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnishing Status
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['unfurnished', 'semi_furnished', 'fully_furnished'].map((status) => (
            <div
              key={status}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.propertyOptions.furnishing === status
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePropertyOptionsChange('furnishing', status)}
            >
              <div className="text-center">
                <h4 className="font-medium text-gray-900 capitalize">
                  {status.replace('_', ' ')}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
