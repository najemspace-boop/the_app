import { Input } from '../../../components/ui/Input';

const BasicsStep = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <p className="text-gray-600 mb-6">
          Let's start with the basics. What's your property about?
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title *
        </label>
        <Input
          placeholder="e.g., Beautiful Downtown Apartment"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Choose a catchy title that highlights your property's best features
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Type *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.listingType === 'rent'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleChange('listingType', 'rent')}
          >
            <div className="text-center">
              <h4 className="font-medium text-gray-900">For Rent</h4>
              <p className="text-sm text-gray-600 mt-1">
                Rent out your property to tenants
              </p>
            </div>
          </div>
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.listingType === 'sale'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleChange('listingType', 'sale')}
          >
            <div className="text-center">
              <h4 className="font-medium text-gray-900">For Sale</h4>
              <p className="text-sm text-gray-600 mt-1">
                Sell your property to buyers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Category *
        </label>
        <select
          value={formData.propertyCategory}
          onChange={(e) => handleChange('propertyCategory', e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Category
        </label>
        <select
          value={formData.subCategory}
          onChange={(e) => handleChange('subCategory', e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <option value="">Select sub category</option>
          {formData.propertyCategory === 'residential' ? (
            <>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="townhouse">Townhouse</option>
            </>
          ) : (
            <>
              <option value="office">Office</option>
              <option value="retail">Retail</option>
              <option value="warehouse">Warehouse</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          placeholder="Describe your property in detail..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Describe the space, neighborhood, and what makes it special
        </p>
      </div>
    </div>
  );
};

export default BasicsStep;
