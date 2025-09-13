import { Input } from '../../../components/ui/Input';

const LocationStep = ({ formData, updateFormData }) => {
  const handleLocationChange = (field, value) => {
    updateFormData({
      location: {
        ...formData.location,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
        <p className="text-gray-600 mb-6">
          Where is your property located?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <select
            value={formData.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <option value="">Select city</option>
            <option value="Damascus">Damascus</option>
            <option value="Aleppo">Aleppo</option>
            <option value="Homs">Homs</option>
            <option value="Latakia">Latakia</option>
            <option value="Hama">Hama</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District *
          </label>
          <Input
            placeholder="e.g., Mazzeh, Old City"
            value={formData.location.district}
            onChange={(e) => handleLocationChange('district', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Address
        </label>
        <textarea
          placeholder="Enter the complete address..."
          value={formData.location.address}
          onChange={(e) => handleLocationChange('address', e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          This will help guests find your property easily
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">Location Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose a popular district to attract more guests</li>
          <li>• Mention nearby landmarks or attractions</li>
          <li>• Consider transportation accessibility</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationStep;
