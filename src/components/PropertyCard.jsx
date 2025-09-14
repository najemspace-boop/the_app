import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const PropertyCard = ({
  id,
  images = [],
  title,
  location,
  price,
  rating,
  dates,
  isFavorite = false,
  tags = [], // 👈 pass an array of tags
  onFavoriteToggle,
  onClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  const handleCardClick = () => {
    // First try the onClick prop if provided
    if (onClick) {
      onClick(id);
    } else {
      // Otherwise navigate to property detail page
      navigate(`/property/${id}`);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <Card className="cursor-pointer w-full overflow-hidden hover:shadow-lg transition-shadow duration-200" onClick={handleCardClick}>
      {/* Photo */}
      <div className="relative mb-3">
        {images.length > 0 && (
          <img
            src={images[currentImageIndex]}
            alt={title}
            className={`w-full aspect-[4/3] object-cover rounded-xl ${
              isImageLoading ? "opacity-50" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        )}

        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-xl"></div>
        )}

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white ${
            isFavorite ? "text-red-500" : "text-gray-700"
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`w-6 h-6 drop-shadow-md ${
              isFavorite ? "fill-red-500" : ""
            }`}
          />
        </Button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white text-gray-700 rounded-full"
              onClick={prevImage}
            >
              <span className="text-lg">‹</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white text-gray-700 rounded-full"
              onClick={nextImage}
            >
              <span className="text-lg">›</span>
            </Button>
          </>
        )}

        {/* Tags / Badges */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 rounded-md text-xs font-medium shadow-sm
                  ${
                    tag.type === "highlight"
                      ? "bg-pink-600 text-white"
                      : tag.type === "info"
                      ? "bg-blue-600 text-white"
                      : tag.type === "success"
                      ? "bg-green-600 text-white"
                      : tag.type === "warning"
                      ? "bg-yellow-400 text-black"
                      : "bg-black/70 text-white"
                  }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
        {/* Left side */}
        <div>
          <h3 className="font-medium text-card-foreground text-sm mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{location}</p>
          <p className="text-muted-foreground text-sm">{dates}</p>
          <div className="mt-1">
            <span className="font-semibold text-card-foreground">${price}</span>
            <span className="text-muted-foreground"> night</span>
          </div>
        </div>

        {/* Right side */}
        <div className="text-right">
          {rating && (
            <div className="flex items-center text-sm mb-1">
              <span className="mr-1">⭐</span>
              <span>{rating}</span>
            </div>
          )}
        </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
