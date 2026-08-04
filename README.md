# Jeddah Outing Planner

عندي فكره بدي اياك تساويها 


# MASTER WEBSITE BUILD PROMPT

# البرومبت الكامل لبناء موقع «وش الخطة؟»

Act as a senior product designer, UX strategist, full-stack engineer, database architect, brand designer, Arabic localization specialist, SEO specialist, and growth strategist.

Build a complete, production-ready bilingual web application called:

# وش الخطة؟

# Wesh Alkhutta?

Do not create only a landing-page mockup. Build a functional application with working navigation, authentication, database structure, itinerary generation, saved plans, business advertising, an administration panel, responsive layouts, Arabic RTL support, English LTR support, and realistic demo data.

Do not ask me broad or unnecessary questions. Make professional assumptions whenever small details are missing.

---

# 1. PRODUCT CONCEPT

# فكرة المنتج

“وش الخطة؟” is a smart entertainment and outing planner focused exclusively on Jeddah, Saudi Arabia during its first launch.

The platform helps residents and tourists answer questions such as:

* Where should we go today?
* What can we do in Jeddah tonight?
* What can we do with a limited budget?
* Where can families go?
* What entertainment is available nearby?
* How can tourists spend one full day in Jeddah?
* What restaurant, activity, café, or attraction should come next?

The platform must not feel like a basic restaurant directory or a clone of Google Maps.

The core value proposition is:

> Other platforms show places.
> Wesh Alkhutta creates the complete plan.

Arabic value proposition:

> المواقع الثانية تعطيك أماكن.
> وش الخطة يرتّب لك طلعتك كاملة.

The user chooses their location, available time, group type, mood, and budget. The application generates an organized itinerary containing activities, restaurants, cafés, attractions, approximate cost, expected duration, distance, route order, and alternative options.

---

# 2. PRIMARY MARKET

# السوق الأساسي

The MVP must support Jeddah only.

Do not add other cities to the public interface during the first version, but design the database so that other cities can be added later without rebuilding the application.

Use real Jeddah areas and districts for geographical grouping, including:

* Jeddah Corniche.
* North Jeddah.
* Obhur.
* Al Rawdah.
* Al Tahlia.
* Al Zahra.
* Al Hamra.
* Historic Jeddah / Al-Balad.
* Central Jeddah.
* South Jeddah.
* Airport area.

Plans should avoid sending users between very distant parts of Jeddah unless they deliberately choose a full-day tourist plan.

Optimize plans geographically.

---

# 3. TARGET USERS

# المستخدمون المستهدفون

Design the application for four main audiences.

## 3.1 Jeddah residents

People looking for:

* A quick outing after work.
* Weekend activities.
* New entertainment places.
* Affordable plans.
* Family outings.
* Couples’ plans.
* Friends’ plans.
* Indoor activities during hot weather.
* Last-minute plans.

## 3.2 Tourists

Tourists looking for:

* A one-day Jeddah itinerary.
* A two-day itinerary.
* Historic and cultural destinations.
* Places near their hotel.
* Arabic and English descriptions.
* Estimated transportation time.
* Recommendations that require reservations.
* Tourist-friendly activities.

## 3.3 Business owners

Restaurants, cafés, entertainment venues, hotels, activity providers, and event organizers who want to:

* Claim their business page.
* Update information.
* publish offers.
* Advertise.
* Appear in relevant plans.
* View campaign performance.

## 3.4 Platform administrators

The internal team that manages:

* Places.
* Categories.
* Plans.
* users.
* business accounts.
* advertisements.
* offers.
* reports.
* social campaigns.
* analytics.

---

# 4. BRAND POSITIONING

# هوية العلامة

Brand name:

**وش الخطة؟**

English transliteration:

**Wesh Alkhutta?**

Preferred tagline:

Arabic:

> وقتك وميزانيتك علينا، والخطة جاهزة.

Alternative Arabic tagline:

> عطنا وقتك وميزانيتك، ونرتّب لك الطلعة.

English:

> Your time. Your budget. Your perfect Jeddah plan.

Alternative English:

> Give us your time and budget. We’ll plan the rest.

Brand personality:

* Local.
* Friendly.
* Smart.
* Energetic.
* Trustworthy.
* Youthful but not childish.
* Modern but not overly corporate.
* Premium enough to attract businesses.
* Simple enough for all ages.

The tone should sound like a helpful Jeddah friend who knows the city well.

Use friendly Saudi Arabic in interactive interface elements, while using clear Modern Standard Arabic for formal information, privacy, terms, prices, and business communication.

Examples of friendly interface copy:

* وش جوّكم اليوم؟
* كم ميزانيتكم؟
* كم عندكم وقت؟
* تبغونها قريبة؟
* خطتكم جاهزة.
* غيّر لي المكان.
* خلّها أرخص.
* سوّ لي خطة ثانية.
* وين نروح اليوم؟
* ما عندكم وقت؟ عندنا خطة سريعة.

Do not make the tone exaggerated, childish, or filled with emojis.

---

# 5. UNIQUE VISUAL CONCEPT

# الطابع البصري المميز

Create a distinctive visual identity inspired by:

* The Red Sea.
* Jeddah sunsets.
* Coastal movement.
* Road routes.
* Location pins.
* Curved walking paths.
* Historic Jeddah textures.
* Modern Saudi urban life.

The visual concept should be called:

## “The Jeddah Route”

## «مسار جدة»

A flowing route line should appear subtly throughout the interface. It can move between cards, connect itinerary stops, form a location pin, or turn into a question mark.

The logo concept should combine:

* A question mark.
* A map pin.
* A curved route.
* A destination dot.

Avoid making the website look like:

* A generic travel agency.
* A hotel booking website.
* A food delivery application.
* A Google Maps clone.
* A government website.
* A childish entertainment directory.
* A template with excessive gradients or glassmorphism.

---

# 6. COLOR SYSTEM

# نظام الألوان

Use the following main palette.

## Primary midnight navy

`#102A38`

Use for:

* Main headings.
* Navigation.
* Dark sections.
* Footer.
* Premium appearance.

## Red Sea teal

`#087F86`

Use for:

* Primary actions.
* Selected states.
* Route lines.
* Links.
* Active filters.

## Sunset coral

`#FF6B4A`

Use for:

* Important highlights.
* Call-to-action buttons.
* Offers.
* Popular badges.
* Interactive accents.

## Warm sand

`#F4EBDD`

Use for:

* Main background.
* Sections.
* Cards.
* Jeddah-inspired warmth.

## Pearl white

`#FFFDF9`

Use for cards and clean surfaces.

## Soft sea mist

`#DCECEF`

Use for secondary backgrounds and informational cards.

## Success green

`#238B62`

Use for verified places and valid offers.

## Warning amber

`#D89018`

Use for information that may require verification.

## Error red

`#C94848`

Use only for errors and expired offers.

Maintain accessible contrast ratios.

Do not use pure black for large text areas. Use the midnight navy.

---

# 7. TYPOGRAPHY

# الخطوط

Arabic font:

* IBM Plex Sans Arabic.
* Fallback: Tajawal or Noto Sans Arabic.

English font:

* Inter.
* Fallback: system sans-serif.

Typography characteristics:

* Large, confident hero headings.
* Comfortable Arabic line spacing.
* Clear price and time labels.
* Strong visual hierarchy.
* Avoid overly thin Arabic font weights.
* Use rounded but professional button text.

Suggested heading sizes:

* Hero title: 56–72 px desktop.
* Hero title: 36–44 px mobile.
* Section heading: 34–44 px desktop.
* Card heading: 20–24 px.
* Body text: 16–18 px.
* Small metadata: 13–14 px.

Support RTL and LTR correctly.

Do not manually reverse icons that should retain universal direction. Reverse directional arrows and navigation chevrons where appropriate.

---

# 8. DESIGN COMPONENTS

# مكونات التصميم

Create a reusable design system containing:

* Primary button.
* Secondary button.
* Text button.
* Icon button.
* Budget selector.
* Mood selector.
* Time selector.
* Group-size selector.
* Place card.
* Plan card.
* Offer card.
* Entertainment-category card.
* Map preview.
* Timeline stop.
* Price indicator.
* Verified badge.
* Sponsored badge.
* Favorite button.
* Share button.
* Replace-place button.
* Empty state.
* Error state.
* Loading skeleton.
* Modal.
* Drawer.
* Toast.
* Tabs.
* Mobile bottom navigation.
* Desktop header.
* Filter chips.
* Search field.
* Dropdown.
* Date and time picker.
* Admin data table.
* Analytics cards.

Cards should use:

* 16–24 px border radius.
* Light, soft shadows.
* Clear spacing.
* Large images.
* Compact metadata.
* Rounded category chips.
* A small route-line detail.

Avoid excessive borders.

---

# 9. RESPONSIVE EXPERIENCE

# تجربة الجوال والكمبيوتر

Design mobile-first.

The majority of users are expected to visit from mobile devices and social media links.

Support:

* Mobile phones.
* Tablets.
* Laptops.
* Large desktop screens.

On mobile:

* Use a sticky bottom navigation.
* Keep the “خطة سريعة” action visible.
* Use bottom sheets for filters.
* Use swipeable plan cards where helpful.
* Ensure buttons are easy to tap.
* Keep the checkout-like planning flow focused.
* Do not overcrowd screens.

On desktop:

* Use a wider map and itinerary split layout.
* Keep filters in a sidebar where appropriate.
* Use large editorial sections.
* Display plan results in a three-column layout.

---

# 10. LANGUAGE SUPPORT

# دعم اللغات

The application must support:

* Arabic as the default language.
* English as the secondary language.

Arabic routes:

`/ar/...`

English routes:

`/en/...`

Examples:

* `/ar`
* `/en`
* `/ar/quick-plan`
* `/en/quick-plan`
* `/ar/places`
* `/en/places`
* `/ar/plans`
* `/en/plans`

Requirements:

* Full RTL layout for Arabic.
* Full LTR layout for English.
* Language switcher in the header and settings.
* Store Arabic and English content separately.
* Do not use machine-translated placeholder text.
* Ensure prices, dates, and times are localized.
* Use `ر.س` in Arabic and `SAR` in English.
* Use Arabic or Western numerals according to interface settings.
* Ensure map labels and address formatting are readable.

---

# 11. MAIN NAVIGATION

# القائمة الرئيسية

Desktop navigation:

* الرئيسية | Home
* خطط جاهزة | Ready Plans
* خطة على السريع | Quick Plan
* أماكن الترفيه | Entertainment
* مطاعم ومقاهي | Restaurants & Cafés
* عروض جدة | Jeddah Offers
* للسياح | For Tourists
* أعلن معنا | Advertise
* تسجيل الدخول | Sign In

Mobile bottom navigation:

* الرئيسية.
* استكشف.
* خطتك.
* المحفوظات.
* حسابي.

Make “خطتك” or “Quick Plan” the visually dominant center action.

---

# 12. HOME PAGE

# الصفحة الرئيسية

Build a premium, conversion-focused homepage.

## 12.1 Hero section

Arabic headline:

> محتار وين تروح اليوم؟

Arabic description:

> اختر وقتك وميزانيتك وجوّكم، ونرتّب لكم خطة كاملة داخل جدة.

Primary button:

> سوّ لي خطة على السريع

Secondary button:

> استكشف أماكن جدة

English headline:

> Not sure where to go in Jeddah?

English description:

> Choose your time, budget, and mood. We’ll create the full plan.

Use an interactive visual containing:

* A Jeddah map illustration.
* Three connected itinerary stops.
* A moving route line.
* Small cards showing time and estimated price.
* A subtle coastal sunset atmosphere.

## 12.2 Quick input strip

Let users immediately choose:

* Budget.
* Time available.
* Group type.
* Mood.

Then press:

> رتّب الخطة

## 12.3 Three budget categories

Display three prominent cards:

### اقتصادية

Subtitle:

> طلعة حلوة بدون ما تكسر الميزانية.

Range:

> حتى 100 ر.س للشخص

### موزونة

Subtitle:

> أفضل توازن بين الترفيه والسعر.

Range:

> من 100 إلى 250 ر.س للشخص

### دلع

Subtitle:

> تجارب مميزة ويوم مختلف.

Range:

> أكثر من 250 ر.س للشخص

These ranges must be editable from the admin panel.

## 12.4 Popular ready-made plans

Examples:

* طلعة بعد الدوام.
* بحر وعشاء.
* يوم عائلي داخلي.
* جولة في البلد.
* موعد رومانسي.
* جدة بأقل من 100 ريال.
* يوم سائح في جدة.
* ألعاب وعشاء مع الأصدقاء.

## 12.5 Entertainment categories

Show visual category cards for:

* البحر.
* ألعاب داخلية.
* مغامرات.
* عائلات وأطفال.
* ثقافة وتاريخ.
* مطاعم.
* مقاهي وحلى.
* تسوق.
* فعاليات.
* أماكن مجانية.

## 12.6 Current offers

Display verified, non-expired offers only.

## 12.7 How it works

Three simple steps:

1. اختر وقتك وميزانيتك.
2. حدّد جوّكم.
3. استلم خطتك وافتح المسار.

## 12.8 Social proof

Show:

* Number of plans created.
* Number of verified places.
* User testimonials.
* Popular plan saves.

Use realistic demo numbers clearly marked as demo until real analytics exist.

## 12.9 Business call-to-action

Arabic:

> عندك مطعم أو مكان ترفيهي؟

Button:

> أضف مكانك

Secondary:

> أعلن معنا

---

# 13. QUICK PLAN EXPERIENCE

# تجربة «خطة على السريع»

This is the most important feature in the application.

Create a focused multi-step flow that takes less than one minute.

Do not require login before showing the results.

## Step 1: Current area

Question:

> وين أنتم في جدة؟

Options:

* استخدام موقعي.
* اختيار حي.
* اختيار نقطة على الخريطة.
* ما يفرق، أهم شيء الخطة.

Do not request precise location permission until the user actively selects “استخدام موقعي”.

## Step 2: Group type

Question:

> مين معك؟

Options:

* لحالي.
* أصدقاء.
* زوجان.
* عائلة.
* أطفال.
* زملاء عمل.
* سائح.

Also ask group size using a compact counter.

## Step 3: Available time

Question:

> كم عندكم وقت؟

Options:

* أقل من ساعتين.
* 2–4 ساعات.
* 4–6 ساعات.
* يوم كامل.
* وقت مخصص.

## Step 4: Mood

Question:

> وش جوّكم اليوم؟

Options:

* أكل.
* قهوة وحلى.
* ألعاب.
* بحر وغروب.
* مغامرة.
* هدوء.
* ثقافة وتاريخ.
* تسوق.
* مفاجأة.

Allow multiple selections, but keep the interface simple.

## Step 5: Environment

Question:

> داخل أو خارج؟

Options:

* داخلي.
* خارجي.
* ما يفرق.

## Step 6: Budget

Question:

> أي ميزانية تناسبكم؟

Options:

### اقتصادية

Up to 100 SAR per person.

### موزونة

100–250 SAR per person.

### دلع

More than 250 SAR per person.

Also provide:

> حدد ميزانيتي بنفسي

Allow the user to enter:

* Total budget.
* Budget per person.

## Step 7: Preferences

Keep this optional:

* يوجد أطفال.
* مكان هادئ.
* مناسب لذوي الإعاقة.
* لا يحتاج حجزًا.
* مواقف سهلة.
* أطعمة نباتية.
* بدون أماكن خارجية.
* قريب فقط.

Final button:

> جهّز خطتنا

Loading state copy:

> قاعدين نرتّب الأماكن والمسار…

Use an animated route connecting itinerary stops.

---

# 14. PLAN GENERATION LOGIC

# منطق إنشاء الخطط

Build the initial recommendation system using deterministic filtering and weighted scoring.

Do not rely entirely on a generative AI model.

## 14.1 Hard filters

Remove places that do not match:

* Jeddah.
* Opening hours.
* User budget.
* Group type.
* Child suitability.
* Indoor/outdoor preference.
* Maximum travel distance.
* Reservation restrictions.
* Accessibility needs.
* Activity age restrictions.
* Offer validity.
* Place status.

## 14.2 Weighted scoring

Recommended default scoring:

* Mood match: 25%.
* Budget match: 20%.
* Distance: 15%.
* Verified quality: 15%.
* Time suitability: 10%.
* Plan variety: 10%.
* Data freshness: 5%.

Keep scoring values configurable from the admin panel.

## 14.3 Plan construction

A plan should usually contain:

* One primary entertainment activity.
* One restaurant or main meal.
* One optional café, dessert, walk, or secondary attraction.

For very short plans:

* One activity.
* One food or drink stop.

For full-day tourist plans:

* Three to five stops.
* Breaks.
* Meal times.
* Travel time.
* Reservation notes.

## 14.4 Route optimization

* Keep stops geographically close.
* Avoid unnecessary backtracking.
* Consider opening times.
* Consider estimated visit duration.
* Add buffer time for parking.
* Put time-sensitive activities first.
* Provide one alternative place for each stop.
* Display approximate travel time.

## 14.5 Plan confidence

Create an internal confidence score based on:

* Data freshness.
* Number of verified fields.
* Opening-hours reliability.
* Distance calculation.
* Availability of alternatives.

Do not display low-confidence plans without an informational warning.

---

# 15. RESULTS PAGE

# صفحة النتائج

Always display three plan options when enough data is available:

## Option 1: الأقرب والأسرع

Focus on:

* Short travel distance.
* Fast execution.
* Minimal planning.
* Lower complexity.

## Option 2: الخطة الموزونة

Focus on:

* Best overall balance.
* Strong quality.
* Reasonable price.
* Good variety.
* Practical route.

Mark this option as:

> اختيارنا لك

## Option 3: التجربة المميزة

Focus on:

* Premium experiences.
* Better views.
* Unique activities.
* Higher-end restaurants.

Each plan card must show:

* Plan title.
* Hero image.
* Budget category.
* Estimated price per person.
* Estimated total price.
* Total duration.
* Number of stops.
* Estimated travel time.
* Group suitability.
* Indoor/outdoor status.
* Reservation requirement.
* Verification status.
* Save button.
* Share button.
* View plan button.

Provide buttons:

* خلّها أرخص.
* خلّها أقرب.
* غيّر النشاط.
* غيّر المطعم.
* أضف قهوة.
* احذف محطة.
* زد ساعة.
* خطة ثانية.

---

# 16. PLAN DETAILS PAGE

# صفحة تفاصيل الخطة

Create a detailed timeline.

Example:

## بحر وعشاء وقت الغروب

* Duration: 4 hours.
* Estimated cost: 160–220 SAR per person.
* Suitable for: Friends or couples.
* Driving time: Approximately 30 minutes.
* Reservation: Recommended.

Timeline structure:

### 5:30 PM — Entertainment activity

Include:

* Place image.
* Short explanation.
* Why it was selected.
* Visit duration.
* Estimated price.
* Parking note.
* Reservation button.
* Replace button.

### 7:30 PM — Main meal

Include the same details.

### 9:30 PM — Coffee or dessert

Include the same details.

Show:

* Interactive map.
* Connected route line.
* Estimated travel between stops.
* Total estimated cost.
* Total distance.
* Offer savings.
* Important notes.
* Last verification date.

Main actions:

* افتح المسار.
* احفظ الخطة.
* شارك الخطة.
* انسخ الرابط.
* أرسلها على واتساب.
* عدّل الخطة.
* ابدأ الخطة الآن.

---

# 17. GROUP SHARING AND VOTING

# المشاركة والتصويت

Allow users to share a plan using a unique link.

Shared plan visitors can:

* Vote to approve the plan.
* Suggest replacing a place.
* Vote for another restaurant.
* Comment using a short nickname.
* View the plan without creating an account.

Voting options:

* الخطة ممتازة.
* نبيها أرخص.
* غيّروا المطعم.
* نبي نشاط أقوى.
* المكان بعيد.

The plan owner can accept or reject suggestions.

Create social share cards in Arabic and English.

Example share card:

> خطتنا الجمعة
> 3 أماكن
> 190 ر.س للشخص
> من 6 إلى 11 مساءً

Include the Wesh Alkhutta logo and a scannable short link or QR code.

---

# 18. AUTHENTICATION

# تسجيل الدخول

Do not force authentication before users experience the plan generator.

Allow guest users to:

* Browse.
* Create a plan.
* View place details.
* View offers.
* Share a temporary plan.

Require sign-in when users want to:

* Save plans.
* Access plan history.
* Save favorite places.
* Create permanent shared groups.
* Receive personalized recommendations.
* Follow offers.
* Review a completed plan.
* Claim a business.

Authentication methods:

* Google.
* Apple.
* Email and password.
* Magic email link.
* Guest mode.

Phone-number login can be added later.

Account screens:

* Sign in.
* Create account.
* Forgot password.
* Verify email.
* Complete profile.
* Delete account.
* Privacy settings.
* Notification settings.

---

# 19. USER PROFILE

# حساب المستخدم

Profile sections:

* Personal details.
* Preferred language.
* Default Jeddah area.
* Usual budget.
* Favorite moods.
* Group preferences.
* Saved plans.
* Previous plans.
* Favorite places.
* Followed offers.
* Shared group plans.
* Notification preferences.
* Privacy settings.

Allow users to mark completed plans and answer:

* هل نفذت الخطة؟
* وش أكثر مكان عجبك؟
* هل السعر كان قريبًا من المتوقع؟
* هل المعلومات كانت صحيحة؟
* هل تقترح الخطة لغيرك؟

Use this feedback to improve ranking.

---

# 20. PLACE DIRECTORY

# دليل الأماكن

The place directory must contain:

* Entertainment venues.
* Restaurants.
* Cafés.
* Dessert places.
* Beaches.
* Waterfront areas.
* Museums.
* Cultural attractions.
* Historic places.
* Family activities.
* Children’s activities.
* Indoor activities.
* Outdoor activities.
* Adventure experiences.
* Shopping destinations.
* Seasonal events.
* Hotels as an optional tourist-support category.

Filters:

* Category.
* Area.
* Budget.
* Open now.
* Indoor.
* Outdoor.
* Family-friendly.
* Children-friendly.
* Couples.
* Friends.
* Reservation required.
* Parking availability.
* Accessibility.
* Verified offers.
* Visit duration.
* Distance.

Sorting:

* Recommended.
* Nearest.
* Lowest price.
* Highest rated internally.
* Recently verified.
* Most saved.
* Trending.

---

# 21. PLACE DETAILS

# صفحة المكان

Every place page should contain:

* Arabic name.
* English name.
* Category.
* Subcategory.
* Area.
* Address.
* Coordinates.
* Images.
* Short description.
* Full description.
* Average price per person.
* Minimum and maximum estimated cost.
* Opening hours.
* Special seasonal hours.
* Suitable group types.
* Age requirements.
* Indoor or outdoor.
* Average visit duration.
* Booking requirement.
* Parking notes.
* Accessibility notes.
* Official phone.
* Official website.
* Social media accounts.
* Menu or ticket link.
* Current offers.
* Last verification date.
* Verified-business badge.
* Report incorrect information button.
* Plans containing this place.
* Similar nearby places.

Do not publish unverified claims.

Use fictional demo businesses until real data has been manually verified.

---

# 22. ENTERTAINMENT CATEGORIES

# تصنيفات الترفيه

Use the following category architecture.

## Sea and outdoor

* Corniche.
* Beaches.
* Boat trips.
* Yacht experiences.
* Diving.
* Snorkeling.
* Sunset experiences.
* Cycling.
* Walking routes.
* Outdoor parks.

## Indoor entertainment

* Bowling.
* Karting.
* Escape rooms.
* Virtual reality.
* Arcade centers.
* Trampoline parks.
* Billiards.
* Indoor sports.
* Cinemas.
* Aquarium experiences.

## Family and children

* Play centers.
* Educational experiences.
* Interactive museums.
* Children’s workshops.
* Family parks.
* Age-specific entertainment.

## Culture and tourism

* Historic Jeddah.
* Museums.
* Heritage houses.
* Art galleries.
* Cultural tours.
* Traditional markets.
* Local architecture.

## Food experiences

* Breakfast.
* Casual dining.
* Fine dining.
* Seafood.
* Local cuisine.
* International cuisine.
* Coffee.
* Desserts.
* View restaurants.
* Unique dining experiences.

## Shopping and events

* Malls.
* Local markets.
* Seasonal markets.
* Exhibitions.
* Festivals.
* Concerts.
* Temporary events.

---

# 23. READY-MADE PLANS

# الخطط الجاهزة

Create curated editorial plans including:

* جدة بأقل من 100 ريال.
* طلعة بعد الدوام.
* ساعتان في جدة.
* يوم عائلي داخلي.
* ألعاب وعشاء.
* بحر وغروب.
* موعد رومانسي.
* يوم كامل للسائح.
* جولة تاريخية في البلد.
* خطة قريبة من المطار.
* خطة بدون حجز.
* خطة للأطفال.
* خطة للمراهقين.
* خطة فخمة.
* أماكن مجانية.
* خطة وقت الحر.
* خطة يوم ممطر.
* خطة آخر الليل.
* خطة صباحية.
* فطور ونشاط.
* تجربة بحرية.

Ready plans must be editable from the admin panel.

---

# 24. OFFERS SYSTEM

# نظام العروض

Each offer must include:

* Offer title.
* Business.
* Description.
* Original price.
* Discounted price.
* Percentage or amount saved.
* Start date.
* End date.
* Valid days.
* Valid hours.
* Terms.
* Redemption method.
* Promo code.
* Official source.
* Verification status.
* Last verified date.
* Target audience.
* Applicable budget category.

Expired offers must automatically disappear from public pages.

Display:

> تم التحقق من العرض بتاريخ…

Provide:

> العرض غير متوفر؟ بلّغنا

Never show an offer without a visible expiration date or validity status.

---

# 25. ADVERTISING SYSTEM

# نظام الإعلانات

Create a transparent advertising system.

Advertising types:

## 25.1 Sponsored place

A business may appear in a relevant category section.

Label clearly:

> إعلان

or:

> برعاية

## 25.2 Sponsored plan

A business may sponsor a complete plan.

Example:

> خطة بحر وعشاء — برعاية [اسم المكان]

## 25.3 Sponsored offer

A promoted offer appears in the offers section.

## 25.4 Featured business profile

A business receives:

* Larger photo gallery.
* Video.
* Priority support.
* Promotional CTA.
* Additional analytics.

## 25.5 Social media campaign

The business purchases:

* A featured video.
* A plan built around its venue.
* Instagram or TikTok content.
* Campaign tracking.

Advertising rules:

* Paid placement must never override hard user requirements.
* A luxury restaurant must not appear in an economical plan.
* A distant venue must not appear when the user requested nearby options.
* Sponsored content must be clearly labeled.
* Limit sponsored content frequency.
* Do not allow the same advertiser to dominate multiple screens.
* Organic recommendations must remain available.

---

# 26. BUSINESS PORTAL

# بوابة أصحاب الأعمال

Business owners can:

* Create a business account.
* Request ownership of a place.
* Submit official verification.
* Update contact details.
* Update opening hours.
* Upload images.
* Add menu or ticket links.
* Add offers.
* Purchase advertising.
* Request sponsored plans.
* View analytics.
* Respond to information reports.

Verification methods:

* Official business email.
* Published business phone.
* Commercial document.
* Manual administrator review.

Business dashboard metrics:

* Profile views.
* Saves.
* Map opens.
* Website clicks.
* Phone clicks.
* Offer views.
* Offer redemptions.
* Plans containing the business.
* Shares.
* Campaign cost.
* Campaign performance.

---

# 27. ADVERTISING PACKAGES

# باقات الإعلانات

Create three configurable packages.

## Starter Visibility

Includes:

* Verified profile.
* Extra images.
* Featured category appearance.
* Monthly analytics.

## Offers Growth

Includes:

* Everything in Starter.
* Multiple active offers.
* Featured offer placement.
* Relevant audience targeting.
* Offer-performance analytics.

## Sponsored Experience

Includes:

* Everything in previous packages.
* Sponsored itinerary.
* Social media feature.
* Campaign landing page.
* Tracking link.
* Detailed performance report.

Do not hard-code package prices. Allow administrators to control pricing.

---

# 28. SOCIAL MEDIA INTEGRATION

# التكامل مع التواصل الاجتماعي

Prepare the website for:

* TikTok.
* Instagram.
* Snapchat.
* X.
* Threads.
* YouTube Shorts.
* WhatsApp sharing.

Use the same username where possible:

`@weshalkhutta`

Create optimized social metadata for every plan and place:

* Open Graph title.
* Description.
* Image.
* Arabic and English variants.
* Share URL.
* Campaign tracking parameters.

Create a social landing-page system.

Examples:

* `/ar/campaign/100-riyal-jeddah`
* `/ar/campaign/weekend-plan`
* `/ar/campaign/family-indoor`
* `/ar/campaign/creator-name`

Track:

* Campaign.
* Platform.
* Creator.
* Advertisement.
* Content variation.

---

# 29. SOCIAL CONTENT STRATEGY

# خطة محتوى التواصل

The platform’s social accounts must not behave like generic restaurant-review pages.

The content should focus on complete plans.

Content pillars:

## Budget plans

* جدة بـ50 ريال.
* جدة بـ100 ريال.
* نفس الطلعة بثلاث ميزانيات.
* يوم كامل بأقل ميزانية.

## Time-based plans

* ساعتان فقط.
* بعد الدوام.
* خطة الصباح.
* خطط آخر الليل.
* خطة نهاية الأسبوع.

## Audience plans

* للأصدقاء.
* للعائلة.
* للأطفال.
* للسياح.
* للأزواج.
* للشخص الواحد.

## Weather and environment plans

* أماكن داخلية.
* خطط وقت الحر.
* خطط البحر.
* خطط الغروب.
* خطط اليوم الممطر.

## Interactive content

* اكتب ميزانيتك ونرتّب لك خطة.
* اختاروا الخطة الأولى أو الثانية.
* غيّروا المطعم.
* كم تتوقعون سعر هذه الطلعة؟
* وين نروح الأسبوع الجاي؟

Build an admin content calendar containing:

* Platform.
* Publish date.
* Content pillar.
* Caption.
* Video hook.
* Places used.
* Campaign URL.
* Status.
* Results.

---

# 30. SAMPLE SOCIAL BIO

# وصف حسابات التواصل

Arabic:

> محتار وين تروح في جدة؟
> خطط جاهزة حسب وقتك وميزانيتك 🌊
> رتّب طلعتك من هنا ↓

English:

> Jeddah plans based on your time, mood, and budget.
> Your next outing starts here ↓

---

# 31. SAMPLE ADVERTISEMENTS

# نماذج إعلانية

## Advertisement 1: Quick problem and solution

Arabic hook:

> محتارين وين تروحون الليلة؟

Body:

> اختاروا وقتكم وميزانيتكم، ووش الخطة يرتّب لكم النشاط والمطعم والمسار كامل.

CTA:

> رتّب خطتك

## Advertisement 2: Three budgets

Arabic hook:

> نفس الطلعة بثلاث ميزانيات.

Show:

* اقتصادية.
* موزونة.
* دلع.

CTA:

> شوف الخطة المناسبة لك

## Advertisement 3: Limited time

Arabic hook:

> عندكم ثلاث ساعات فقط؟

Body:

> عطونا موقعكم وجوّكم، ونجهّز لكم خطة قريبة وسريعة.

CTA:

> خطة على السريع

## English version

Hook:

> Only have three hours in Jeddah?

Body:

> Tell us your location, mood, and budget. We’ll build the complete outing.

CTA:

> Build My Plan

---

# 32. ADMIN PANEL

# لوحة الإدارة

Create a secure administration dashboard.

Admin sections:

* Overview.
* Places.
* Categories.
* Plans.
* Plan stops.
* Offers.
* Businesses.
* Ownership requests.
* Advertisements.
* Campaigns.
* Social content calendar.
* Users.
* Reports.
* Reviews.
* Analytics.
* Settings.
* Budget categories.
* Recommendation weights.
* Localization.
* Moderation logs.

Admin capabilities:

* Create, edit, archive, and publish places.
* Import places from CSV.
* Review duplicate places.
* Create plans using drag-and-drop.
* Reorder itinerary stops.
* Preview routes.
* View missing information.
* Track verification freshness.
* Approve business ownership.
* Approve offers.
* Schedule advertisements.
* Limit campaign impressions.
* Edit homepage sections.
* Edit budget thresholds.
* Manage Arabic and English copy.
* Export analytics.
* View audit logs.

Verification freshness indicators:

* Green: verified within 30 days.
* Amber: verification is becoming old.
* Red: outdated or reported.
* Gray: unverified.

---

# 33. DATABASE ARCHITECTURE

# هيكل قاعدة البيانات

Use a relational PostgreSQL database.

Create the following tables.

## cities

* id
* name_ar
* name_en
* slug
* timezone
* active
* created_at
* updated_at

## districts

* id
* city_id
* name_ar
* name_en
* slug
* latitude
* longitude
* service_zone
* active

## users

* id
* auth_user_id
* display_name
* avatar_url
* preferred_language
* default_district_id
* account_type
* onboarding_completed
* created_at
* updated_at

## user_preferences

* id
* user_id
* default_budget_level
* default_budget_amount
* preferred_moods
* preferred_categories
* group_types
* indoor_preference
* outdoor_preference
* accessibility_required
* notification_preferences
* location_storage_consent

## businesses

* id
* owner_user_id
* business_name
* commercial_name
* verification_status
* verification_method
* verified_at
* contact_email
* contact_phone
* subscription_plan
* active

## places

* id
* city_id
* district_id
* business_id
* name_ar
* name_en
* slug
* short_description_ar
* short_description_en
* full_description_ar
* full_description_en
* category_id
* latitude
* longitude
* address_ar
* address_en
* price_min
* price_max
* average_price_per_person
* visit_duration_minutes
* indoor
* outdoor
* family_friendly
* kids_friendly
* couples_friendly
* friends_friendly
* tourist_friendly
* accessibility_supported
* reservation_required
* parking_status
* parking_notes_ar
* parking_notes_en
* age_minimum
* official_website
* official_phone
* menu_or_ticket_url
* instagram_url
* tiktok_url
* external_place_id
* verification_status
* last_verified_at
* active
* created_at
* updated_at

## categories

* id
* parent_id
* name_ar
* name_en
* slug
* icon
* sort_order
* active

## place_images

* id
* place_id
* image_url
* alt_ar
* alt_en
* source_type
* photographer
* copyright_status
* sort_order

## opening_hours

* id
* place_id
* day_of_week
* open_time
* close_time
* closed
* seasonal_label
* effective_from
* effective_until

## offers

* id
* place_id
* title_ar
* title_en
* description_ar
* description_en
* original_price
* offer_price
* promo_code
* start_at
* end_at
* valid_days
* terms_ar
* terms_en
* redemption_method
* source_url
* verification_status
* last_verified_at
* sponsored
* active

## plans

* id
* city_id
* title_ar
* title_en
* slug
* description_ar
* description_en
* plan_type
* budget_level
* estimated_price_min
* estimated_price_max
* estimated_duration_minutes
* group_types
* moods
* indoor_ratio
* outdoor_ratio
* hero_image_url
* editorial
* sponsored
* sponsor_business_id
* status
* created_by
* published_at
* created_at
* updated_at

## plan_stops

* id
* plan_id
* place_id
* stop_order
* suggested_start_time
* visit_duration_minutes
* estimated_cost_min
* estimated_cost_max
* travel_minutes_from_previous
* notes_ar
* notes_en
* alternative_place_id

## generated_plans

* id
* user_id
* guest_session_id
* city_id
* district_id
* group_type
* group_size
* duration_minutes
* moods
* environment_preference
* budget_level
* budget_amount
* preferences_json
* result_json
* confidence_score
* saved
* created_at
* expires_at

## saved_plans

* id
* user_id
* generated_plan_id
* editorial_plan_id
* custom_title
* created_at

## favorites

* id
* user_id
* place_id
* created_at

## plan_shares

* id
* plan_id
* share_token
* owner_user_id
* permissions
* expires_at
* created_at

## plan_votes

* id
* share_id
* voter_name
* user_id
* vote_type
* stop_id
* suggestion_text
* created_at

## reports

* id
* reporter_user_id
* place_id
* offer_id
* report_type
* description
* status
* reviewed_by
* reviewed_at
* created_at

## reviews

* id
* user_id
* place_id
* plan_id
* rating
* price_accuracy
* information_accuracy
* completed
* comment
* moderation_status
* created_at

## advertisements

* id
* business_id
* campaign_id
* ad_type
* title_ar
* title_en
* creative_url
* destination_url
* placement
* target_districts
* target_categories
* target_budget_levels
* start_at
* end_at
* impression_limit
* status
* sponsored_label

## campaigns

* id
* business_id
* name
* platform
* budget
* start_at
* end_at
* tracking_code
* status
* impressions
* clicks
* saves
* map_opens
* conversions

## analytics_events

* id
* user_id
* guest_session_id
* event_name
* entity_type
* entity_id
* campaign_id
* properties_json
* created_at

## social_content

* id
* title
* platform
* content_pillar
* hook
* caption_ar
* caption_en
* media_url
* campaign_url
* scheduled_at
* published_at
* status
* performance_json

## system_settings

* id
* setting_key
* setting_value
* updated_by
* updated_at

Add indexes for:

* City.
* District.
* Category.
* Coordinates.
* Active status.
* Verification status.
* Offer expiration.
* Price.
* Opening times.
* Search.
* Slugs.

Use geospatial support for proximity queries.

---

# 34. AUTHORIZATION AND SECURITY

# الصلاحيات والأمان

Roles:

* Guest.
* User.
* Business owner.
* Content editor.
* Moderator.
* Administrator.
* Super administrator.

Requirements:

* Use secure server-side authorization.
* Never trust client-side roles.
* Apply row-level database policies.
* Protect admin routes.
* Protect business analytics.
* Prevent one business from editing another business.
* Rate-limit authentication and public forms.
* Validate all input.
* Sanitize user-generated content.
* Restrict file types and upload sizes.
* Store secrets only in environment variables.
* Add audit logs for sensitive changes.
* Use secure password and session management.
* Support account deletion.
* Provide consent controls for location storage.
* Do not store precise location longer than necessary.
* Allow users to use approximate areas instead.

---

# 35. SEARCH

# البحث

Create a fast bilingual search system.

Search should support:

* Arabic names.
* English names.
* Alternative spelling.
* Districts.
* Categories.
* Moods.
* Plan titles.
* Place descriptions.

Examples:

* بحر.
* بولينغ.
* فطور.
* مكان عائلي.
* Al Balad.
* Corniche.
* مكان قريب.
* طلعة رخيصة.

Search results should group:

* Places.
* Plans.
* Categories.
* Offers.

---

# 36. SEO

# تحسين محركات البحث

Create indexable pages for:

* Best family activities in Jeddah.
* Affordable Jeddah plans.
* Jeddah under 100 SAR.
* Indoor activities in Jeddah.
* Things to do in Jeddah at night.
* Tourist itinerary in Jeddah.
* Historic Jeddah plan.
* Jeddah entertainment.
* Jeddah restaurants by district.
* Jeddah weekend plans.

Requirements:

* Unique titles and descriptions.
* Arabic and English metadata.
* Canonical URLs.
* Alternate-language URLs.
* Structured data where appropriate.
* Sitemap.
* Robots configuration.
* Social sharing metadata.
* Fast server-rendered content.
* Clean semantic headings.
* Descriptive image alt text.
* Breadcrumbs.

Do not create thousands of low-quality automated pages.

---

# 37. ANALYTICS

# التحليلات

Track events including:

* Home page viewed.
* Quick plan started.
* Quick plan step completed.
* Plan generated.
* Plan opened.
* Plan saved.
* Plan shared.
* Place replaced.
* Cheaper plan requested.
* Nearby plan requested.
* Map opened.
* Booking link clicked.
* Offer opened.
* Offer redeemed.
* Business page opened.
* Advertisement viewed.
* Advertisement clicked.
* Account created.
* User returned.
* Report submitted.

Primary product metric:

> Number of plans saved, shared, or acted upon each week.

Important funnels:

1. Home page visit.
2. Planner start.
3. Planner completion.
4. Result opened.
5. Saved or shared.
6. Map opened.
7. Returned within 30 days.

Do not collect unnecessary personal data.

---

# 38. NOTIFICATIONS

# الإشعارات

Support:

* Email notifications.
* In-app notifications.
* Optional browser notifications later.

Notification examples:

* Saved offer expires soon.
* A followed place has a new offer.
* Shared group voted on a plan.
* Business ownership request was approved.
* Place information needs verification.
* New weekend plan available.

Users must be able to disable each notification category.

---

# 39. PERFORMANCE

# الأداء

Requirements:

* Fast initial load.
* Optimized images.
* Lazy loading.
* Server-render important public pages.
* Use skeleton loading states.
* Avoid loading maps until required.
* Avoid unnecessary route calculations.
* Cache owned content safely.
* Paginate large lists.
* Optimize database queries.
* Prevent layout shifts.
* Support slow mobile connections.
* Provide graceful error handling.

Do not preload heavy maps or videos on every page.

---

# 40. ACCESSIBILITY

# سهولة الوصول

Follow modern accessibility practices.

Requirements:

* Keyboard navigation.
* Visible focus indicators.
* Screen-reader labels.
* Accessible forms.
* Sufficient contrast.
* Large touch targets.
* Reduced-motion support.
* Proper heading order.
* Descriptive button labels.
* Alternative text.
* Error messages connected to fields.
* Do not communicate status using color alone.

---

# 41. EMPTY, ERROR, AND LOADING STATES

# حالات الانتظار والخطأ

Create branded empty states.

## No plans found

Arabic:

> ما لقينا خطة مطابقة 100%، لكن نقدر نوسّع المسافة أو الميزانية شوي.

Buttons:

* وسّع المسافة.
* زد الميزانية.
* جرّب جو ثاني.

## No saved plans

Arabic:

> للحين ما حفظت أي خطة. خلّنا نرتّب أول طلعة.

Button:

> سوّ لي خطة

## Expired offer

Arabic:

> انتهى هذا العرض، لكن عندنا بدائل قريبة.

## Loading

Use an animated route line with copy:

> نرتّب الأماكن والمسار…

---

# 42. TECHNOLOGY PREFERENCE

# التقنية المقترحة

Use a modern, maintainable web stack.

Preferred approach:

* Next.js with TypeScript.
* Modern routing architecture.
* PostgreSQL database.
* Supabase for database, authentication, and file storage.
* Geospatial database extension for location queries.
* Tailwind CSS or an equivalent token-based styling system.
* Reusable accessible component library.
* Server-side rendering for public content.
* Secure server functions for protected actions.
* Map provider abstraction.
* Analytics provider abstraction.
* Email provider abstraction.

Do not tightly couple the application to one external map provider.

Create adapter interfaces so providers can be replaced later.

Use the latest stable compatible package versions available in the development environment.

---

# 43. APPLICATION STRUCTURE

# هيكل المشروع

Suggested structure:

```text
app/
  [locale]/
    page
    quick-plan/
    plans/
    plans/[slug]/
    places/
    places/[slug]/
    entertainment/
    restaurants/
    offers/
    tourists/
    account/
    favorites/
    saved-plans/
    business/
    advertise/
    admin/

components/
  brand/
  navigation/
  planning/
  plans/
  places/
  offers/
  maps/
  business/
  admin/
  analytics/
  localization/

lib/
  auth/
  database/
  recommendations/
  routing/
  maps/
  analytics/
  localization/
  validation/
  permissions/

database/
  migrations/
  policies/
  seeds/

public/
  brand/
  icons/
  placeholders/
```

---

# 44. DEMO DATA

# البيانات التجريبية

Seed the application with clearly fictional demonstration venues.

Do not present fictional businesses as real.

Create at least:

* 20 entertainment places.
* 15 restaurants.
* 10 cafés and dessert places.
* 5 cultural attractions.
* 5 outdoor locations.
* 10 active demo offers.
* 15 ready-made plans.

Spread demo locations across Jeddah zones.

Include:

* Economical places.
* Medium-priced places.
* Premium places.
* Family options.
* Friends options.
* Tourist options.
* Indoor and outdoor options.

Label all seed content:

> بيانات تجريبية

or:

> Demo listing

---

# 45. HOMEPAGE MICROCOPY

# نصوص جاهزة للواجهة

Hero:

> محتار وين تروح اليوم؟

Subtitle:

> قل لنا وقتك وميزانيتك وجوّكم، ونرتّب لكم طلعة كاملة داخل جدة.

Primary CTA:

> سوّ لي خطة على السريع

Secondary CTA:

> استكشف جدة

Budget section heading:

> ثلاث ميزانيات، وخطط تناسب كل يوم

Entertainment heading:

> وش ودّكم تسوون؟

Popular plans heading:

> خطط جاهزة ومجرّبة

Offers heading:

> عروض تستاهل الطلعة

Business CTA heading:

> عندك مكان يستاهل الناس تعرفه؟

Business CTA body:

> أضف مكانك، حدّث معلوماتك، وانشر عروضك لجمهور يبحث عنك فعلًا.

Button:

> انضم كشريك

---

# 46. ONBOARDING

# تعريف المستخدم بالموقع

Keep onboarding optional and short.

Ask:

* What language do you prefer?
* Which Jeddah area is nearest?
* What is your usual budget?
* What types of plans do you like?
* Who do you usually go out with?

Allow:

> تخطي الآن

Do not block the main application.

---

# 47. PRIVACY EXPERIENCE

# تجربة الخصوصية

Create:

* Privacy policy.
* Terms of use.
* Cookie preferences.
* Location consent.
* Marketing consent.
* Data download.
* Account deletion.
* Notification preferences.

Location message:

Arabic:

> نستخدم موقعك فقط لنقترح أماكن أقرب. تقدر تختار الحي بدل مشاركة موقعك الدقيق.

English:

> We use your location only to recommend nearby places. You may select an area instead of sharing your precise location.

---

# 48. TESTING

# الاختبارات

Create tests for:

* Authentication.
* Guest plan generation.
* Budget filtering.
* Opening-hours filtering.
* Distance filtering.
* Saving plans.
* Sharing plans.
* Business ownership permissions.
* Advertisement visibility.
* Offer expiration.
* Arabic RTL.
* English LTR.
* Admin permissions.
* Mobile navigation.
* Broken images.
* Empty states.
* Form validation.

Include basic end-to-end tests for the main user journey:

1. Open homepage.
2. Start quick plan.
3. Select Jeddah area.
4. Select group.
5. Select time.
6. Select mood.
7. Select budget.
8. Generate results.
9. Open plan.
10. Sign in.
11. Save plan.
12. Share plan.

---

# 49. DELIVERY REQUIREMENTS

# متطلبات التسليم

Deliver:

1. Fully functional responsive web application.
2. Arabic RTL and English LTR interfaces.
3. Complete design system.
4. Working quick-plan flow.
5. Recommendation-engine structure.
6. Three-budget result system.
7. Authentication.
8. User profile and saved plans.
9. Place directory.
10. Offers.
11. Sharing and voting.
12. Business portal.
13. Advertising system.
14. Admin dashboard.
15. Database migrations.
16. Row-level security policies.
17. Seed data.
18. Environment-variable example.
19. Installation instructions.
20. Deployment instructions.
21. Testing instructions.
22. Clear README.
23. No non-functional buttons.
24. No lorem ipsum.
25. No unfinished placeholder sections.

If an external API key is unavailable, build a functional mock adapter and explain exactly where the key must be added.

---

# 50. IMPLEMENTATION ORDER

# ترتيب التنفيذ

Build in this sequence:

## Phase 1: Foundation

* Project setup.
* Localization.
* Design tokens.
* Database schema.
* Authentication.
* Navigation.

## Phase 2: Public browsing

* Homepage.
* Categories.
* Places.
* Place details.
* Ready plans.
* Offers.

## Phase 3: Core planner

* Planning questions.
* Filtering.
* Scoring.
* Route ordering.
* Three result options.
* Plan details.

## Phase 4: Accounts

* Saved plans.
* Favorites.
* Plan history.
* User preferences.
* Sharing and voting.

## Phase 5: Business and advertising

* Business ownership.
* Offers.
* Campaigns.
* Advertising.
* Business analytics.

## Phase 6: Administration

* Place management.
* Plan builder.
* Offer moderation.
* Business moderation.
* Campaign management.
* Analytics.
* Settings.

## Phase 7: Quality

* SEO.
* Accessibility.
* Performance.
* Security.
* Testing.
* Deployment documentation.

---

# 51. ACCEPTANCE CRITERIA

# شروط نجاح المشروع

The project is accepted only when:

* The Arabic interface is fully RTL.
* The English interface is fully LTR.
* A guest can create a plan without signing in.
* Users receive up to three budget-based plans.
* Budget ranges are editable.
* Plans contain entertainment and food stops.
* Plans respect opening hours and user preferences.
* Plans avoid unreasonable travel across Jeddah.
* Users can save and share plans.
* Users can replace an individual stop.
* Offers expire automatically.
* Sponsored content is clearly labeled.
* Business owners cannot edit other businesses.
* Admins can manage all core content.
* Mobile design is polished.
* All major buttons work.
* Demo content is clearly identified.
* No sensitive location is stored without consent.
* Public pages have Arabic and English metadata.
* The product feels custom-designed for Jeddah.
* The interface does not resemble a generic template.
* The visual route motif is used consistently.
* The application is ready for real verified content after launch.

---

# 52. FINAL DESIGN DIRECTION

# التوجيه النهائي للتصميم

The final website should feel like:

> A smart local friend from Jeddah who can organize your day in less than one minute.

It should be:

* Fast.
* Visual.
* Warm.
* Simple.
* Highly shareable.
* Local.
* Trustworthy.
* Useful before being decorative.

The most important action on every relevant page is:

> سوّ لي خطة

The website should consistently communicate:

> You do not need to search through hundreds of places.
> Tell us what you want, and we will organize the outing.

Arabic:

> ما تحتاج تدوّر بين مئات الأماكن.
> قل لنا وش تبغى، ونرتّب لك الخطة.


نفذ المشروع مرحله في مرحله وحافظ على الطابع الخاص بالمشروع

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/093c119d-0ee9-423f-8c5d-afd8b9d8d907).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
