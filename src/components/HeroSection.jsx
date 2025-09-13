import React, { useEffect, useState } from "react";
import { CAROUSEL_IMAGES } from "../lib/carousel-images";
import SearchBar from "./SearchBar";
import { cn } from "../lib/utils";

/** === Config/constants === */
const LOCATIONS = [
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Sharjah, UAE",
  "Ajman, UAE",
  "Homs, SY",
  "Aleppo, SY",
  "Damascus, SY",
  "Hama, SY",
  "New York, USA",
  "Los Angeles, USA",
  "Miami, USA",
  "San Francisco, USA",
];

/** Rent filter options */
const RENT_PRICE = [
  { label: "≤ 200 / night", value: "0-200" },
  { label: "200 – 400", value: "200-400" },
  { label: "400 – 800", value: "400-800" },
  { label: "≥ 800", value: "800-" },
];

const RENT_TYPES = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Room", value: "room" },
  { label: "Motel Room", value: "motel_room" },
  { label: "Hotel Room", value: "hotel_room" },
  { label: "Ballroom", value: "ballroom" },
  { label: "Farm", value: "farm" },
  { label: "Traditional House", value: "traditional_house" },
];

/** Sale filter options */
const SALE_PRICE = [
  { label: "≤ 500k", value: "0-500000" },
  { label: "500k – 1M", value: "500000-1000000" },
  { label: "1M – 2M", value: "1000000-2000000" },
  { label: "≥ 2M", value: "2000000-" },
];

const SALE_RESIDENTIAL = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Farm", value: "farm" },
  { label: "Building", value: "building" },
  { label: "Land", value: "residential_land" },
  { label: "Off-Plan", value: "offplan" },
  { label: "Townhouse", value: "townhouse" },
  { label: "Penthouse", value: "penthouse" },
];

const SALE_COMMERCIAL = [
  { label: "Office", value: "office" },
  { label: "Shop", value: "shop" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Showroom", value: "showroom" },
  { label: "Commercial Land", value: "commercial_land" },
  { label: "Factory", value: "factory" },
  { label: "Farm", value: "farm" },
  { label: "Workshop", value: "workshop" },
];

const AREA_SQFT = [
  { label: "≤ 500", value: "0-500" },
  { label: "500 – 1000", value: "500-1000" },
  { label: "1000 – 2000", value: "1000-2000" },
  { label: "≥ 2000", value: "2000-" },
];

// SaleMainCat can be "residential" | "commercial"

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-0 px-2">
      <section className="relative flex items-center justify-center rounded-xl h-[500px] flex-col overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={image}
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 rounded-[20px] w-full h-full",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundAttachment: 'scroll'
            }}
          />
        ))}
        <div className="absolute inset-x-0 top-0 bottom-[30%] bg-black/40" />
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {CAROUSEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentImageIndex
                ? "bg-white shadow-lg scale-110"
                : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>

      {/* Foreground content with SearchBar */}
      <div className="relative z-10 w-full px-6">
        <div className="max-w-6xl mx-auto">
          <SearchBar />
        </div>
      </div>
      </section>
    </div>
  );
}