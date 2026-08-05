export type Mood =
  | "food"
  | "coffee"
  | "games"
  | "sea"
  | "adventure"
  | "calm"
  | "culture"
  | "shopping";

export type PlaceKind =
  | "activity"
  | "food"
  | "cafe"
  | "culture"
  | "outdoor"
  | "shopping"
  | "hotel"
  | "resort";

export type GroupType = "solo" | "friends" | "couple" | "family" | "kids" | "coworkers" | "tourist";

export type BudgetLevel = "economy" | "balanced" | "premium";

export interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
}

export const districts: District[] = [
  { id: "corniche", nameAr: "كورنيش جدة", nameEn: "Jeddah Corniche", lat: 21.62, lng: 39.1 },
  { id: "north", nameAr: "شمال جدة", nameEn: "North Jeddah", lat: 21.72, lng: 39.13 },
  { id: "obhur", nameAr: "أبحر", nameEn: "Obhur", lat: 21.78, lng: 39.09 },
  { id: "rawdah", nameAr: "الروضة", nameEn: "Al Rawdah", lat: 21.56, lng: 39.15 },
  { id: "tahlia", nameAr: "التحلية", nameEn: "Al Tahlia", lat: 21.55, lng: 39.16 },
  { id: "zahra", nameAr: "الزهراء", nameEn: "Al Zahra", lat: 21.57, lng: 39.14 },
  { id: "hamra", nameAr: "الحمراء", nameEn: "Al Hamra", lat: 21.53, lng: 39.16 },
  { id: "balad", nameAr: "جدة التاريخية / البلد", nameEn: "Historic Jeddah", lat: 21.48, lng: 39.19 },
  { id: "central", nameAr: "وسط جدة", nameEn: "Central Jeddah", lat: 21.52, lng: 39.19 },
  { id: "south", nameAr: "جنوب جدة", nameEn: "South Jeddah", lat: 21.4, lng: 39.19 },
  { id: "airport", nameAr: "منطقة المطار", nameEn: "Airport Area", lat: 21.68, lng: 39.17 },
];

export interface Place {
  id: string;
  nameAr: string;
  nameEn: string;
  kind: PlaceKind;
  categoryAr: string;
  subCategoryAr?: string;
  subCategoryEn?: string;
  districtId: string;
  moods: Mood[];
  pricePerPerson: number;
  durationMin: number;
  indoor: boolean;
  groups: GroupType[];
  kidsFriendly: boolean;
  reservation: boolean;
  verified: boolean;
  accessible: boolean;
  opensAt: number; // hour 0-24
  closesAt: number;
  descAr: string;
  descEn: string;
  whyAr: string;
  parkingAr: string;
  rating?: number;
  viewsCount?: number;
  trending?: boolean;
  mapsUrl?: string;
}

const P = (p: Place) => p;

export const places: Place[] = [
  // ---- أنشطة ترفيهية ----
  P({
    id: "p1",
    nameAr: "مسار الغروب للدراجات",
    nameEn: "Sunset Ride Track",
    kind: "outdoor",
    categoryAr: "بحر وخارجي",
    districtId: "corniche",
    moods: ["sea", "calm", "adventure"],
    pricePerPerson: 35,
    durationMin: 75,
    indoor: false,
    groups: ["friends", "couple", "family", "solo", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 16,
    closesAt: 24,
    descAr: "مسار بحري لتأجير الدراجات على الكورنيش مع إطلالة مباشرة على البحر الأحمر.",
    descEn: "Seaside cycling track along the Corniche with direct Red Sea views.",
    whyAr: "قريب من موقعكم ومناسب لوقت الغروب.",
    parkingAr: "مواقف مجانية واسعة",
    rating: 4.8,
    viewsCount: 9800,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
  }),
  P({
    id: "p2",
    nameAr: "بولينغ الميناء",
    nameEn: "Harbour Bowling",
    kind: "activity",
    categoryAr: "ألعاب داخلية",
    districtId: "rawdah",
    moods: ["games"],
    pricePerPerson: 65,
    durationMin: 90,
    indoor: true,
    groups: ["friends", "family", "coworkers", "kids"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 12,
    closesAt: 25,
    descAr: "صالة بولينغ حديثة مع ألعاب أركيد وركن وجبات خفيفة.",
    descEn: "Modern bowling alley with an arcade corner and snacks.",
    whyAr: "خيار داخلي مريح في جو جدة الحار.",
    parkingAr: "موقف مول مغطى",
    rating: 4.6,
    viewsCount: 6200,
    trending: false,
    mapsUrl: "https://maps.google.com/?q=21.56,39.15",
  }),
  P({
    id: "p3",
    nameAr: "حلبة كارتينغ شمال",
    nameEn: "North Karting Circuit",
    kind: "activity",
    categoryAr: "مغامرات",
    districtId: "north",
    moods: ["games", "adventure"],
    pricePerPerson: 120,
    durationMin: 80,
    indoor: true,
    groups: ["friends", "coworkers", "couple"],
    kidsFriendly: false,
    reservation: true,
    verified: true,
    accessible: false,
    opensAt: 16,
    closesAt: 25,
    descAr: "حلبة كارتينغ داخلية بسيارات كهربائية وتوقيت مباشر.",
    descEn: "Indoor karting circuit with electric karts and live timing.",
    whyAr: "نشاط حماسي يناسب مجموعة الأصدقاء.",
    parkingAr: "مواقف خاصة",
    rating: 4.9,
    viewsCount: 7600,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.72,39.13",
  }),

  // ---- مطاعم شاملة (شامية، وجبات سريعة، سعودية قديمة، مصرية) ----
  P({
    id: "r1",
    nameAr: "مطعم صيادين البحر الأحمر",
    nameEn: "Red Sea Fishermen",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مشاوي ومأكولات بحرية",
    subCategoryEn: "Seafood & Grills",
    districtId: "corniche",
    moods: ["food", "sea"],
    pricePerPerson: 140,
    durationMin: 90,
    indoor: true,
    groups: ["family", "friends", "couple", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 13,
    closesAt: 25,
    descAr: "سمك طازج يومي مع جلسات خارجية على البحر مباشرة وقائمة طعام متنوعة.",
    descEn: "Daily fresh catch with outdoor seaside seating.",
    whyAr: "الأنسب لخطة بحر وعشاء مميز.",
    parkingAr: "خدمة صف سيارات",
    rating: 4.8,
    viewsCount: 11800,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
  }),
  P({
    id: "r2",
    nameAr: "مندي البلد التراثي",
    nameEn: "Balad Mandi House",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم سعودية قديمة",
    subCategoryEn: "Traditional Saudi",
    districtId: "balad",
    moods: ["food", "culture"],
    pricePerPerson: 45,
    durationMin: 60,
    indoor: true,
    groups: ["family", "friends", "tourist", "solo"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: false,
    opensAt: 11,
    closesAt: 24,
    descAr: "مندي ومظبي حطبي بأصالة وأجواء جدة القديمة بأسعار اقتصادية جداً.",
    descEn: "Affordable mandi in the heart of Historic Jeddah.",
    whyAr: "طعم شعبي أصيل وسعر مناسب للميزانية.",
    parkingAr: "مواقف عامة قريبة",
    rating: 4.7,
    viewsCount: 10400,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.48,39.19",
  }),
  P({
    id: "r3",
    nameAr: "برغر الرصيف وسماش",
    nameEn: "Sidewalk Smash Burger",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "وجبات سريعة",
    subCategoryEn: "Fast Food & Burgers",
    districtId: "tahlia",
    moods: ["food"],
    pricePerPerson: 55,
    durationMin: 45,
    indoor: true,
    groups: ["friends", "solo", "coworkers", "kids", "family"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 12,
    closesAt: 26,
    descAr: "برغر محلي سريعة التحضير بسماش طازج وصلصات خاصة وجلسات حيوية.",
    descEn: "Local smash burgers with simple outdoor seating.",
    whyAr: "سريع ولذيذ ويناسب الطلعات السريعة.",
    parkingAr: "مواقف على الشارع",
    rating: 4.6,
    viewsCount: 8900,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.55,39.16",
  }),
  P({
    id: "r9",
    nameAr: "مطعم ياسمين الشام",
    nameEn: "Yasmeen Al Sham",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم شامية",
    subCategoryEn: "Levantine Cuisine",
    districtId: "rawdah",
    moods: ["food", "calm"],
    pricePerPerson: 85,
    durationMin: 75,
    indoor: true,
    groups: ["family", "couple", "friends"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 12,
    closesAt: 25,
    descAr: "أشهى المشاوي الشامية والكبة النية والمقبلات البيروتية الدمشقية بجلسات مريحة.",
    descEn: "Authentic Levantine grills, kibbeh and Beirut appetizers.",
    whyAr: "أصالة المذاق الشامي ومناسب للعائلات.",
    parkingAr: "مواقف خاصة واسعة",
    rating: 4.9,
    viewsCount: 12500,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.56,39.15",
  }),
  P({
    id: "r10",
    nameAr: "مطعم الكشري المصري الأصيل",
    nameEn: "Authentic Egyptian Koshary",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم مصرية",
    subCategoryEn: "Egyptian Cuisine",
    districtId: "central",
    moods: ["food", "culture"],
    pricePerPerson: 35,
    durationMin: 50,
    indoor: true,
    groups: ["family", "friends", "solo", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 10,
    closesAt: 26,
    descAr: "كشري مصري وطواجن باللحمة والموزة والشواية على الأصول المصرية.",
    descEn: "Egyptian Koshary and traditional meat tagines.",
    whyAr: "طعم مصري 100% وبأسعار اقتصادية ممتازة.",
    parkingAr: "مواقف سهلة",
    rating: 4.8,
    viewsCount: 9400,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.52,39.19",
  }),
  P({
    id: "r5",
    nameAr: "مطبخ الحجاز التراثي",
    nameEn: "Hijaz Kitchen",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم سعودية قديمة",
    subCategoryEn: "Traditional Saudi",
    districtId: "hamra",
    moods: ["food", "culture"],
    pricePerPerson: 95,
    durationMin: 80,
    indoor: true,
    groups: ["family", "couple", "tourist", "friends"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 12,
    closesAt: 24,
    descAr: "سليق حجازي، فرموزة، وكرشات بتقديم عصري في حي الحمراء.",
    descEn: "Traditional Hijazi dishes with a modern presentation.",
    whyAr: "توازن ممتاز بين الجودة والروح التراثية.",
    parkingAr: "مواقف خاصة",
    rating: 4.7,
    viewsCount: 8100,
    trending: false,
    mapsUrl: "https://maps.google.com/?q=21.53,39.16",
  }),

  // ---- كافيهات ----
  P({
    id: "c1",
    nameAr: "مقهى الرصيف البحري",
    nameEn: "Seaside Espresso",
    kind: "cafe",
    categoryAr: "كافيهات",
    subCategoryAr: "كافيهات مختصة ورائية",
    subCategoryEn: "Specialty & View Cafes",
    districtId: "corniche",
    moods: ["coffee", "sea", "calm"],
    pricePerPerson: 35,
    durationMin: 50,
    indoor: false,
    groups: ["couple", "friends", "solo", "family", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 7,
    closesAt: 26,
    descAr: "قهوة مختصة وجلسات روف خارجية مباشرة مقابل غروب البحر الأحمر.",
    descEn: "Specialty coffee with seafront outdoor seating.",
    whyAr: "أعلى مقهى طلباً وقت الغروب في جدة.",
    parkingAr: "مواقف مجانية",
    rating: 4.9,
    viewsCount: 14200,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
  }),

  // ---- فنادق (Hotels) ----
  P({
    id: "h1",
    nameAr: "فندق برج الواجهة 5 نجوم",
    nameEn: "Waterfront Tower Hotel 5*",
    kind: "hotel",
    categoryAr: "فنادق",
    subCategoryAr: "فنادق 5 نجوم وفاخرة",
    subCategoryEn: "5-Star Luxury Hotels",
    districtId: "corniche",
    moods: ["calm", "sea"],
    pricePerPerson: 650,
    durationMin: 1440,
    indoor: true,
    groups: ["couple", "family", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "فندق فاخر مطل على واجهة جدة البحرية مع مسبح بانورامي وسبا عالمي.",
    descEn: "Luxury 5-star hotel overlooking Jeddah Waterfront.",
    whyAr: "إقامة فاخرة بإطلالة ساحرة على البحر.",
    parkingAr: "خدمة صف السيارات وموقف مغطى",
    rating: 4.9,
    viewsCount: 15400,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
  }),
  P({
    id: "h2",
    nameAr: "فندق الكورنيش اللؤلؤي",
    nameEn: "Pearl Corniche Hotel",
    kind: "hotel",
    categoryAr: "فنادق",
    subCategoryAr: "فنادق 5 نجوم وفاخرة",
    subCategoryEn: "Luxury Hotels",
    districtId: "hamra",
    moods: ["calm", "sea"],
    pricePerPerson: 420,
    durationMin: 1440,
    indoor: true,
    groups: ["couple", "family", "coworkers", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "فندق عصري بقرب نافورة الملك فهد وجلسات شاطئية مريحة.",
    descEn: "Modern hotel near King Fahd Fountain.",
    whyAr: "موقع استراتيجي وسط خدمات كورنيش الحمراء.",
    parkingAr: "مواقف خاصة مجانية",
    rating: 4.7,
    viewsCount: 10100,
    trending: false,
    mapsUrl: "https://maps.google.com/?q=21.53,39.16",
  }),

  // ---- منتجعات (Resorts) ----
  P({
    id: "s1",
    nameAr: "منتجع شواطئ أبحر الفاخر",
    nameEn: "Obhur Beach Resort",
    kind: "resort",
    categoryAr: "منتجعات",
    subCategoryAr: "منتجعات البحر الأحمر وأبحر",
    subCategoryEn: "Red Sea & Obhur Resorts",
    districtId: "obhur",
    moods: ["sea", "calm", "adventure"],
    pricePerPerson: 890,
    durationMin: 1440,
    indoor: false,
    groups: ["family", "couple", "friends", "kids"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "منتجع وشاليهات بحرية خاصة مع شاطئ رملي وأنشطة العاب مائية ومرسى يخوت.",
    descEn: "Private beach resort with sandy beach and water sports.",
    whyAr: "قمة الاسترخاء والخصوصية للعائلات والأزواج.",
    parkingAr: "مواقف شاليهات مغطاة",
    rating: 4.9,
    viewsCount: 18200,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.78,39.09",
  }),
  P({
    id: "s2",
    nameAr: "منتجع النورس للفلل البحرية",
    nameEn: "Al Nowras Floating Villas Resort",
    kind: "resort",
    categoryAr: "منتجعات",
    subCategoryAr: "منتجعات البحر الأحمر وأبحر",
    subCategoryEn: "Floating Villas Resort",
    districtId: "corniche",
    moods: ["sea", "calm"],
    pricePerPerson: 1200,
    durationMin: 1440,
    indoor: false,
    groups: ["couple", "family"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "فلل سكنية عائمة فوق مياه البحر الأحمر مباشرة مع مسبح خاص لكل فيلا.",
    descEn: "Floating villas over the Red Sea with private pools.",
    whyAr: "تجربة فندقية استثنائية لا مثيل لها في جدة.",
    parkingAr: "خدمة صف السيارات الخاصة",
    rating: 5.0,
    viewsCount: 22100,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
  }),
];

export interface Offer {
  id: string;
  placeId: string;
  titleAr: string;
  original: number;
  price: number;
  endAt: string;
  verifiedAt: string;
  termsAr: string;
  sponsored?: boolean;
}

export const offers: Offer[] = [
  { id: "o1", placeId: "p2", titleAr: "خطين بولينغ بسعر خط", original: 130, price: 65, endAt: "2026-12-31", verifiedAt: "2026-07-28", termsAr: "من الأحد إلى الأربعاء فقط", sponsored: true },
  { id: "o2", placeId: "r1", titleAr: "خصم 20% على أطباق السمك", original: 175, price: 140, endAt: "2026-11-30", verifiedAt: "2026-07-21", termsAr: "لا يشمل العروض الأخرى" },
  { id: "o3", placeId: "c1", titleAr: "قهوة + حلى بـ 29 ريال", original: 45, price: 29, endAt: "2026-10-15", verifiedAt: "2026-08-01", termsAr: "قبل الساعة 6 مساءً" },
  { id: "o4", placeId: "p3", titleAr: "جولتين كارتينغ بـ 150", original: 240, price: 150, endAt: "2026-09-30", verifiedAt: "2026-07-30", termsAr: "بحجز مسبق" },
];

export interface ReadyPlan {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  budget: BudgetLevel;
  stops: string[];
  groups: GroupType[];
  tagAr: string;
}

export const readyPlans: ReadyPlan[] = [
  { id: "rp1", slug: "under-100", titleAr: "جدة بأقل من 100 ريال", titleEn: "Jeddah under 100 SAR", descAr: "ممشى بحري، فطور شعبي، وقهوة اقتصادية.", budget: "economy", stops: ["p1", "r2", "c1"], groups: ["friends", "solo", "family"], tagAr: "الأكثر حفظًا" },
];

export const getPlace = (id: string): Place => {
  return places.find((p) => p.id === id) || places[0];
};

export const getDistrict = (id: string): District => {
  return districts.find((d) => d.id === id) || districts[0];
};

export const moodLabels: Record<Mood, string> = {
  food: "مطاعم وأكل",
  coffee: "قهوة وحلى",
  games: "ألعاب وترفيه",
  sea: "بحر وغروب",
  adventure: "مغامرة وتحدي",
  calm: "هدوء وروقان",
  culture: "ثقافة وتاريخ",
  shopping: "تسوق وتمشية",
};

export const groupLabels: Record<GroupType, string> = {
  solo: "لحالي",
  friends: "الشلة",
  couple: "شخصين",
  family: "العائلة",
  kids: "أطفال",
  coworkers: "زملاء العمل",
  tourist: "سياح",
};

export const budgetLevels: Record<BudgetLevel, { ar: string; en: string }> = {
  economy: { ar: "اقتصادي", en: "Economy" },
  balanced: { ar: "موزون", en: "Balanced" },
  premium: { ar: "دلع وفخامة", en: "Premium" },
};

export const travelMinutes = (fromId: string, toId: string): number => {
  if (fromId === toId) return 10;
  return 25;
};

export const distanceKm = (fromId: string, toId: string): number => {
  if (fromId === toId) return 3;
  return 12;
};