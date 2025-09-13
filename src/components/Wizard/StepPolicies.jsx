import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/Badge";
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Check-in/Check-out Times */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Check-in & Check-out
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => updateField('checkInTime', e.target.value)}
                  placeholder="15:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => updateField('checkOutTime', e.target.value)}
                  placeholder="11:00"
                />
              </div>
            </div>
          </div>

          {/* Stay Duration */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Stay Duration
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumStay">Minimum Stay (nights)</Label>
                <Input
                  id="minimumStay"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.minimumStay}
                  onChange={(e) => updateField('minimumStay', parseInt(e.target.value) || 1)}
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
                  onChange={(e) => updateField('maximumStay', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="space-y-2">
            <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
            <Select value={formData.cancellationPolicy} onValueChange={(value) => updateField('cancellationPolicy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cancellation policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible - Full refund 1 day before arrival</SelectItem>
                <SelectItem value="moderate">Moderate - Full refund 5 days before arrival</SelectItem>
                <SelectItem value="strict">Strict - 50% refund up to 1 week before arrival</SelectItem>
                <SelectItem value="super_strict_30">Super Strict 30 - 50% refund up to 30 days before</SelectItem>
                <SelectItem value="super_strict_60">Super Strict 60 - 50% refund up to 60 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Policies */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Property Policies
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="smokingAllowed" className="font-medium">Smoking Allowed</Label>
                  <p className="text-sm text-muted-foreground">Allow smoking inside the property</p>
                </div>
                <Switch
                  id="smokingAllowed"
                  checked={formData.smokingAllowed}
                  onCheckedChange={(checked) => updateField('smokingAllowed', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="petsAllowed" className="font-medium">Pets Allowed</Label>
                  <p className="text-sm text-muted-foreground">Allow pets in the property</p>
                </div>
                <Switch
                  id="petsAllowed"
                  checked={formData.petsAllowed}
                  onCheckedChange={(checked) => updateField('petsAllowed', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="partiesAllowed" className="font-medium">Parties/Events Allowed</Label>
                  <p className="text-sm text-muted-foreground">Allow parties and events</p>
                </div>
                <Switch
                  id="partiesAllowed"
                  checked={formData.partiesAllowed}
                  onCheckedChange={(checked) => updateField('partiesAllowed', checked)}
                />
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-4">
            <h3 className="font-medium">House Rules</h3>
            
            {/* Common Rules */}
            <div className="space-y-2">
              <Label>Common Rules (click to add/remove)</Label>
              <div className="flex flex-wrap gap-2">
                {commonRules.map((rule) => (
                  <Button
                    key={rule}
                    type="button"
                    variant={formData.houseRules.includes(rule) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCommonRule(rule)}
                    className="text-xs"
                  >
                    {rule}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Rules */}
            <div className="space-y-2">
              <Label>Add Custom Rule</Label>
              <div className="flex gap-2">
                <Input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Enter a custom house rule"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHouseRule())}
                />
                <Button type="button" onClick={addHouseRule} disabled={!newRule.trim()}>
                  Add
                </Button>
              </div>
            </div>

            {/* Selected Rules */}
            {formData.houseRules.length > 0 && (
              <div className="space-y-2">
                <Label>Selected House Rules ({formData.houseRules.length})</Label>
                <div className="space-y-2">
                  {formData.houseRules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{rule}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHouseRule(rule)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
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
              placeholder="Any additional rules, instructions, or important information for guests..."
              rows={4}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Next: Review & Publish
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepPolicies;
