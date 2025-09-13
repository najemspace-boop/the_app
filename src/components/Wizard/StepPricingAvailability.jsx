import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Switch } from "../ui/switch";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/Badge";
import { 
  DollarSign, 
  Calendar as CalendarIcon, 
  TrendingUp,
  Info
} from "lucide-react";
import { cn } from "../../lib/utils";

const StepPricingAvailability = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    basePrice: data.basePrice || 0,
    weekendPrice: data.weekendPrice || 0,
    monthlyDiscount: data.monthlyDiscount || 0,
    weeklyDiscount: data.weeklyDiscount || 0,
    cleaningFee: data.cleaningFee || 0,
    serviceFee: data.serviceFee || 0,
    securityDeposit: data.securityDeposit || 0,
    smartPricing: data.smartPricing || false,
    availableFrom: data.availableFrom || new Date(),
    availableTo: data.availableTo || null,
    blockedDates: data.blockedDates || [],
  });

  const [showCalendar, setShowCalendar] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date) => {
    if (date) {
      const isBlocked = formData.blockedDates.some(
        blockedDate => blockedDate.toDateString() === date.toDateString()
      );
      
      if (isBlocked) {
        // Remove from blocked dates
        setFormData(prev => ({
          ...prev,
          blockedDates: prev.blockedDates.filter(
            blockedDate => blockedDate.toDateString() !== date.toDateString()
          )
        }));
      } else {
        // Add to blocked dates
        setFormData(prev => ({
          ...prev,
          blockedDates: [...prev.blockedDates, date]
        }));
      }
    }
  };

  const calculateWeekendPrice = () => {
    if (formData.basePrice > 0) {
      const suggestedWeekendPrice = Math.round(formData.basePrice * 1.2);
      updateField('weekendPrice', suggestedWeekendPrice);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing & Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Base Pricing */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Base Pricing
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price per Night *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => updateField('basePrice', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="weekendPrice">Weekend Price</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={calculateWeekendPrice}
                    className="h-6 px-2 text-xs"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +20%
                  </Button>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="weekendPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.weekendPrice}
                    onChange={(e) => updateField('weekendPrice', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discounts */}
          <div className="space-y-4">
            <h3 className="font-medium">Long-stay Discounts</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
                <Input
                  id="weeklyDiscount"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.weeklyDiscount}
                  onChange={(e) => updateField('weeklyDiscount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyDiscount">Monthly Discount (%)</Label>
                <Input
                  id="monthlyDiscount"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.monthlyDiscount}
                  onChange={(e) => updateField('monthlyDiscount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Additional Fees */}
          <div className="space-y-4">
            <h3 className="font-medium">Additional Fees</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cleaningFee">Cleaning Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cleaningFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cleaningFee}
                    onChange={(e) => updateField('cleaningFee', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="securityDeposit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.securityDeposit}
                    onChange={(e) => updateField('securityDeposit', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Smart Pricing */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="smartPricing" className="font-medium">Smart Pricing</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust prices based on demand and local events
              </p>
            </div>
            <Switch
              id="smartPricing"
              checked={formData.smartPricing}
              onCheckedChange={(checked) => updateField('smartPricing', checked)}
            />
          </div>

          {/* Availability Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Availability Calendar
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {showCalendar ? 'Hide' : 'Show'} Calendar
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom ? formData.availableFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => updateField('availableFrom', new Date(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availableTo">Available Until (Optional)</Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={formData.availableTo ? formData.availableTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => updateField('availableTo', e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
            </div>

            {showCalendar && (
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Click on dates to block them from booking
                </p>
                <Calendar
                  mode="multiple"
                  selected={formData.blockedDates}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
                {formData.blockedDates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Blocked Dates ({formData.blockedDates.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.blockedDates.slice(0, 5).map((date, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {date.toLocaleDateString()}
                        </Badge>
                      ))}
                      {formData.blockedDates.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{formData.blockedDates.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          {formData.basePrice > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-3">Pricing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base price per night:</span>
                  <span>${formData.basePrice}</span>
                </div>
                {formData.weekendPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Weekend price:</span>
                    <span>${formData.weekendPrice}</span>
                  </div>
                )}
                {formData.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span>Cleaning fee:</span>
                    <span>${formData.cleaningFee}</span>
                  </div>
                )}
                {formData.securityDeposit > 0 && (
                  <div className="flex justify-between">
                    <span>Security deposit:</span>
                    <span>${formData.securityDeposit}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={formData.basePrice <= 0}>
              Next: Policies
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepPricingAvailability;
