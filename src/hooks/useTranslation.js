import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    searchPlaceholder: "Where are you going?",
    searchButton: "Search",
    forSale: "For Sale",
    forRent: "For Rent",
    propertyType: "Property Type",
    subCategory: "Sub Category",
    residential: "Residential",
    commercial: "Commercial",
    flat: "Flat",
    villa: "Villa",
    room: "Room",
    office: "Office",
    shop: "Shop",
    warehouse: "Warehouse"
  },
  ar: {
    searchPlaceholder: "أين تريد أن تذهب؟",
    searchButton: "بحث",
    forSale: "للبيع",
    forRent: "للإيجار",
    propertyType: "نوع العقار",
    subCategory: "الفئة الفرعية",
    residential: "سكني",
    commercial: "تجاري",
    flat: "شقة",
    villa: "فيلا",
    room: "غرفة",
    office: "مكتب",
    shop: "محل",
    warehouse: "مستودع"
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return { t };
};
