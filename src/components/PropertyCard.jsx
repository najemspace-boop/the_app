import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="cursor-pointer w-full" onClick={handleCardClick}>
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
              onClick={prevImage}
            >
              ‹
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
              onClick={nextImage}
            >
              ›
            </button>
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
      <div className="flex justify-between items-start">
        {/* Left side */}
        <div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">{location}</p>
          <p className="text-gray-500 text-sm">{dates}</p>
          <div className="mt-1">
            <span className="font-semibold text-gray-900">${price}</span>
            <span className="text-gray-500"> night</span>
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
    </div>
  );
};

export default PropertyCard;
