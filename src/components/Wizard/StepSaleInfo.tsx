import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Tag, 
  TrendingUp, 
  Target, 
  Calendar,
  Users,
  Star
} from "lucide-react";

interface StepSaleInfoProps {
  data: {
    instantBooking?: boolean;
    minimumRating?: number;
    requireGuestReviews?: boolean;
    maxGuestsPerReservation?: number;
    targetAudience?: string[];
    seasonalPricing?: boolean;
    promotionalOffers?: string[];
    responseTime?: string;
    languages?: string[];
    keywordTags?: string[];
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const StepSaleInfo = ({ data, onNext, onBack }: StepSaleInfoProps) => {
  const [formData, setFormData] = useState({
    instantBooking: data.instantBooking || false,
    minimumRating: data.minimumRating || 0,
    requireGuestReviews: data.requireGuestReviews || false,
    maxGuestsPerReservation: data.maxGuestsPerReservation || null,
    targetAudience: data.targetAudience || [],
    seasonalPricing: data.seasonalPricing || false,
    promotionalOffers: data.promotionalOffers || [],
    responseTime: data.responseTime || '',
    languages: data.languages || [],
    keywordTags: data.keywordTags || [],
  });

  const [newTag, setNewTag] = useState('');

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (fieldName: keyof typeof formData, item: string) => {
    const currentArray = formData[fieldName] as string[];
    if (currentArray.includes(item)) {
      updateField(fieldName, currentArray.filter(i => i !== item));
    } else {
      updateField(fieldName, [...currentArray, item]);
    }
  };

  const addKeywordTag = () => {
    if (newTag.trim() && !formData.keywordTags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        keywordTags: [...prev.keywordTags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywordTags: prev.keywordTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const targetAudienceOptions = [
    'Business travelers',
    'Families with children',
    'Couples',
    'Solo travelers',
    'Groups/Friends',
    'Digital nomads',
    'Students',
    'Seniors',
    'Pet owners',
    'Budget travelers',
    'Luxury seekers'
  ];

  const promotionalOfferOptions = [
    'Early bird discount',
    'Last minute deals',
    'Extended stay discount',
    'First-time guest discount',
    'Repeat guest discount',
    'Seasonal promotion',
    'Group booking discount',
    'Mid-week special'
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Russian',
    'Arabic',
    'Dutch'
  ];

  const responseTimeOptions = [
    { value: 'within_hour', label: 'Within an hour' },
    { value: 'within_few_hours', label: 'Within a few hours' },
    { value: 'within_day', label: 'Within a day' },
    { value: 'within_few_days', label: 'Within a few days' }
  ];

  const suggestedTags = [
    'modern', 'cozy', 'luxury', 'budget-friendly', 'downtown', 
    'quiet', 'family-friendly', 'romantic', 'business', 'vacation',
    'beachside', 'mountain', 'urban', 'countryside', 'historic'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Marketing & Booking Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure how guests can book your property and target your ideal audience.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Booking Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Booking Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Instant Booking</p>
                  <p className="text-sm text-muted-foreground">
                    Allow guests to book immediately without approval
                  </p>
                </div>
                <Switch
                  checked={formData.instantBooking}
                  onCheckedChange={(checked) => updateField('instantBooking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Require Guest Reviews</p>
                  <p className="text-sm text-muted-foreground">
                    Only accept guests with positive reviews
                  </p>
                </div>
                <Switch
                  checked={formData.requireGuestReviews}
                  onCheckedChange={(checked) => updateField('requireGuestReviews', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Seasonal Pricing</p>
                  <p className="text-sm text-muted-foreground">
                    Enable seasonal pricing adjustments
                  </p>
                </div>
                <Switch
                  checked={formData.seasonalPricing}
                  onCheckedChange={(checked) => updateField('seasonalPricing', checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumRating">Minimum Guest Rating</Label>
                <Select 
                  value={formData.minimumRating.toString()} 
                  onValueChange={(value) => updateField('minimumRating', parseFloat(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No minimum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No minimum</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responseTime">Response Time</Label>
                <Select 
                  value={formData.responseTime} 
                  onValueChange={(value) => updateField('responseTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response time" />
                  </SelectTrigger>
                  <SelectContent>
                    {responseTimeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Target Audience
            </h3>
            <p className="text-sm text-muted-foreground">
              Select the types of guests your property is best suited for.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {targetAudienceOptions.map((audience) => (
                <Badge
                  key={audience}
                  variant={formData.targetAudience.includes(audience) ? "default" : "outline"}
                  className="cursor-pointer justify-center p-2"
                  onClick={() => toggleArrayItem('targetAudience', audience)}
                >
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          {/* Promotional Offers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Promotional Offers
            </h3>
            <p className="text-sm text-muted-foreground">
              Select promotional strategies you're willing to offer.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {promotionalOfferOptions.map((offer) => (
                <Badge
                  key={offer}
                  variant={formData.promotionalOffers.includes(offer) ? "default" : "outline"}
                  className="cursor-pointer justify-center p-2"
                  onClick={() => toggleArrayItem('promotionalOffers', offer)}
                >
                  {offer}
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Languages Spoken</h3>
            <p className="text-sm text-muted-foreground">
              Select languages you can communicate in with guests.
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {languageOptions.map((language) => (
                <Badge
                  key={language}
                  variant={formData.languages.includes(language) ? "default" : "outline"}
                  className="cursor-pointer justify-center p-2"
                  onClick={() => toggleArrayItem('languages', language)}
                >
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          {/* Keyword Tags */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Search Keywords</h3>
            <p className="text-sm text-muted-foreground">
              Add keywords that describe your property to help guests find it.
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a keyword tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeywordTag())}
              />
              <Button type="button" onClick={addKeywordTag} disabled={!newTag.trim()}>
                Add
              </Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Suggested keywords (click to add):</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formData.keywordTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (formData.keywordTags.includes(tag)) {
                        removeTag(tag);
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          keywordTags: [...prev.keywordTags, tag]
                        }));
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {formData.keywordTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Your keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.keywordTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Next: Preview
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepSaleInfo;