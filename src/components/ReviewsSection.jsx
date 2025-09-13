import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/Badge";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const ReviewsSection = ({ property }) => {
  const { language } = useLanguage();
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  const translations = {
    en: {
      reviews: "Reviews",
      overallRating: "Overall Rating",
      basedOnReviews: "Based on {count} reviews",
      writeReview: "Write a Review",
      yourRating: "Your Rating",
      yourReview: "Your Review",
      shareExperience: "Share your experience with this property...",
      submitReview: "Submit Review",
      verified: "Verified",
      memberSince: "Member since {year}",
      helpful: "Helpful ({count})",
      report: "Report",
      loadMoreReviews: "Load More Reviews",
      showLess: "Show Less",
      showAll: "Show All {count} Reviews"
    },
    ar: {
      reviews: "التقييمات",
      overallRating: "التقييم العام",
      basedOnReviews: "بناءً على {count} تقييم",
      writeReview: "كتابة تقييم",
      yourRating: "تقييمك",
      yourReview: "تقييمك",
      shareExperience: "شاركنا تجربتك مع هذا العقار...",
      submitReview: "إرسال التقييم",
      verified: "موثق",
      memberSince: "عضو منذ {year}",
      helpful: "مفيد ({count})",
      report: "إبلاغ",
      loadMoreReviews: "تحميل المزيد من التقييمات",
      showLess: "عرض أقل",
      showAll: "عرض جميع {count} التقييمات"
    }
  };

  const t = translations[language] || translations.en;

  // Mock data - in real app, this would come from props or API
  const mockProperty = property || {
    id: "1",
    title: "Luxury Modern Villa with Pool",
    averageRating: 4.8,
    totalReviews: 24
  };

  const ratingDistribution = [
    { stars: 5, count: 15, percentage: 62 },
    { stars: 4, count: 6, percentage: 25 },
    { stars: 3, count: 2, percentage: 8 },
    { stars: 2, count: 1, percentage: 4 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const reviews = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
        joinedDate: "2023"
      },
      rating: 5,
      date: "2024-01-15",
      content: "Amazing property! The villa exceeded all our expectations. Clean, modern, and the owner was incredibly responsive. The pool area is beautiful and the location is perfect for accessing downtown. Highly recommend!",
      helpful: 12,
      verified: true
    },
    {
      id: "2", 
      user: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        joinedDate: "2022"
      },
      rating: 4,
      date: "2024-01-10",
      content: "Great stay overall. The property is exactly as described and very well maintained. Only minor issue was the WiFi speed could be better for remote work, but everything else was perfect.",
      helpful: 8,
      verified: true
    },
    {
      id: "3",
      user: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", 
        joinedDate: "2023"
      },
      rating: 5,
      date: "2024-01-05",
      content: "Fantastic experience! The villa is stunning and the amenities are top-notch. Ahmad was an excellent host - very professional and accommodating. We'll definitely be back!",
      helpful: 15,
      verified: true
    }
  ];

  const StarRating = ({ rating, interactive = false, onRatingChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Reviews Overview */}
      <div className="lg:col-span-1">
        <Card className="glass-card sticky top-4">
          <CardHeader>
            <CardTitle>{t.overallRating}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{mockProperty.averageRating}</div>
              <StarRating rating={Math.round(mockProperty.averageRating)} />
              <p className="text-sm text-muted-foreground mt-2">
                {t.basedOnReviews.replace('{count}', mockProperty.totalReviews)}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="text-sm">{stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground min-w-[30px]">
                    {count}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Review Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full premium-gradient">
                  {t.writeReview}
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle>{t.writeReview}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t.yourRating}</label>
                    <StarRating 
                      rating={rating} 
                      interactive={true} 
                      onRatingChange={setRating}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t.yourReview}</label>
                    <Textarea
                      placeholder={t.shareExperience}
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      rows={4}
                      className="glass-input"
                    />
                  </div>
                  <Button className="w-full premium-gradient">
                    {t.submitReview}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} />
                    <AvatarFallback>
                      {review.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{review.user.name}</h3>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          {t.verified}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {t.memberSince.replace('{year}', review.user.joinedDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {review.content}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {t.helpful.replace('{count}', review.helpful)}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {t.report}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="glass">
            {t.loadMoreReviews}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
