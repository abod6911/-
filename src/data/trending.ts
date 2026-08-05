import {
  distanceKm,
  districts,
  getDistrict,
  places,
  travelMinutes,
  type BudgetLevel,
  type GroupType,
  type Mood,
  type Place,
} from "@/data/jeddah";

export type { BudgetLevel, GroupType, Mood, Place };
export { distanceKm, districts, getDistrict, places, travelMinutes };

export interface TrendingPlace {
  place: Place;
  rank: number;
  badgeAr: string;
  badgeEn: string;
  reasonAr: string;
  reasonEn: string;
  weeklyViews: number;
}

export const getTrendingPlaces = (): TrendingPlace[] => {
  return [
    {
      place: places.find((p) => p.id === "p3") || places[0]!,
      rank: 1,
      badgeAr: "🏛️ ترند #1 التراث والثقافة",
      badgeEn: "#1 Heritage Trend",
      reasonAr: "البلد التاريخية ومتحف بيت ناصيف الأكثر زيارة وتصويراً في جدة هذا الأسبوع.",
      reasonEn: "UNESCO Historic Balad & Nasseef House, top visited spot this week.",
      weeklyViews: 35200,
    },
    {
      place: places.find((p) => p.id === "s1") || places[1]!,
      rank: 2,
      badgeAr: "🏖️ ترند #2 شواطئ أبحر",
      badgeEn: "#2 Obhur Resort Trend",
      reasonAr: "منتجع إنديجو الفاخر بأبحر يقع في صدارة المنتجعات الشاطئية لجمعات الويكند.",
      reasonEn: "Indigo Resort in Obhur leads weekend beach resort bookings.",
      weeklyViews: 34500,
    },
    {
      place: places.find((p) => p.id === "h2") || places[2]!,
      rank: 3,
      badgeAr: "🏰 ترند #3 إقامة ملكية",
      badgeEn: "#3 Luxury Hotel Trend",
      reasonAr: "فندق ريتز كارلتون قبالة نافورة الملك فهد الأكثر طلباً لإقامة 5 نجوم.",
      reasonEn: "The Ritz-Carlton facing King Fahd's Fountain, top 5-star choice.",
      weeklyViews: 31200,
    },
    {
      place: places.find((p) => p.id === "r1") || places[3]!,
      rank: 4,
      badgeAr: "🍗 ترند #4 وجبات سريعة",
      badgeEn: "#4 Fast Food Trend",
      reasonAr: "مطعم البيك بالزهراء وجبة جدة الأيقونية الأكثر طلباً يومياً.",
      reasonEn: "Iconic Albaik chicken & garlic sauce, Jeddah's daily favorite.",
      weeklyViews: 28500,
    },
    {
      place: places.find((p) => p.id === "c1") || places[4]!,
      rank: 5,
      badgeAr: "☕ ترند #5 قهوة مختصة",
      badgeEn: "#5 Specialty Coffee",
      reasonAr: "محمص برو 92 بالخالدية المكان الأول للروقان والعمل والمذاكرة.",
      reasonEn: "Brew 92 Specialty Coffee, #1 spot for work and study vibes.",
      weeklyViews: 24100,
    },
    {
      place: places.find((p) => p.id === "r2") || places[5]!,
      rank: 6,
      badgeAr: "🥙 ترند #6 مشاوي شامية",
      badgeEn: "#6 Shami Grill Trend",
      reasonAr: "مطعم خيال للمشاوي الشامية بالأندلس الأعلى تقييماً لجمعات العوائل والشباب.",
      reasonEn: "Khayal Shami Grill in Al Andalus, top rated for group dining.",
      weeklyViews: 22400,
    },
  ];
};
