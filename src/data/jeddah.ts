export type Mood =
  | "food"
  | "coffee"
  | "games"
  | "sea"
  | "adventure"
  | "calm"
  | "culture"
  | "shopping";

export type PlaceKind = "activity" | "food" | "cafe" | "culture" | "outdoor" | "shopping";

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
}

const P = (p: Place) => p;

export const places: Place[] = [
  // ---- أنشطة ترفيهية ----
  P({ id: "p1", nameAr: "مسار الغروب للدراجات", nameEn: "Sunset Ride Track", kind: "outdoor", categoryAr: "بحر وخارجي", districtId: "corniche", moods: ["sea", "calm", "adventure"], pricePerPerson: 35, durationMin: 75, indoor: false, groups: ["friends", "couple", "family", "solo", "tourist"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 16, closesAt: 24, descAr: "مسار بحري لتأجير الدراجات على الكورنيش مع إطلالة مباشرة على البحر الأحمر.", descEn: "Seaside cycling track along the Corniche with direct Red Sea views.", whyAr: "قريب من موقعكم ومناسب لوقت الغروب.", parkingAr: "مواقف مجانية واسعة" }),
  P({ id: "p2", nameAr: "بولينغ الميناء", nameEn: "Harbour Bowling", kind: "activity", categoryAr: "ألعاب داخلية", districtId: "rawdah", moods: ["games"], pricePerPerson: 65, durationMin: 90, indoor: true, groups: ["friends", "family", "coworkers", "kids"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 12, closesAt: 25, descAr: "صالة بولينغ حديثة مع ألعاب أركيد وركن وجبات خفيفة.", descEn: "Modern bowling alley with an arcade corner and snacks.", whyAr: "خيار داخلي مريح في جو جدة الحار.", parkingAr: "موقف مول مغطى" }),
  P({ id: "p3", nameAr: "حلبة كارتينغ شمال", nameEn: "North Karting Circuit", kind: "activity", categoryAr: "مغامرات", districtId: "north", moods: ["games", "adventure"], pricePerPerson: 120, durationMin: 80, indoor: true, groups: ["friends", "coworkers", "couple"], kidsFriendly: false, reservation: true, verified: true, accessible: false, opensAt: 16, closesAt: 25, descAr: "حلبة كارتينغ داخلية بسيارات كهربائية وتوقيت مباشر.", descEn: "Indoor karting circuit with electric karts and live timing.", whyAr: "نشاط حماسي يناسب مجموعة الأصدقاء.", parkingAr: "مواقف خاصة" }),
  P({ id: "p4", nameAr: "غرفة الهروب: سر البلد", nameEn: "Escape Room: Balad Secret", kind: "activity", categoryAr: "ألعاب داخلية", districtId: "hamra", moods: ["games", "adventure", "culture"], pricePerPerson: 85, durationMin: 60, indoor: true, groups: ["friends", "couple", "coworkers"], kidsFriendly: false, reservation: true, verified: true, accessible: false, opensAt: 15, closesAt: 24, descAr: "غرفة هروب بقصة مستوحاة من حواري جدة القديمة.", descEn: "Escape room themed around old Jeddah alleys.", whyAr: "تجربة مختلفة تناسب وقت قصير.", parkingAr: "مواقف على الشارع" }),
  P({ id: "p5", nameAr: "مدينة الألعاب العائلية", nameEn: "Family Play City", kind: "activity", categoryAr: "عائلات وأطفال", districtId: "zahra", moods: ["games"], pricePerPerson: 55, durationMin: 100, indoor: true, groups: ["family", "kids"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 11, closesAt: 23, descAr: "مركز ألعاب داخلي مخصص للأطفال مع مناطق آمنة حسب العمر.", descEn: "Indoor play centre with age-based safe zones for kids.", whyAr: "أنسب خيار لوجود أطفال.", parkingAr: "مواقف مول" }),
  P({ id: "p6", nameAr: "تجربة الغوص الضحل", nameEn: "Shallow Dive Experience", kind: "outdoor", categoryAr: "بحر ومغامرة", districtId: "obhur", moods: ["sea", "adventure"], pricePerPerson: 280, durationMin: 150, indoor: false, groups: ["friends", "couple", "tourist"], kidsFriendly: false, reservation: true, verified: true, accessible: false, opensAt: 8, closesAt: 18, descAr: "جلسة غوص للمبتدئين مع مدرب معتمد في مياه أبحر.", descEn: "Beginner dive session with a certified instructor in Obhur.", whyAr: "تجربة مميزة لعشاق البحر.", parkingAr: "مواقف المرسى" }),
  P({ id: "p7", nameAr: "منتزه الترامبولين", nameEn: "Trampoline Park", kind: "activity", categoryAr: "ألعاب داخلية", districtId: "north", moods: ["games", "adventure"], pricePerPerson: 70, durationMin: 75, indoor: true, groups: ["friends", "family", "kids"], kidsFriendly: true, reservation: false, verified: true, accessible: false, opensAt: 13, closesAt: 24, descAr: "منصات قفز وحواجز رياضية داخلية لكل الأعمار.", descEn: "Indoor jump zones and obstacle courses for all ages.", whyAr: "طاقة عالية ووقت قصير.", parkingAr: "مواقف مجانية" }),
  P({ id: "p8", nameAr: "قاعة الواقع الافتراضي", nameEn: "VR Arena", kind: "activity", categoryAr: "ألعاب داخلية", districtId: "tahlia", moods: ["games", "adventure"], pricePerPerson: 95, durationMin: 60, indoor: true, groups: ["friends", "coworkers", "couple"], kidsFriendly: false, reservation: false, verified: false, accessible: true, opensAt: 14, closesAt: 25, descAr: "تجارب واقع افتراضي جماعية داخل قاعة حرة الحركة.", descEn: "Free-roam multiplayer virtual reality arena.", whyAr: "تجربة سريعة وقريبة.", parkingAr: "مواقف مدفوعة" }),
  P({ id: "p9", nameAr: "رحلة قارب المغيب", nameEn: "Sunset Boat Trip", kind: "outdoor", categoryAr: "بحر", districtId: "obhur", moods: ["sea", "calm"], pricePerPerson: 190, durationMin: 120, indoor: false, groups: ["couple", "family", "friends", "tourist"], kidsFriendly: true, reservation: true, verified: true, accessible: true, opensAt: 15, closesAt: 22, descAr: "جولة بحرية قصيرة وقت الغروب مع مشروبات ساخنة.", descEn: "Short sunset cruise with hot drinks on board.", whyAr: "أفضل إطلالة غروب في جدة.", parkingAr: "مواقف المرسى" }),
  P({ id: "p10", nameAr: "ممشى الشاطئ الشمالي", nameEn: "North Beach Walk", kind: "outdoor", categoryAr: "أماكن مجانية", districtId: "north", moods: ["sea", "calm"], pricePerPerson: 0, durationMin: 60, indoor: false, groups: ["solo", "family", "couple", "friends", "tourist", "kids"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 6, closesAt: 25, descAr: "ممشى بحري مجاني مع جلسات ومناطق ألعاب أطفال.", descEn: "Free seaside promenade with seating and kids areas.", whyAr: "مجاني ويوازن ميزانية الخطة.", parkingAr: "مواقف مجانية" }),
  P({ id: "p11", nameAr: "نادي البلياردو", nameEn: "Cue Club", kind: "activity", categoryAr: "ألعاب داخلية", districtId: "rawdah", moods: ["games", "calm"], pricePerPerson: 45, durationMin: 70, indoor: true, groups: ["friends", "coworkers", "solo"], kidsFriendly: false, reservation: false, verified: false, accessible: true, opensAt: 16, closesAt: 26, descAr: "طاولات بلياردو وسنوكر بجو هادئ.", descEn: "Billiards and snooker tables in a calm setting.", whyAr: "خيار اقتصادي بعد الدوام.", parkingAr: "مواقف على الشارع" }),
  P({ id: "p12", nameAr: "سينما الواجهة", nameEn: "Waterfront Cinema", kind: "activity", categoryAr: "ألعاب داخلية", districtId: "corniche", moods: ["calm", "games"], pricePerPerson: 60, durationMin: 130, indoor: true, groups: ["couple", "friends", "family"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 12, closesAt: 26, descAr: "صالات عرض حديثة بإطلالة على الواجهة البحرية.", descEn: "Modern screens overlooking the waterfront.", whyAr: "مريح ومناسب لجو هادئ.", parkingAr: "مواقف مغطاة" }),

  // ---- مطاعم ----
  P({ id: "r1", nameAr: "مطعم صيادين البحر الأحمر", nameEn: "Red Sea Fishermen", kind: "food", categoryAr: "مأكولات بحرية", districtId: "corniche", moods: ["food", "sea"], pricePerPerson: 140, durationMin: 90, indoor: true, groups: ["family", "friends", "couple", "tourist"], kidsFriendly: true, reservation: true, verified: true, accessible: true, opensAt: 13, closesAt: 25, descAr: "سمك طازج يومي مع جلسات خارجية على البحر.", descEn: "Daily fresh catch with outdoor seaside seating.", whyAr: "الأنسب لخطة بحر وعشاء.", parkingAr: "خدمة صف سيارات" }),
  P({ id: "r2", nameAr: "مندي البلد", nameEn: "Balad Mandi House", kind: "food", categoryAr: "مطبخ محلي", districtId: "balad", moods: ["food", "culture"], pricePerPerson: 45, durationMin: 60, indoor: true, groups: ["family", "friends", "tourist", "solo"], kidsFriendly: true, reservation: false, verified: true, accessible: false, opensAt: 11, closesAt: 24, descAr: "مندي ومظبي بأسعار اقتصادية في قلب جدة التاريخية.", descEn: "Affordable mandi in the heart of Historic Jeddah.", whyAr: "سعر مناسب لميزانية اقتصادية.", parkingAr: "مواقف عامة قريبة" }),
  P({ id: "r3", nameAr: "برغر الرصيف", nameEn: "Sidewalk Burger", kind: "food", categoryAr: "وجبات سريعة", districtId: "tahlia", moods: ["food"], pricePerPerson: 55, durationMin: 45, indoor: true, groups: ["friends", "solo", "coworkers", "kids", "family"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 12, closesAt: 26, descAr: "برغر محلي سريع مع جلسات خارجية بسيطة.", descEn: "Local smash burgers with simple outdoor seating.", whyAr: "سريع ويناسب وقت قصير.", parkingAr: "مواقف على الشارع" }),
  P({ id: "r4", nameAr: "مطعم الشرفة العالية", nameEn: "High Terrace", kind: "food", categoryAr: "مطاعم إطلالة", districtId: "obhur", moods: ["food", "sea", "calm"], pricePerPerson: 320, durationMin: 110, indoor: true, groups: ["couple", "friends", "tourist"], kidsFriendly: false, reservation: true, verified: true, accessible: true, opensAt: 17, closesAt: 25, descAr: "عشاء راقٍ بإطلالة بانورامية على أبحر.", descEn: "Fine dining with a panoramic Obhur view.", whyAr: "تجربة مميزة لمن يبحث عن الدلع.", parkingAr: "خدمة صف سيارات" }),
  P({ id: "r5", nameAr: "مطبخ الحجاز", nameEn: "Hijaz Kitchen", kind: "food", categoryAr: "مطبخ محلي", districtId: "hamra", moods: ["food", "culture"], pricePerPerson: 95, durationMin: 80, indoor: true, groups: ["family", "couple", "tourist", "friends"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 12, closesAt: 24, descAr: "أطباق حجازية تقليدية بتقديم عصري.", descEn: "Traditional Hijazi dishes with a modern presentation.", whyAr: "توازن ممتاز بين الجودة والسعر.", parkingAr: "مواقف خاصة" }),
  P({ id: "r6", nameAr: "بيت الفطور الشعبي", nameEn: "Morning House", kind: "food", categoryAr: "فطور", districtId: "zahra", moods: ["food", "calm"], pricePerPerson: 40, durationMin: 60, indoor: true, groups: ["family", "friends", "solo", "couple"], kidsFriendly: true, reservation: false, verified: false, accessible: true, opensAt: 6, closesAt: 13, descAr: "فطور شعبي: فول وشكشوكة ومعصوب.", descEn: "Local breakfast: foul, shakshuka and maasoub.", whyAr: "بداية يوم اقتصادية.", parkingAr: "مواقف على الشارع" }),
  P({ id: "r7", nameAr: "مطعم النكهات الآسيوية", nameEn: "Asian Flavours", kind: "food", categoryAr: "مطبخ عالمي", districtId: "rawdah", moods: ["food"], pricePerPerson: 120, durationMin: 85, indoor: true, groups: ["friends", "couple", "coworkers", "family"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 13, closesAt: 25, descAr: "أطباق آسيوية متنوعة مع خيارات نباتية.", descEn: "Asian plates with vegetarian options.", whyAr: "خيارات متنوعة للمجموعة.", parkingAr: "مواقف مول" }),
  P({ id: "r8", nameAr: "شواية الجنوب", nameEn: "Southern Grill", kind: "food", categoryAr: "مشاوي", districtId: "south", moods: ["food"], pricePerPerson: 70, durationMin: 70, indoor: true, groups: ["family", "friends", "coworkers"], kidsFriendly: true, reservation: false, verified: false, accessible: false, opensAt: 13, closesAt: 25, descAr: "مشاوي طازجة بأسعار معقولة.", descEn: "Fresh grills at reasonable prices.", whyAr: "قريب ومناسب للميزانية.", parkingAr: "مواقف واسعة" }),

  // ---- مقاهي وحلى ----
  P({ id: "c1", nameAr: "مقهى الرصيف البحري", nameEn: "Seaside Espresso", kind: "cafe", categoryAr: "قهوة", districtId: "corniche", moods: ["coffee", "sea", "calm"], pricePerPerson: 35, durationMin: 50, indoor: false, groups: ["couple", "friends", "solo", "family", "tourist"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 7, closesAt: 26, descAr: "قهوة مختصة مع جلسات خارجية مقابل البحر.", descEn: "Specialty coffee with seafront outdoor seating.", whyAr: "ختام هادئ للخطة.", parkingAr: "مواقف مجانية" }),
  P({ id: "c2", nameAr: "محمصة الحارة", nameEn: "Neighbourhood Roastery", kind: "cafe", categoryAr: "قهوة", districtId: "rawdah", moods: ["coffee", "calm"], pricePerPerson: 28, durationMin: 45, indoor: true, groups: ["solo", "friends", "coworkers", "couple"], kidsFriendly: false, reservation: false, verified: true, accessible: true, opensAt: 7, closesAt: 25, descAr: "محمصة صغيرة بقهوة مختصة وأسعار مناسبة.", descEn: "Small roastery with specialty coffee at fair prices.", whyAr: "أرخص خيار قهوة قريب.", parkingAr: "مواقف على الشارع" }),
  P({ id: "c3", nameAr: "حلى الشرق", nameEn: "Orient Desserts", kind: "cafe", categoryAr: "حلى", districtId: "tahlia", moods: ["coffee", "food"], pricePerPerson: 45, durationMin: 45, indoor: true, groups: ["family", "friends", "couple", "kids"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 14, closesAt: 26, descAr: "حلويات شرقية وغربية مع مشروبات ساخنة.", descEn: "Eastern and western desserts with hot drinks.", whyAr: "مناسب مع الأطفال.", parkingAr: "مواقف مدفوعة" }),
  P({ id: "c4", nameAr: "مقهى الشرفة", nameEn: "Rooftop Coffee", kind: "cafe", categoryAr: "قهوة", districtId: "obhur", moods: ["coffee", "sea", "calm"], pricePerPerson: 75, durationMin: 60, indoor: false, groups: ["couple", "friends", "tourist"], kidsFriendly: false, reservation: false, verified: true, accessible: false, opensAt: 16, closesAt: 26, descAr: "مقهى سطح بإطلالة على البحر وجلسات هادئة.", descEn: "Rooftop café with sea views and quiet seating.", whyAr: "أجواء مميزة بعد العشاء.", parkingAr: "مواقف خاصة" }),
  P({ id: "c5", nameAr: "قهوة البلد التراثية", nameEn: "Balad Heritage Coffee", kind: "cafe", categoryAr: "قهوة", districtId: "balad", moods: ["coffee", "culture", "calm"], pricePerPerson: 25, durationMin: 45, indoor: true, groups: ["tourist", "friends", "solo", "couple"], kidsFriendly: true, reservation: false, verified: true, accessible: false, opensAt: 9, closesAt: 24, descAr: "قهوة عربية وحلى تقليدي داخل بيت تراثي.", descEn: "Arabic coffee and traditional sweets in a heritage house.", whyAr: "يكمل جولة البلد.", parkingAr: "مواقف عامة" }),

  // ---- ثقافة وتاريخ ----
  P({ id: "k1", nameAr: "جولة البلد التاريخية", nameEn: "Historic Balad Tour", kind: "culture", categoryAr: "ثقافة وتاريخ", districtId: "balad", moods: ["culture", "calm"], pricePerPerson: 30, durationMin: 120, indoor: false, groups: ["tourist", "family", "couple", "friends", "solo"], kidsFriendly: true, reservation: false, verified: true, accessible: false, opensAt: 8, closesAt: 23, descAr: "جولة مشي بين البيوت التراثية والرواشين والأسواق القديمة.", descEn: "Walking tour through heritage houses, rawasheen and old souqs.", whyAr: "أهم تجربة ثقافية للسياح.", parkingAr: "مواقف عامة" }),
  P({ id: "k2", nameAr: "متحف البيت الحجازي", nameEn: "Hijazi House Museum", kind: "culture", categoryAr: "متاحف", districtId: "balad", moods: ["culture"], pricePerPerson: 40, durationMin: 70, indoor: true, groups: ["tourist", "family", "solo", "kids"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 9, closesAt: 21, descAr: "متحف يعرض حياة جدة القديمة وأدواتها اليومية.", descEn: "Museum showing old Jeddah daily life and crafts.", whyAr: "داخلي ومناسب لجو الحر.", parkingAr: "مواقف عامة" }),
  P({ id: "k3", nameAr: "معرض الفن المعاصر", nameEn: "Contemporary Art Space", kind: "culture", categoryAr: "فنون", districtId: "hamra", moods: ["culture", "calm"], pricePerPerson: 0, durationMin: 50, indoor: true, groups: ["solo", "couple", "friends", "tourist"], kidsFriendly: false, reservation: false, verified: false, accessible: true, opensAt: 10, closesAt: 22, descAr: "معرض مجاني لأعمال فنانين سعوديين.", descEn: "Free gallery featuring Saudi artists.", whyAr: "مجاني وهادئ.", parkingAr: "مواقف على الشارع" }),
  P({ id: "k4", nameAr: "سوق الجامع القديم", nameEn: "Old Souq", kind: "shopping", categoryAr: "أسواق شعبية", districtId: "balad", moods: ["shopping", "culture"], pricePerPerson: 50, durationMin: 70, indoor: false, groups: ["tourist", "family", "friends"], kidsFriendly: true, reservation: false, verified: true, accessible: false, opensAt: 9, closesAt: 24, descAr: "سوق شعبي للعطور والبهارات والهدايا التذكارية.", descEn: "Traditional souq for perfumes, spices and souvenirs.", whyAr: "تجربة محلية أصيلة.", parkingAr: "مواقف عامة" }),
  P({ id: "k5", nameAr: "مول الواجهة", nameEn: "Waterfront Mall", kind: "shopping", categoryAr: "تسوق", districtId: "north", moods: ["shopping", "calm"], pricePerPerson: 60, durationMin: 90, indoor: true, groups: ["family", "friends", "kids", "couple"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 10, closesAt: 25, descAr: "مركز تسوق كبير مع منطقة مطاعم وألعاب أطفال.", descEn: "Large mall with food court and kids zone.", whyAr: "داخلي ويجمع أكثر من نشاط.", parkingAr: "مواقف مغطاة" }),
  P({ id: "k6", nameAr: "حديقة العائلة الكبرى", nameEn: "Grand Family Park", kind: "outdoor", categoryAr: "أماكن مجانية", districtId: "south", moods: ["calm", "sea"], pricePerPerson: 0, durationMin: 70, indoor: false, groups: ["family", "kids", "solo", "friends"], kidsFriendly: true, reservation: false, verified: true, accessible: true, opensAt: 6, closesAt: 25, descAr: "حديقة عامة مجانية مع ألعاب أطفال ومساحات مشي.", descEn: "Free public park with playground and walking paths.", whyAr: "مجاني ومناسب للأطفال.", parkingAr: "مواقف مجانية" }),
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
  { id: "o5", placeId: "p9", titleAr: "رحلة الغروب لعائلة 4 أفراد", original: 760, price: 590, endAt: "2026-10-31", verifiedAt: "2026-07-25", termsAr: "حسب الأحوال الجوية" },
  { id: "o6", placeId: "k2", titleAr: "دخول الطفل مجانًا", original: 40, price: 0, endAt: "2026-09-15", verifiedAt: "2026-07-18", termsAr: "بصحبة بالغ" },
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
  { id: "rp1", slug: "under-100", titleAr: "جدة بأقل من 100 ريال", titleEn: "Jeddah under 100 SAR", descAr: "ممشى بحري، فطور شعبي، وقهوة اقتصادية.", budget: "economy", stops: ["p10", "r2", "c2"], groups: ["friends", "solo", "family"], tagAr: "الأكثر حفظًا" },
  { id: "rp2", slug: "after-work", titleAr: "طلعة بعد الدوام", titleEn: "After work outing", descAr: "بلياردو سريع، برغر، وقهوة قريبة.", budget: "economy", stops: ["p11", "r3", "c2"], groups: ["coworkers", "friends"], tagAr: "سريعة" },
  { id: "rp3", slug: "sea-and-dinner", titleAr: "بحر وعشاء وقت الغروب", titleEn: "Sea & sunset dinner", descAr: "مسار الغروب، عشاء بحري، ثم قهوة على البحر.", budget: "balanced", stops: ["p1", "r1", "c1"], groups: ["couple", "friends", "tourist"], tagAr: "اختيارنا" },
  { id: "rp4", slug: "family-indoor", titleAr: "يوم عائلي داخلي", titleEn: "Indoor family day", descAr: "ألعاب أطفال، غداء عائلي، وحلى.", budget: "balanced", stops: ["p5", "r7", "c3"], groups: ["family", "kids"], tagAr: "مناسب للأطفال" },
  { id: "rp5", slug: "balad-tour", titleAr: "جولة تاريخية في البلد", titleEn: "Historic Balad tour", descAr: "جولة تراثية، مندي، وقهوة عربية.", budget: "economy", stops: ["k1", "r2", "c5"], groups: ["tourist", "family"], tagAr: "للسياح" },
  { id: "rp6", slug: "premium-night", titleAr: "ليلة دلع في أبحر", titleEn: "Premium Obhur night", descAr: "رحلة قارب، عشاء بإطلالة، ومقهى سطح.", budget: "premium", stops: ["p9", "r4", "c4"], groups: ["couple", "friends"], tagAr: "تجربة مميزة" },
  { id: "rp7", slug: "friends-games", titleAr: "ألعاب وعشاء مع الأصدقاء", titleEn: "Games & dinner", descAr: "كارتينغ، مشاوي، وقهوة.", budget: "balanced", stops: ["p3", "r8", "c2"], groups: ["friends", "coworkers"], tagAr: "حماسية" },
  { id: "rp8", slug: "tourist-full-day", titleAr: "يوم كامل للسائح", titleEn: "Full tourist day", descAr: "البلد، المتحف، السوق، وعشاء بحري.", budget: "balanced", stops: ["k1", "k2", "k4", "r1"], groups: ["tourist"], tagAr: "يوم كامل" },
  { id: "rp9", slug: "romantic", titleAr: "موعد رومانسي", titleEn: "Romantic date", descAr: "غروب على البحر، عشاء هادئ، وقهوة سطح.", budget: "premium", stops: ["p1", "r4", "c4"], groups: ["couple"], tagAr: "للأزواج" },
  { id: "rp10", slug: "free-jeddah", titleAr: "أماكن مجانية في جدة", titleEn: "Free Jeddah", descAr: "حديقة، ممشى بحري، ومعرض فني مجاني.", budget: "economy", stops: ["k6", "p10", "k3"], groups: ["family", "solo", "friends"], tagAr: "مجانية" },
  { id: "rp11", slug: "hot-weather", titleAr: "خطة وقت الحر", titleEn: "Hot weather plan", descAr: "كلها أماكن داخلية مكيفة.", budget: "balanced", stops: ["p2", "r7", "c3"], groups: ["family", "friends"], tagAr: "داخلية" },
  { id: "rp12", slug: "morning", titleAr: "خطة صباحية", titleEn: "Morning plan", descAr: "فطور شعبي، متحف، وقهوة.", budget: "economy", stops: ["r6", "k2", "c5"], groups: ["family", "solo", "tourist"], tagAr: "صباحية" },
];

export const budgetLevels: Record<
  BudgetLevel,
  { ar: string; subAr: string; rangeAr: string; max: number; min: number }
> = {
  economy: { ar: "اقتصادية", subAr: "طلعة حلوة بدون ما تكسر الميزانية.", rangeAr: "حتى 100 ر.س للشخص", min: 0, max: 100 },
  balanced: { ar: "موزونة", subAr: "أفضل توازن بين الترفيه والسعر.", rangeAr: "من 100 إلى 250 ر.س للشخص", min: 100, max: 250 },
  premium: { ar: "دلع", subAr: "تجارب مميزة ويوم مختلف.", rangeAr: "أكثر من 250 ر.س للشخص", min: 250, max: 900 },
};

export const moodLabels: Record<Mood, string> = {
  food: "أكل",
  coffee: "قهوة وحلى",
  games: "ألعاب",
  sea: "بحر وغروب",
  adventure: "مغامرة",
  calm: "هدوء",
  culture: "ثقافة وتاريخ",
  shopping: "تسوق",
};

export const groupLabels: Record<GroupType, string> = {
  solo: "لحالي",
  friends: "أصدقاء",
  couple: "زوجان",
  family: "عائلة",
  kids: "أطفال",
  coworkers: "زملاء عمل",
  tourist: "سائح",
};

export const getPlace = (id: string) => places.find((p) => p.id === id)!;
export const getDistrict = (id: string) => districts.find((d) => d.id === id)!;

export function distanceKm(a: District, b: District) {
  const dx = (a.lat - b.lat) * 111;
  const dy = (a.lng - b.lng) * 104;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;
}

export const travelMinutes = (km: number) => Math.max(5, Math.round(km * 2.2 + 4));