import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({
  id,
  images = [],
  title,
  location,
  price,
  rating,
  duration = "for 2 nights",
  isFavorite = false,
  isGuestFavorite = false,
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
    if (onClick) {
      onClick(id);
    } else {
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
    <div className="cursor-pointer" onClick={handleCardClick}>
      {/* Photo */}
      <div className="relative mb-3">
        {images.length > 0 && (
          <img
            src={images[currentImageIndex]}
            alt={title}
            className={`w-full aspect-square object-cover rounded-2xl ${
              isImageLoading ? "opacity-50" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        )}

        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-2xl"></div>
        )}

        {/* Guest favorite badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
            Guest favourite
          </div>
        )}

        {/* Favorite Button */}
        <button
          className={`absolute top-3 right-3 ${
            isFavorite ? "text-red-500" : "text-white"
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`w-6 h-6 drop-shadow-md ${
              isFavorite ? "fill-red-500" : ""
            }`}
          />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              ‹
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              ›
            </button>
          </>
        )}

        {/* Image dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-1">
        {/* Title and Rating */}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 text-base leading-tight">
            {title}
          </h3>
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <Star className="w-3 h-3 fill-black text-black" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        {/* Price and Duration */}
        <div className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-900">${price}</span> {duration}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;