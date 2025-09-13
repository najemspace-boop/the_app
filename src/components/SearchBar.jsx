import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

const SearchBar = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [listingType, setListingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const handleListingTypeChange = (value) => {
    setListingType(value);
    setPropertyType("");
    setSubCategory("");
  };

  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
    setSubCategory("");
  };

  const getSubCategories = () => {
    if (!listingType || !propertyType) return [];

    if (listingType === "sale") {
      if (propertyType === "residential") {
        return [
          { value: "flat", label: "Flat" },
          { value: "villa", label: "Villa" },
          { value: "farm", label: "Farm" },
          { value: "folklore_house", label: "Folklore House" },
          { value: "other", label: "Other" },
        ];
      } else if (propertyType === "commercial") {
        return [
          { value: "office", label: "Office" },
          { value: "shop", label: "Shop" },
          { value: "warehouse", label: "Warehouse" },
          { value: "showroom", label: "Showroom" },
          { value: "factory", label: "Factory" },
          { value: "commercial_land", label: "Land" },
          { value: "workshop", label: "Workshop" },
          { value: "other", label: "Other" },
        ];
      }
    } else if (listingType === "rent") {
      if (propertyType === "residential") {
        return [
          { value: "flat", label: "Flat" },
          { value: "villa", label: "Villa" },
          { value: "room", label: "Room" },
          { value: "motel_room", label: "Motel" },
          { value: "farm", label: "Farm" },
          { value: "hotel_room", label: "Hotel" },
          { value: "folklore_house", label: "Folklore" },
          { value: "ballroom", label: "Ballroom" },
          { value: "other", label: "Other" },
        ];
      } else if (propertyType === "commercial") {
        return [
          { value: "office", label: "Office" },
          { value: "shop", label: "Shop" },
          { value: "warehouse", label: "Warehouse" },
          { value: "showroom", label: "Showroom" },
          { value: "workshop", label: "Workshop" },
          { value: "other", label: "Other" },
        ];
      }
    }

    return [];
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (location) searchParams.set("location", location);
    if (propertyType) searchParams.set("propertyType", propertyType);
    if (listingType) searchParams.set("listingType", listingType);
    if (subCategory) searchParams.set("subCategory", subCategory);

    const url = location
      ? `/map-search?${searchParams.toString()}`
      : `/search?${searchParams.toString()}`;
    navigate(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-8 relative z-10">
      {/* Clay-style surface */}
      <div
        className="
          glass-card
          p-4 md:p-5
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
          {/* For Sale/Rent */}
          <Select value={listingType} onValueChange={handleListingTypeChange}>
            <SelectTrigger className="glass-input rounded-2xl">
              <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                <DollarSign className={`h-4 w-4 text-gray-500 ${isRTL ? "ml-2" : "mr-2"}`} />
                <SelectValue placeholder="For Sale/Rent" />
              </div>
            </SelectTrigger>
            <SelectContent className="glass-strong">
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>

          {/* Property Type */}
          <Select
            value={propertyType}
            onValueChange={handlePropertyTypeChange}
            disabled={!listingType}
          >
            <SelectTrigger className="glass-input rounded-2xl disabled:opacity-60">
              <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                <Home className={`h-4 w-4 text-gray-500 ${isRTL ? "ml-2" : "mr-2"}`} />
                <SelectValue placeholder="Property Type" />
              </div>
            </SelectTrigger>
            <SelectContent className="glass-strong">
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>

          {/* Subcategory */}
          {listingType && propertyType && getSubCategories().length > 0 && (
            <Select value={subCategory} onValueChange={setSubCategory}>
              <SelectTrigger className="glass-input rounded-2xl">
                <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Home className={`h-4 w-4 text-gray-500 ${isRTL ? "ml-2" : "mr-2"}`} />
                  <SelectValue placeholder="Sub Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="glass-strong">
                {getSubCategories().map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Location */}
          <div className="relative">
            <MapPin
              className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <Input
              placeholder={t("searchPlaceholder")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`glass-input rounded-2xl ${isRTL ? "pr-10 text-right" : "pl-10"}`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className={`glass-button w-full rounded-2xl h-[44px] md:h-auto ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Search className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t("searchButton")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
