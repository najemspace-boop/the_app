import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
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
        <p className="text-sm text-muted-foreground">
          Set competitive pricing and manage your property's availability calendar.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Base Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Base Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price per Night *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="basePrice"
                    type="number"
                    min="1"
                    value={formData.basePrice || ''}
                    onChange={(e) => updateField('basePrice', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="weekendPrice">Weekend Price per Night</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={calculateWeekendPrice}
                    disabled={!formData.basePrice}
                  >
                    Suggest +20%
                  </Button>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="weekendPrice"
                    type="number"
                    min="1"
                    value={formData.weekendPrice || ''}
                    onChange={(e) => updateField('weekendPrice', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discounts */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Length of Stay Discounts</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
                <Input
                  id="weeklyDiscount"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.weeklyDiscount || ''}
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
                  value={formData.monthlyDiscount || ''}
                  onChange={(e) => updateField('monthlyDiscount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Additional Fees */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Additional Fees</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cleaningFee">Cleaning Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cleaningFee"
                    type="number"
                    min="0"
                    value={formData.cleaningFee || ''}
                    onChange={(e) => updateField('cleaningFee', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceFee">Service Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="serviceFee"
                    type="number"
                    min="0"
                    value={formData.serviceFee || ''}
                    onChange={(e) => updateField('serviceFee', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0"
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
                    value={formData.securityDeposit || ''}
                    onChange={(e) => updateField('securityDeposit', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Smart Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <p className="font-medium">Smart Pricing</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically adjust prices based on demand, local events, and market conditions
                </p>
              </div>
              <Switch
                checked={formData.smartPricing}
                onCheckedChange={(checked) => updateField('smartPricing', checked)}
              />
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Availability Calendar
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {showCalendar ? 'Hide' : 'Show'} Calendar
              </Button>
            </div>

            {showCalendar && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4" />
                    <p className="text-sm font-medium">Calendar Instructions</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click on dates to block/unblock them. Blocked dates will not be available for booking.
                  </p>
                  {formData.blockedDates.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Blocked Dates:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.blockedDates.slice(0, 5).map((date, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
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

                <Calendar
                  mode="multiple"
                  selected={formData.blockedDates}
                  onSelect={(dates) => updateField('blockedDates', dates || [])}
                  className={cn("rounded-md border p-3 pointer-events-auto")}
                  disabled={(date) => date < new Date()}
                />
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          {formData.basePrice > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Pricing Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base price per night:</span>
                  <span className="font-medium">${formData.basePrice}</span>
                </div>
                {formData.weekendPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Weekend price per night:</span>
                    <span className="font-medium">${formData.weekendPrice}</span>
                  </div>
                )}
                {formData.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span>Cleaning fee:</span>
                    <span className="font-medium">${formData.cleaningFee}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total for 3 nights (example):</span>
                    <span>${(formData.basePrice * 3) + (formData.cleaningFee || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit"
              disabled={!formData.basePrice || formData.basePrice <= 0}
            >
              Next: Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepPricingAvailability;