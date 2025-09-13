import React, { useEffect, useState } from "react";
import { CAROUSEL_IMAGES } from "../lib/carousel-images";
import LuxurySearchBar from "./LuxurySearchBar";
import { cn } from "../lib/utils";

export function LuxuryHeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="luxury-hero">
      {/* Background carousel with luxury overlay */}
      <div className="absolute inset-0">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={image}
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
          />
        ))}
        
        {/* Luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/30 via-transparent to-luxury-navy/30" />
      </div>

      {/* Luxury content */}
      <div className="luxury-hero-content">
        <h1 className="luxury-hero-title">
          Discover Extraordinary Properties
        </h1>
        <p className="luxury-hero-subtitle luxury-accent">
          Where luxury meets lifestyle in the world's most prestigious locations
        </p>
        
        {/* Luxury Search Bar */}
        <div className="mt-12">
          <LuxurySearchBar />
        </div>
      </div>

      {/* Elegant carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {CAROUSEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-500 border border-white/50",
              index === currentImageIndex
                ? "bg-luxury-gold shadow-luxury-gold scale-125"
                : "bg-white/30 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}