import { Input } from '../../../components/ui/Input';

const PricingStep = ({ formData, updateFormData }) => {
  const handlePricingChange = (field, value) => {
    updateFormData({
      pricing: {
        ...formData.pricing,
        [field]: value
      }
    });
  };

  const handleDiscountChange = (field, value) => {
    updateFormData({
      pricing: {
        ...formData.pricing,
        discounts: {
          ...formData.pricing.discounts,
          [field]: value
        }
      }
    });
  };

  const handleAvailabilityChange = (field, value) => {
    updateFormData({
      availability: {
        ...formData.availability,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Availability</h3>
        <p className="text-gray-600 mb-6">
          Set your pricing strategy and availability preferences.
        </p>
      </div>

      {/* Base Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.listingType === 'rent' ? 'Monthly Rent *' : 'Sale Price *'}
        </label>
        <div className="flex">
          <select
            value={formData.pricing?.currency || 'USD'}
            onChange={(e) => handlePricingChange('currency', e.target.value)}
            className="flex h-10 rounded-l-md border border-r-0 border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="USD">USD</option>
            <option value="SYP">SYP</option>
            <option value="EUR">EUR</option>
          </select>
          <Input
            type="number"
            placeholder={formData.listingType === 'rent' ? '1200' : '250000'}
            value={formData.pricing?.basePrice || ''}
            onChange={(e) => handlePricingChange('basePrice', e.target.value)}
            className="rounded-l-none border-l-0"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.listingType === 'rent' 
            ? 'Set your monthly rental price'
            : 'Set your property sale price'
          }
        </p>
      </div>

      {/* Discounts (only for rent) */}
      {formData.listingType === 'rent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Discounts (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Weekly Discount (%)
              </label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={formData.pricing?.discounts?.weekly || ''}
                onChange={(e) => handleDiscountChange('weekly', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">For stays of 7+ nights</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Monthly Discount (%)
              </label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={formData.pricing?.discounts?.monthly || ''}
                onChange={(e) => handleDiscountChange('monthly', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">For stays of 28+ nights</p>
            </div>
          </div>
        </div>
      )}

      {/* Availability Settings (only for rent) */}
      {formData.listingType === 'rent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Availability Settings
          </label>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Available From
              </label>
              <Input
                type="date"
                value={formData.availability?.availableFrom || ''}
                onChange={(e) => handleAvailabilityChange('availableFrom', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Minimum Stay (nights)
                </label>
                <select
                  value={formData.availability?.minimumStay || 1}
                  onChange={(e) => handleAvailabilityChange('minimumStay', parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value={1}>1 night</option>
                  <option value={2}>2 nights</option>
                  <option value={3}>3 nights</option>
                  <option value={7}>1 week</option>
                  <option value={30}>1 month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Maximum Stay (nights)
                </label>
                <select
                  value={formData.availability?.maximumStay || 365}
                  onChange={(e) => handleAvailabilityChange('maximumStay', parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value={7}>1 week</option>
                  <option value={30}>1 month</option>
                  <option value={90}>3 months</option>
                  <option value={180}>6 months</option>
                  <option value={365}>1 year</option>
                  <option value={999}>No limit</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Fees */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Additional Fees (Optional)
        </label>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cleaning Fee
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.cleaningFee || ''}
                onChange={(e) => updateFormData({ cleaningFee: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Security Deposit
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.securityDeposit || ''}
                onChange={(e) => updateFormData({ securityDeposit: e.target.value })}
              />
            </div>
          </div>
          
          {formData.listingType === 'rent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Pet Fee (per stay)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.petFee || ''}
                  onChange={(e) => updateFormData({ petFee: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Extra Guest Fee (per night)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.extraGuestFee || ''}
                  onChange={(e) => updateFormData({ extraGuestFee: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Summary */}
      {formData.pricing?.basePrice && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-3">Pricing Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{formData.listingType === 'rent' ? 'Monthly rent:' : 'Sale price:'}</span>
              <span className="font-medium">
                {formData.pricing.currency} {formData.pricing.basePrice}
              </span>
            </div>
            
            {formData.listingType === 'rent' && (
              <>
                {formData.pricing.discounts?.weekly > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Weekly discount:</span>
                    <span>-{formData.pricing.discounts.weekly}%</span>
                  </div>
                )}
                
                {formData.pricing.discounts?.monthly > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Monthly discount:</span>
                    <span>-{formData.pricing.discounts.monthly}%</span>
                  </div>
                )}
              </>
            )}
            
            {formData.cleaningFee && (
              <div className="flex justify-between">
                <span>Cleaning fee:</span>
                <span>{formData.pricing.currency} {formData.cleaningFee}</span>
              </div>
            )}
            
            {formData.securityDeposit && (
              <div className="flex justify-between">
                <span>Security deposit:</span>
                <span>{formData.pricing.currency} {formData.securityDeposit}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">Pricing Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Research similar properties in your area for competitive pricing</li>
          <li>• Consider seasonal demand when setting prices</li>
          <li>• Discounts can attract longer stays and reduce vacancy</li>
          <li>• Keep additional fees reasonable to avoid deterring guests</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingStep;
