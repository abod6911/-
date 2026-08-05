export type Mood =
  | "food"
  | "coffee"
  | "games"
  | "sea"
  | "adventure"
  | "calm"
  | "culture"
  | "shopping"
  | "new";

export type PlaceKind =
  | "activity"
  | "food"
  | "cafe"
  | "culture"
  | "outdoor"
  | "shopping"
  | "hotel"
  | "resort";

export type GroupType =
  | "solo"
  | "friends"
  | "couple"
  | "duo"
  | "family"
  | "kids"
  | "coworkers"
  | "work"
  | "tourist"
  | "tourists"
  | "seniors";

export type DistrictId = string;

export type BudgetLevel = "economy" | "balanced" | "premium";

export interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
}

export const districts: District[] = [
  { id: "corniche", nameAr: "كورنيش جدة الواجهة البحرية", nameEn: "Jeddah Corniche Waterfront", lat: 21.62, lng: 39.1 },
  { id: "north", nameAr: "شمال جدة", nameEn: "North Jeddah", lat: 21.72, lng: 39.13 },
  { id: "obhur", nameAr: "أبحر الشمالية والجنوبية", nameEn: "Obhur Beach Area", lat: 21.78, lng: 39.09 },
  { id: "rawdah", nameAr: "حي الروضة", nameEn: "Al Rawdah District", lat: 21.56, lng: 39.15 },
  { id: "tahlia", nameAr: "شارع التحلية", nameEn: "Al Tahlia Street", lat: 21.55, lng: 39.16 },
  { id: "zahra", nameAr: "حي الزهراء", nameEn: "Al Zahra District", lat: 21.57, lng: 39.14 },
  { id: "hamra", nameAr: "حي الحمراء ونافورة الفهد", nameEn: "Al Hamra & Fountain Area", lat: 21.53, lng: 39.16 },
  { id: "balad", nameAr: "جدة التاريخية (البلد)", nameEn: "Historic Jeddah (Al Balad)", lat: 21.48, lng: 39.19 },
  { id: "central", nameAr: "حي الخالدية ووسط جدة", nameEn: "Al Khalidiya & Central", lat: 21.52, lng: 39.19 },
  { id: "salama", nameAr: "حي السلامة", nameEn: "Al Salama District", lat: 21.58, lng: 39.16 },
  { id: "airport", nameAr: "منطقة مطار الملك عبدالعزيز", nameEn: "King Abdulaziz Airport Area", lat: 21.68, lng: 39.17 },
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
  image: string;
}

const P = (p: Place) => p;

export const places: Place[] = [
  // ==================== أكل ومطاعم حقيقية في جدة ====================
  P({
    id: "r1",
    nameAr: "مطعم البيك (فرع الزهراء وطريق الملك)",
    nameEn: "Albaik (Al Zahra & King Road Branch)",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "وجبات سريعة",
    subCategoryEn: "Fast Food & Chicken",
    districtId: "zahra",
    moods: ["food"],
    pricePerPerson: 22,
    durationMin: 40,
    indoor: true,
    groups: ["family", "friends", "solo", "kids", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 10,
    closesAt: 26,
    descAr: "رمز الوجبات السريعة الأيقوني في السعودية وجدة! البروستد والجمبري المقرمش مع صلصة الثوم الشهيرة.",
    descEn: "Saudi Arabia's iconic fast food chicken & seafood with legendary garlic sauce.",
    whyAr: "الوجبة الأشهر في جدة والسعودية بلا منافس وبسعر اقتصادي.",
    parkingAr: "مواقف الفرع المتوفرة",
    rating: 4.9,
    viewsCount: 28500,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.57,39.14",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "r2",
    nameAr: "مطعم خيال للمشاوي الشامية (الأندلس)",
    nameEn: "Khayal Levantine Grill (Al Andalus)",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم شامية",
    subCategoryEn: "Levantine Cuisine",
    districtId: "central",
    moods: ["food", "calm"],
    pricePerPerson: 95,
    durationMin: 80,
    indoor: true,
    groups: ["family", "friends", "couple", "coworkers"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 12,
    closesAt: 25,
    descAr: "أحد أشهر مطاعم المشاوي الشامية في جدة! المشاوي المشكلة بالطول الشهير والكباب الشامي والخبز الطازج.",
    descEn: "Jeddah's most famous Levantine grill house, signature meter kebabs & fresh bread.",
    whyAr: "مذاق شامي أصيل وجلسات عائلية واسعة ومريحة.",
    parkingAr: "خدمة صف سيارات ومواقف خاصة",
    rating: 4.9,
    viewsCount: 22400,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.52,39.19",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "r3",
    nameAr: "مطعم قدورة للأسماك البحرية (الحمراء)",
    nameEn: "Gaddoura Seafood (Al Hamra)",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مشاوي ومأكولات بحرية",
    subCategoryEn: "Seafood",
    districtId: "hamra",
    moods: ["food", "sea"],
    pricePerPerson: 130,
    durationMin: 90,
    indoor: true,
    groups: ["family", "friends", "couple", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 13,
    closesAt: 25,
    descAr: "مطعم بحري عريق في الحمراء باختيار السمك والروبيان الطازج يومياً والطهي الحجازي والمصري المتميز.",
    descEn: "Classic Jeddah seafood landmark overlooking Al Hamra with daily fresh Red Sea catch.",
    whyAr: "تجربة طازجة 100% من البحر الأحمر مباشرة.",
    parkingAr: "مواقف خاصة واسعة",
    rating: 4.8,
    viewsCount: 19800,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.53,39.16",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "r4",
    nameAr: "مطعم السدة للمأكولات الشعبية والمندي (السلامة)",
    nameEn: "Al Saddah Traditional Mandi (Al Salama)",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم سعودية قديمة",
    subCategoryEn: "Traditional Saudi",
    districtId: "salama",
    moods: ["food", "culture"],
    pricePerPerson: 55,
    durationMin: 60,
    indoor: true,
    groups: ["family", "friends", "tourist", "solo"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 11,
    closesAt: 25,
    descAr: "أحد وجهات المندي والمظبي والمضغوط الأولى في جدة بأجواء شعبية وجلسات أرضية وطاولات مريحة.",
    descEn: "Jeddah's top choice for traditional Mandi, Madhbi & authentic Saudi meat dishes.",
    whyAr: "الأفضل للولائم والجمعات الشعبية بنكهة سعودية أصيلة.",
    parkingAr: "مواقف واسعة أمام المطعم",
    rating: 4.8,
    viewsCount: 17600,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.58,39.16",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "r5",
    nameAr: "مطعم كشري وتمر حنة (الروضة)",
    nameEn: "Koshary & Tamarind Egyptian (Al Rawdah)",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم مصرية",
    subCategoryEn: "Egyptian Cuisine",
    districtId: "rawdah",
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
    descAr: "مطعم مصري عريق يقدم الكشري الفاخر بدقته وشطته، والطواجن المصرية والمشويات في أجواء قاهرية دافئة.",
    descEn: "Authentic Egyptian Koshary, meat tagines & Cairo atmosphere in Rawdah.",
    whyAr: "طعم مصري 100% وأسعار ممتازة لجميع الأفراد.",
    parkingAr: "مواقف على الشارع",
    rating: 4.7,
    viewsCount: 14300,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.56,39.15",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "r6",
    nameAr: "مطعم لوسين الأرميني الفاخر (الخالدية)",
    nameEn: "Lusin Armenian Fine Dining (Al Khalidiya)",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم شامية",
    subCategoryEn: "Fine Dining Armeno-Levantine",
    districtId: "central",
    moods: ["food", "calm"],
    pricePerPerson: 220,
    durationMin: 90,
    indoor: true,
    groups: ["couple", "family", "coworkers"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 13,
    closesAt: 25,
    descAr: "تجربة طعام فاخرة بالروست والأعشاب الأرمينية والشامية مع كباب الكرز والمانتي الشهير بجلسات راقية.",
    descEn: "Upmarket Armenian & Levantine cuisine featuring cherry kebab & mantou.",
    whyAr: "خيارات فاخرة للمناسبات الخاصة واللقاءات الهامة.",
    parkingAr: "خدمة الفاليه ومواقف مخصصة",
    rating: 4.9,
    viewsCount: 16100,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.52,39.19",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "r7",
    nameAr: "مطعم ست الشام الفاخر (طريق الملك)",
    nameEn: "Sit Al Sham Levantine Dining (King Road)",
    kind: "food",
    categoryAr: "مطاعم",
    subCategoryAr: "مطاعم شامية",
    subCategoryEn: "Levantine Luxury Feast",
    districtId: "zahra",
    moods: ["food", "calm"],
    pricePerPerson: 140,
    durationMin: 75,
    indoor: true,
    groups: ["family", "friends", "couple", "coworkers"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 12,
    closesAt: 25,
    descAr: "مطعم شامي فاخر بتصاميم دمشقية عريقة، يقدم الكباب، المازة الشامية، والكبة بجميع أنواعها.",
    descEn: "Traditional Damascene palace restaurant offering authentic Levantine mezza & grills.",
    whyAr: "أجواء دمشقية تاريخية وطاولة ممتلئة بالمازات الشامية.",
    parkingAr: "خدمة صف السيارات ومواقف مخصصة",
    rating: 4.8,
    viewsCount: 18200,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.57,39.14",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  }),

  // ==================== كافيهات وقهوة مختصة حقيقية في جدة ====================
  P({
    id: "c1",
    nameAr: "كافيه برو 92 للقهوة المختصة (الخالدية والروضة)",
    nameEn: "Brew 92 Specialty Coffee (Al Khalidiya)",
    kind: "cafe",
    categoryAr: "كافيهات",
    subCategoryAr: "كافيهات مختصة ورائية",
    subCategoryEn: "Specialty Coffee Roasters",
    districtId: "central",
    moods: ["coffee", "calm"],
    pricePerPerson: 40,
    durationMin: 60,
    indoor: true,
    groups: ["solo", "friends", "couple", "coworkers"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 6,
    closesAt: 25,
    descAr: "رواد القهوة المختصة في جدة! محمص وقهوة مختصة بجودة عالية وجلسات راقية مناسبة للمذاكرة والشغل.",
    descEn: "Jeddah's premier specialty coffee roaster with modern industrial vibes & quiet study corners.",
    whyAr: "أفضل مكان للروقان، العمل، والمذاكرة مع قهوة مختصة.",
    parkingAr: "مواقف المحمص الخاصة",
    rating: 4.9,
    viewsCount: 24100,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.52,39.19",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "c2",
    nameAr: "مقهى ومحمصة ميدد التراثي (جدة التاريخية والبلد)",
    nameEn: "Medd Coffee & Roastery (Historic Balad)",
    kind: "cafe",
    categoryAr: "كافيهات",
    subCategoryAr: "كافيهات مختصة ورائية",
    subCategoryEn: "Specialty & Heritage Coffee",
    districtId: "balad",
    moods: ["coffee", "culture", "calm"],
    pricePerPerson: 35,
    durationMin: 60,
    indoor: true,
    groups: ["solo", "friends", "couple", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: false,
    opensAt: 7,
    closesAt: 24,
    descAr: "مقهى ومحمصة داخل مبنى تراثي حجازي بالبلد التاريخية، يدمج بين القهوة المختصة وأصالة التاريخ الحجازي.",
    descEn: "Organic specialty coffee in a renovated historic Hejazi building in Al Balad.",
    whyAr: "أجواء حجازية ساحرة بين المباني التاريخية بالبلد.",
    parkingAr: "مواقف السيارات المجاورة لشارع الذهب",
    rating: 4.9,
    viewsCount: 18900,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.48,39.19",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "c3",
    nameAr: "كافيه أفرست أوفردوز البحر (الكورنيش الشمالي)",
    nameEn: "Overdose Coffee (North Corniche)",
    kind: "cafe",
    categoryAr: "كافيهات",
    subCategoryAr: "كافيهات مختصة ورائية",
    subCategoryEn: "Sea View Specialty Coffee",
    districtId: "corniche",
    moods: ["coffee", "sea"],
    pricePerPerson: 38,
    durationMin: 50,
    indoor: true,
    groups: ["friends", "couple", "solo", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 6,
    closesAt: 26,
    descAr: "فرع الواجهة البحرية المطل مباشرة على الكورنيش والبحر! المشروبات الباردة والسبانيش لاتيه مع نسمات البحر.",
    descEn: "Popular seaside coffee spot directly overlooking the Red Sea waterfront.",
    whyAr: "إطلالة بحرية ممتازة ومشروبات منعشة وقت الغروب.",
    parkingAr: "مواقف الواجهة البحرية",
    rating: 4.8,
    viewsCount: 21500,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "c4",
    nameAr: "كافيه ومخبز وودن كوفي (حي الزهراء)",
    nameEn: "Wooden Coffee & Artisan Bakery (Al Zahra)",
    kind: "cafe",
    categoryAr: "كافيهات",
    subCategoryAr: "كافيهات مختصة ورائية",
    subCategoryEn: "Bakery & Specialty Coffee",
    districtId: "zahra",
    moods: ["coffee", "calm"],
    pricePerPerson: 42,
    durationMin: 55,
    indoor: true,
    groups: ["friends", "couple", "solo", "coworkers"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 7,
    closesAt: 25,
    descAr: "كافيه ومخبز فرنسي بتصاميم خشبية دافئة، يشتهر بكرواسون اللوز والقهوة المختصة المقطرة.",
    descEn: "Warm wooden-styled French bakery & coffee shop famous for almond croissants.",
    whyAr: "أفخم خبز كرواسون طازج مع قهوة مقطرة في جدة.",
    parkingAr: "مواقف المجمع التجارية",
    rating: 4.8,
    viewsCount: 16800,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.57,39.14",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
  }),

  // ==================== فنادق 5 نجوم حقيقية في جدة ====================
  P({
    id: "h1",
    nameAr: "فندق روزوود جدة 5 نجوم (الكورنيش الشمالي)",
    nameEn: "Rosewood Jeddah 5-Star Luxury Hotel",
    kind: "hotel",
    categoryAr: "فنادق",
    subCategoryAr: "فنادق 5 نجوم وفاخرة",
    subCategoryEn: "5-Star Luxury Hotel",
    districtId: "corniche",
    moods: ["calm", "sea"],
    pricePerPerson: 850,
    durationMin: 1440,
    indoor: true,
    groups: ["couple", "family", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "أحد أفخم فنادق الـ 5 نجوم في جدة بجمود يطل مباشرة على الكورنيش، بمسبح في الروف وخدمة خادم شخصي لكافة الأجنحة.",
    descEn: "Ultra-luxury 5-star hotel on Jeddah Corniche with rooftop pool & butler service.",
    whyAr: "أفخم إقامة وأعلى مستوى رفاهية وإطلالة بحرية بجدة.",
    parkingAr: "خدمة صف السيارات ومواقف مغطاة VIP",
    rating: 4.9,
    viewsCount: 29800,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "h2",
    nameAr: "فندق ريتز كارلتون جدة 5 نجوم (الحمراء)",
    nameEn: "The Ritz-Carlton Jeddah 5-Star Hotel",
    kind: "hotel",
    categoryAr: "فنادق",
    subCategoryAr: "فنادق 5 نجوم وفاخرة",
    subCategoryEn: "5-Star Palace Hotel",
    districtId: "hamra",
    moods: ["calm", "sea", "culture"],
    pricePerPerson: 980,
    durationMin: 1440,
    indoor: true,
    groups: ["couple", "family", "tourist", "coworkers"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "قصر ملكي فاخر 5 نجوم يقع قبالة نافورة الملك فهد بالحمراء، يضم قاعات ملكية ومطاعم عالمية وفخامة بلا حدود.",
    descEn: "Palatial 5-star luxury facing King Fahd's Fountain with majestic architecture.",
    whyAr: "إقامة ملكية بإطلالة على أعلى نافورة في العالم.",
    parkingAr: "خدمة صف السيارات الفاخرة",
    rating: 4.9,
    viewsCount: 31200,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.53,39.16",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "h3",
    nameAr: "فندق وأجنحة اصيلة جدة (طريق الملك / التحلية)",
    nameEn: "Assila Hotel, a Luxury Collection Hotel",
    kind: "hotel",
    categoryAr: "فنادق",
    subCategoryAr: "فنادق 5 نجوم وفاخرة",
    subCategoryEn: "Luxury Art Hotel",
    districtId: "tahlia",
    moods: ["calm", "culture"],
    pricePerPerson: 720,
    durationMin: 1440,
    indoor: true,
    groups: ["couple", "family", "coworkers", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "فندق 5 نجوم مصمم كمعرض فني يضم آلاف الأعمال الفنية العربية، بقلب شارع التحلية ومسابح سبا فاخرة.",
    descEn: "5-star luxury art hotel on Tahlia Street featuring thousands of curated Arabian artworks.",
    whyAr: "موقع استراتيجي بقلب جدة بين التسوق والفخامة.",
    parkingAr: "مواقف الفندق السفلية وخدمة صف السيارات",
    rating: 4.8,
    viewsCount: 19500,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.55,39.16",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  }),

  // ==================== منتجعات حقيقية في جدة والأبحر ====================
  P({
    id: "s1",
    nameAr: "منتجع إنديجو وشواطئ المرجان (أبحر الشمالية)",
    nameEn: "Indigo Beach Resort (North Obhur)",
    kind: "resort",
    categoryAr: "منتجعات",
    subCategoryAr: "منتجعات البحر الأحمر وأبحر",
    subCategoryEn: "Red Sea Obhur Resort",
    districtId: "obhur",
    moods: ["sea", "calm", "adventure"],
    pricePerPerson: 950,
    durationMin: 1440,
    indoor: false,
    groups: ["family", "couple", "friends", "kids"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "منتجع بالي الاستوائي الفاخر في أبحر الشمالية مع شواطئ رملية فلل خاصة وألعاب مائية ومرسى يخوت.",
    descEn: "Balinesian style luxury beach resort in North Obhur with private villas & marina.",
    whyAr: "قمة الاسترخاء والاستجمام في أفضل شواطئ أبحر.",
    parkingAr: "مواقف الفلل الخاصة والمرسى",
    rating: 4.9,
    viewsCount: 34500,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.78,39.09",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "s2",
    nameAr: "منتجع النورس الفلوتينغ للفلل العائمة (الكورنيش)",
    nameEn: "Al Nawras Floating Villas Resort",
    kind: "resort",
    categoryAr: "منتجعات",
    subCategoryAr: "منتجعات البحر الأحمر وأبحر",
    subCategoryEn: "Floating Sea Villas Resort",
    districtId: "corniche",
    moods: ["sea", "calm"],
    pricePerPerson: 1100,
    durationMin: 1440,
    indoor: false,
    groups: ["couple", "family", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 0,
    closesAt: 24,
    descAr: "شاليهات وفلل عائمة على مياه البحر الأحمر مباشرة بمسابح خاصة وإطلالة لا تحجب للبحر والغروب.",
    descEn: "Overwater floating villas on the Red Sea with private pools & endless sea views.",
    whyAr: "تجربة الفلل العائمة الفريدة بقلب بحر جدة.",
    parkingAr: "مواقف الشاليهات المخصصة",
    rating: 4.9,
    viewsCount: 28900,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.62,39.1",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  }),

  // ==================== أنشطة ومغامرات حقيقية في جدة ====================
  P({
    id: "p1",
    nameAr: "حلبة إن-نايت كارتينج وأركيد (الروضة)",
    nameEn: "In10so Karting & Arcade (Al Rawdah)",
    kind: "activity",
    categoryAr: "ألعاب ومغامرات",
    subCategoryAr: "ألعاب ترفيهية وكارتينج",
    subCategoryEn: "Indoor Karting & Arcade",
    districtId: "rawdah",
    moods: ["games", "adventure"],
    pricePerPerson: 120,
    durationMin: 90,
    indoor: true,
    groups: ["friends", "coworkers", "family", "kids"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 16,
    closesAt: 25,
    descAr: "أكبر صالة كارتينج داخلية بسيارات سباق كهربائية سرعة ومضمار احترافي بالإضافة لمركز ألعاب أركيد وبولينغ.",
    descEn: "Jeddah's premier indoor electric karting track, arcade center & bowling.",
    whyAr: "أقوى حماس وتنافس للشباب والعائلات.",
    parkingAr: "مواقف المركز المغطاة",
    rating: 4.8,
    viewsCount: 23100,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.56,39.15",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "p2",
    nameAr: "مركز الغوص السعودي - بحر أبحر",
    nameEn: "Red Sea Diving Center (Obhur)",
    kind: "outdoor",
    categoryAr: "بحر ومغامرة",
    subCategoryAr: "غوص ورياضات مائية",
    subCategoryEn: "Red Sea Scuba Diving",
    districtId: "obhur",
    moods: ["sea", "adventure"],
    pricePerPerson: 280,
    durationMin: 150,
    indoor: false,
    groups: ["friends", "couple", "tourist", "solo"],
    kidsFriendly: false,
    reservation: true,
    verified: true,
    accessible: false,
    opensAt: 8,
    closesAt: 18,
    descAr: "رحلات غوص واستكشاف الشعاب المرجانية الحية في أعماق البحر الأحمر مع مدربين معتمدين PADI.",
    descEn: "PADI scuba diving sessions & Red Sea coral reef exploration in Obhur.",
    whyAr: "تجربة مائية أسطورية في أعماق أعذب مياه البحر الأحمر.",
    parkingAr: "مواقف المرسى والغواصين",
    rating: 4.9,
    viewsCount: 27400,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.78,39.09",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  }),
  P({
    id: "p3",
    nameAr: "منطقة البلد التاريخية وبيت ناصيف",
    nameEn: "Historic Al Balad & Nasseef House",
    kind: "culture",
    categoryAr: "ثقافة وتاريخ",
    subCategoryAr: "جدة التاريخية والثقافة",
    subCategoryEn: "Historic Landmark & UNESCO Heritage",
    districtId: "balad",
    moods: ["culture", "calm"],
    pricePerPerson: 0,
    durationMin: 120,
    indoor: false,
    groups: ["family", "friends", "couple", "tourist", "solo"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: false,
    opensAt: 9,
    closesAt: 24,
    descAr: "منطقة التراث العالمي اليونسكو بقلب جدة القديمة، مباني الرواشين التراثية، الأسواق الشعبية ومتحف بيت ناصيف التاريخي.",
    descEn: "UNESCO World Heritage site with historic coral buildings, Roshan architecture & Nasseef House.",
    whyAr: "الوجهة التراثية الأولى والأشهر في جدة ومجانية للتمشية.",
    parkingAr: "مواقف البلد المخصصة",
    rating: 4.9,
    viewsCount: 35200,
    trending: true,
    mapsUrl: "https://maps.google.com/?q=21.48,39.19",
    image: "https://images.unsplash.com/photo-1578895210405-907db48a7111?auto=format&fit=crop&w=800&q=80",
  }),
];

export interface ReadyPlan {
  id: string;
  titleAr: string;
  titleEn: string;
  tagAr: string;
  budget: BudgetLevel;
  stops: string[]; // place ids
  descAr: string;
  image: string;
}

export const readyPlans: ReadyPlan[] = [
  {
    id: "plan-1",
    titleAr: "خطة البحر والروقان 🌊",
    titleEn: "Sea & Sunset Chill",
    tagAr: "غروب ورستوران بحري",
    budget: "balanced",
    stops: ["p2", "r3", "c3"],
    descAr: "تبدأ بغوص أو كارتينج ممتع، ثم عشاء بحري طازج في قدورة، وتختمها بقهوة مختصة بروف الكورنيش مع الغروب.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "plan-2",
    titleAr: "خطة عائلية في جدة التاريخية 🏛️",
    titleEn: "Balad Heritage Family Day",
    tagAr: "تراث وعشاء حجازي",
    budget: "economy",
    stops: ["p3", "r4", "c2"],
    descAr: "تمشية بين رواشين البلد ومتحف ناصيف التاريخي، ثم مندي السدة الشهير، وتختم بقهوة ميدد التراثية بالبلد.",
    image: "https://images.unsplash.com/photo-1578895210405-907db48a7111?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "plan-3",
    titleAr: "خطة ليلة فاخرة 5 نجوم 💎",
    titleEn: "5-Star Luxury Jeddah Night",
    tagAr: "فخامة وأصالة",
    budget: "premium",
    stops: ["h1", "r6", "c1"],
    descAr: "إقامة استثنائية في روزوود الكورنيش، ثم عشاء أرميني فاخر في مطعم لوسين، وقهوة مختصة رايقة ببرو 92.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "plan-4",
    titleAr: "خطة شلة الشباب والحماس 🏎️",
    titleEn: "Youth Thrill & Eats",
    tagAr: "حماس وأكل سريع",
    budget: "economy",
    stops: ["p1", "r1", "c3"],
    descAr: "تنافس كارتينج حماسي بإن-نايت، ثم بروستد البيك الشهير بالزهراء، وتختم بقهوة أفرست البحر الباردة.",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "plan-5",
    titleAr: "خطة استجمام الشواطئ والمنتجعات 🏖️",
    titleEn: "Red Sea Resort Getaway",
    tagAr: "منتجع واستجمام",
    budget: "premium",
    stops: ["s1", "r3", "c3"],
    descAr: "يوم استجمام فلل إنديجو أبحر الشاطئية، عشاء سمك طازج في قدورة، وجلسة روقان مقابل غروب البحر الأحمر.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  },
];

export interface Offer {
  id: string;
  placeId: string;
  titleAr: string;
  titleEn: string;
  discountPct: number;
  validUntil: string;
  code: string;
}

export const offers: Offer[] = [
  {
    id: "o1",
    placeId: "p1",
    titleAr: "خصم 20% على جولات الكارتينج للجموع",
    titleEn: "20% Off Group Karting Sessions",
    discountPct: 20,
    validUntil: "2026-08-30",
    code: "JEDDAW20",
  },
  {
    id: "o2",
    placeId: "r2",
    titleAr: "عرض وجبة العائلة مع مقبلات مجانية في مطعم خيال",
    titleEn: "Free Starters with Family Meal at Khayal",
    discountPct: 15,
    validUntil: "2026-08-31",
    code: "KHAYAL15",
  },
  {
    id: "o3",
    placeId: "c1",
    titleAr: "خصم 15% على جميع المشروبات والقهوة المختصة في برو 92",
    titleEn: "15% Off All Drinks at Brew 92",
    discountPct: 15,
    validUntil: "2026-09-15",
    code: "BREW15",
  },
  {
    id: "o4",
    placeId: "s1",
    titleAr: "خصم 25% على حجز الفلل الشاطئية في منتجع إنديجو أبحر",
    titleEn: "25% Off Indigo Resort Beach Villas",
    discountPct: 25,
    validUntil: "2026-09-30",
    code: "INDIGO25",
  },
];

export const groupLabels: Record<GroupType, { ar: string; en: string }> = {
  solo: { ar: "لحالي 👤", en: "Solo" },
  friends: { ar: "مع الشلة 🥳", en: "Friends" },
  couple: { ar: "شخصين 👩‍❤️‍👨", en: "Couple" },
  family: { ar: "عائلة 👨‍👩‍👧‍👦", en: "Family" },
  kids: { ar: "معي أطفال 👶", en: "With Kids" },
  coworkers: { ar: "زملاء العمل 💼", en: "Coworkers" },
  tourist: { ar: "سياح 🧳", en: "Tourists" },
  duo: { ar: "شخصين 👥", en: "Duo" },
  work: { ar: "زملاء العمل 💼", en: "Work" },
  tourists: { ar: "سياح 🧳", en: "Tourists" },
  seniors: { ar: "كبار السن 🧓", en: "Seniors" },
};

export const moodLabels: Record<Mood, { ar: string; en: string }> = {
  food: { ar: "مطاعم متميزة", en: "Good Food" },
  coffee: { ar: "قهوة وحلى", en: "Coffee & Sweets" },
  sea: { ar: "بحر وغروب", en: "Sea & Sunset" },
  games: { ar: "ألعاب وحركة", en: "Games & Action" },
  adventure: { ar: "مغامرة وتجارب", en: "Adventures" },
  calm: { ar: "هدوء وروقان", en: "Calm Vibes" },
  culture: { ar: "ثقافة وتاريخ", en: "Culture & History" },
  shopping: { ar: "تسوق وتمشية", en: "Shopping" },
  new: { ar: "جديد جدة", en: "New in Jeddah" },
};

export const budgetLevels: Record<BudgetLevel, { ar: string; en: string }> = {
  economy: { ar: "اقتصادية", en: "Budget-Friendly" },
  balanced: { ar: "موزونة", en: "Balanced" },
  premium: { ar: "دلع وفخامة", en: "Premium" },
};

export function getPlace(id: string): Place {
  const p = places.find((x) => x.id === id);
  if (!p) {
    return places[0]!;
  }
  return p;
}

export function getDistrict(id: string): District {
  const d = districts.find((x) => x.id === id);
  if (!d) return districts[0]!;
  return d;
}

export function distanceKm(a: District, b: District): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  return Math.round(R * c * 10) / 10;
}

export function travelMinutes(dist: number): number {
  return Math.max(10, Math.round(dist * 2.8));
}