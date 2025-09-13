import { Input } from '../../../components/ui/Input';

const PoliciesStep = ({ formData, updateFormData }) => {
  const handlePoliciesChange = (field, value) => {
    updateFormData({
      policies: {
        ...formData.policies,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies & Rules</h3>
        <p className="text-gray-600 mb-6">
          Set clear expectations for guests by defining your property rules and policies.
        </p>
      </div>

      {/* House Rules */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          House Rules
        </label>
        <textarea
          placeholder="e.g., No smoking, No parties, Quiet hours after 10 PM..."
          value={formData.policies?.rules || ''}
          onChange={(e) => handlePoliciesChange('rules', e.target.value)}
          rows={4}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          List important rules guests should follow during their stay
        </p>
      </div>

      {/* Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Restrictions & Limitations
        </label>
        <textarea
          placeholder="e.g., Maximum 4 guests, No pets allowed, Adults only..."
          value={formData.policies?.restrictions || ''}
          onChange={(e) => handlePoliciesChange('restrictions', e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Specify any restrictions or limitations for bookings
        </p>
      </div>

      {/* Cancellation Policy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cancellation Policy
        </label>
        <div className="space-y-3">
          {[
            {
              value: 'flexible',
              title: 'Flexible',
              description: 'Full refund 1 day prior to arrival'
            },
            {
              value: 'moderate',
              title: 'Moderate',
              description: 'Full refund 5 days prior to arrival'
            },
            {
              value: 'strict',
              title: 'Strict',
              description: '50% refund up until 1 week prior to arrival'
            },
            {
              value: 'super_strict',
              title: 'Super Strict',
              description: '50% refund up until 30 days prior to arrival'
            }
          ].map((policy) => (
            <div
              key={policy.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.policies?.cancellationPolicy === policy.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePoliciesChange('cancellationPolicy', policy.value)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                  formData.policies?.cancellationPolicy === policy.value
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {formData.policies?.cancellationPolicy === policy.value && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{policy.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Check-in/Check-out Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-in Instructions
        </label>
        <textarea
          placeholder="Provide detailed check-in instructions, key location, contact info..."
          value={formData.checkInInstructions || ''}
          onChange={(e) => updateFormData({ checkInInstructions: e.target.value })}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Help guests know how to access your property
        </p>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes for Guests
        </label>
        <textarea
          placeholder="Any other important information guests should know..."
          value={formData.additionalNotes || ''}
          onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        />
      </div>

      {/* Policy Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">Policy Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be clear and specific about your rules</li>
          <li>• Consider your neighborhood and property type</li>
          <li>• Flexible policies often attract more bookings</li>
          <li>• Include emergency contact information</li>
        </ul>
      </div>
    </div>
  );
};

export default PoliciesStep;
