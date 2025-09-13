import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Clock, Shield, Ban, Users, X } from "lucide-react";

const StepPolicies = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    checkInTime: data.checkInTime || '',
    checkOutTime: data.checkOutTime || '',
    minimumStay: data.minimumStay || 1,
    maximumStay: data.maximumStay || null,
    cancellationPolicy: data.cancellationPolicy || '',
    houseRules: data.houseRules || [],
    additionalRules: data.additionalRules || '',
    smokingAllowed: data.smokingAllowed || false,
    petsAllowed: data.petsAllowed || false,
    partiesAllowed: data.partiesAllowed || false,
  });

  const [newRule, setNewRule] = useState('');

  const cancellationPolicies = [
    { value: 'flexible', label: 'Flexible - Full refund 1 day prior to arrival' },
    { value: 'moderate', label: 'Moderate - Full refund 5 days prior to arrival' },
    { value: 'strict', label: 'Strict - 50% refund up until 1 week prior to arrival' },
    { value: 'super_strict', label: 'Super Strict - 50% refund up until 30 days prior' },
  ];

  const commonRules = [
    'No smoking inside',
    'No pets allowed',
    'No parties or events',
    'Quiet hours: 10 PM - 7 AM',
    'Maximum occupancy as listed',
    'No unregistered guests',
    'Check-out by 11 AM',
    'Respect neighbors',
  ];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHouseRule = () => {
    if (newRule.trim() && !formData.houseRules.includes(newRule.trim())) {
      setFormData(prev => ({
        ...prev,
        houseRules: [...prev.houseRules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeHouseRule = (ruleToRemove) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules.filter(rule => rule !== ruleToRemove)
    }));
  };

  const toggleCommonRule = (rule) => {
    if (formData.houseRules.includes(rule)) {
      removeHouseRule(rule);
    } else {
      setFormData(prev => ({
        ...prev,
        houseRules: [...prev.houseRules, rule]
      }));
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
          <Shield className="h-5 w-5" />
          Property Policies
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set clear expectations for your guests with check-in times, house rules, and cancellation policies.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Check-in/Check-out Times */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Check-in & Check-out
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time *</Label>
                <Select value={formData.checkInTime} onValueChange={(value) => updateField('checkInTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select check-in time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out Time *</Label>
                <Select value={formData.checkOutTime} onValueChange={(value) => updateField('checkOutTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select check-out time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stay Duration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Duration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumStay">Minimum Stay (nights) *</Label>
                <Input
                  id="minimumStay"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.minimumStay}
                  onChange={(e) => updateField('minimumStay', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maximumStay">Maximum Stay (nights)</Label>
                <Input
                  id="maximumStay"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.maximumStay || ''}
                  onChange={(e) => updateField('maximumStay', parseInt(e.target.value) || null)}
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Cancellation Policy</h3>
            <Select value={formData.cancellationPolicy} onValueChange={(value) => updateField('cancellationPolicy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cancellation policy" />
              </SelectTrigger>
              <SelectContent>
                {cancellationPolicies.map((policy) => (
                  <SelectItem key={policy.value} value={policy.value}>
                    {policy.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Rules Toggles */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Ban className="h-5 w-5" />
              Property Rules
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Smoking Allowed</p>
                  <p className="text-sm text-muted-foreground">Allow smoking inside the property</p>
                </div>
                <Switch
                  checked={formData.smokingAllowed}
                  onCheckedChange={(checked) => updateField('smokingAllowed', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Pets Allowed</p>
                  <p className="text-sm text-muted-foreground">Allow guests to bring pets</p>
                </div>
                <Switch
                  checked={formData.petsAllowed}
                  onCheckedChange={(checked) => updateField('petsAllowed', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Parties/Events Allowed</p>
                  <p className="text-sm text-muted-foreground">Allow parties and events</p>
                </div>
                <Switch
                  checked={formData.partiesAllowed}
                  onCheckedChange={(checked) => updateField('partiesAllowed', checked)}
                />
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              House Rules
            </h3>
            
            {/* Common Rules */}
            <div>
              <p className="text-sm font-medium mb-3">Common Rules (click to add):</p>
              <div className="flex flex-wrap gap-2">
                {commonRules.map((rule) => (
                  <Badge
                    key={rule}
                    variant={formData.houseRules.includes(rule) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCommonRule(rule)}
                  >
                    {rule}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Rule Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom house rule..."
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHouseRule())}
              />
              <Button type="button" onClick={addHouseRule} disabled={!newRule.trim()}>
                Add
              </Button>
            </div>

            {/* Selected Rules */}
            {formData.houseRules.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected House Rules:</p>
                <div className="space-y-2">
                  {formData.houseRules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm">{rule}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHouseRule(rule)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Rules */}
          <div className="space-y-2">
            <Label htmlFor="additionalRules">Additional Rules & Information</Label>
            <Textarea
              id="additionalRules"
              value={formData.additionalRules}
              onChange={(e) => updateField('additionalRules', e.target.value)}
              placeholder="Any additional rules, guidelines, or important information for guests..."
              rows={3}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit"
              disabled={!formData.checkInTime || !formData.checkOutTime || !formData.cancellationPolicy}
            >
              Next: Pricing
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepPolicies;