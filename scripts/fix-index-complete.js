import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "src/routes/index.tsx");
let content = fs.readFileSync(file, "utf8");

// Section 18 clean replacement using t()
const oldSection18Regex = /\{\/\* ===== SECTION 18: HOW IT WORKS [\s\S]*?<\/section>/;

const newSection18 = `{/* ===== SECTION 18: HOW IT WORKS ("كيف جِدّاو يرتّبها؟") ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <span className="rounded-full bg-[#C96745]/15 px-4 py-1 text-xs font-extrabold text-[#C96745] mb-2 inline-block">
            ⚡ {isRtl ? "بساطة وسرعة" : "Simple & Instant"}
          </span>
          <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-1 max-w-md mx-auto">
            {isRtl
              ? "3 خطوات بسيطة للحصول على خطة طلعة جاهزة وموزونة بالكامل"
              : "3 simple steps to get a fully curated & tailored outing plan"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745] text-white text-lg font-black mb-4">
              1
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {t("howStep1Title")}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              {t("howStep1Desc")}
            </p>
          </div>

          {/* Step 2 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#397C78] text-white text-lg font-black mb-4">
              2
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {t("howStep2Title")}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              {t("howStep2Desc")}
            </p>
          </div>

          {/* Step 3 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E4A23B] text-white text-lg font-black mb-4">
              3
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {t("howStep3Title")}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              {t("howStep3Desc")}
            </p>
          </div>
        </div>
      </section>`;

// Section 11 clean replacement
const oldSection11Regex = /\{\/\* ===== SECTION 11: WHY JEDDAW [\s\S]*?<\/section>/;

const newSection11 = `{/* ===== SECTION 11: WHY JEDDAW — PRODUCT DIFFERENTIATION ===== */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="rounded-3xl bg-gradient-to-r from-[#091C1A] via-[#122A27] to-[#1E423E] text-[#FAF6F0] p-7 md:p-10 shadow-2xl border border-white/15 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745]/20 px-4 py-1 text-xs font-extrabold text-[#FF9D7A] border border-[#C96745]/30 mb-3">
              💡 {isRtl ? "فرق جِدّاو عن باقي التطبيقات" : "The JEDDAW Difference"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {isRtl
                ? "المواقع الثانية تعطيك أماكن. جِدّاو يرتّب لك الطلعة كاملة"
                : "Other platforms list places. JEDDAW builds your complete outing"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional Apps Side */}
            <div className="rounded-2xl bg-black/30 p-5 border border-white/10 text-start">
              <span className="text-xs font-extrabold text-white/50 block mb-2">
                {isRtl ? "❌ التطبيقات العادية" : "❌ Standard Apps"}
              </span>
              <p className="text-sm font-bold text-white/70 leading-relaxed">
                {isRtl
                  ? "تعطيك قائمة خيارات طويلة، فتضيع بين التقييمات والانستقرام وتظل محتار وين تروح أول"
                  : "Provides long unorganized lists, leaving you lost between reviews and social media without a clear route"}
              </p>
            </div>

            {/* JEDDAW Side */}
            <div className="rounded-2xl bg-[#C96745]/20 p-5 border border-[#C96745]/40 text-start">
              <span className="text-xs font-extrabold text-[#FF9D7A] block mb-2">
                {isRtl ? "✨ جِدّاو الذكي" : "✨ Smart JEDDAW"}
              </span>
              <p className="text-sm font-black text-white leading-relaxed">
                {isRtl
                  ? "يعطيك خطة متسلسلة وموزونة: مطعم مناسب 🍽️ + قهوة روقان ☕ + فعالية حماسية 🏎️ مع مسار الخريطة والوقت"
                  : "Delivers a complete curated itinerary: dining 🍽️ + specialty coffee ☕ + action 🏎️ with maps and travel times"}
              </p>
            </div>
          </div>
        </div>
      </section>`;

// Fix any leftover question mark blocks in District showcase (Section 15)
const oldSection15Regex = /\{\/\* ===== SECTION 15: CURATED JEDDAH DISTRICTS SHOWCASE [\s\S]*?<\/section>/;
const newSection15 = `{/* ===== SECTION 15: CURATED JEDDAH DISTRICTS SHOWCASE ===== */}
      <section className="bg-[#FAF6F0] dark:bg-[#161B1A] py-16 border-t border-b border-[#E2D3BE]/60 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <span className="rounded-full bg-[#397C78]/15 px-4 py-1 text-xs font-extrabold text-[#397C78] dark:text-[#5EAAA5] mb-2 inline-block">
              🗺️ {isRtl ? "استكشف أحياء جدة البارزة" : "Featured Jeddah Neighborhoods"}
            </span>
            <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8]">
              {isRtl ? "لكل حي بجدة نكهة وطلعة خاصة 🌊" : "Every District Has a Unique Vibe 🌊"}
            </h2>
            <p className="text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-1">
              {isRtl
                ? "من بحر أبحر الساحر إلى عراقة حارات البلد التاريخية"
                : "From Obhur's turquoise beaches to historic Al Balad heritage"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* District Card 1: Corniche & Sunset */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="الكورنيش والواجهة البحرية"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">🏖️ 45+ {isRtl ? "وجهة" : "spots"}</span>
                <h3 className="text-xl font-black">{isRtl ? "الكورنيش والواجهة البحرية" : "Corniche & Waterfront"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "غروب، مشي، بحر وكافيهات إطلالة" : "Sunset walks, sea view cafes & dining"}
                </p>
              </div>
            </div>

            {/* District Card 2: Obhur Marinas & Resorts */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                alt="أبحر الشمالية والمنتجعات"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">⛵ 30+ {isRtl ? "منتجع ونادي" : "resorts"}</span>
                <h3 className="text-xl font-black">{isRtl ? "أبحر الشمالية واليخوت" : "North Obhur & Marinas"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "شاطئ، أنشطة بحرية، شاليهات ومنتجعات" : "Private beach resorts & water sports"}
                </p>
              </div>
            </div>

            {/* District Card 3: Historic Al Balad */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
                alt="البلد التاريخية"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">🏛️ 25+ {isRtl ? "معلم وتراث" : "heritage spots"}</span>
                <h3 className="text-xl font-black">{isRtl ? "البلد والتراث التاريخي" : "Historic Al Balad"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "تاريخ، أسواق شعبية، ومشي وحجازيات" : "Traditional Hijazi houses & heritage walk"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>`;

content = content.replace(oldSection18Regex, newSection18);
content = content.replace(oldSection11Regex, newSection11);
content = content.replace(oldSection15Regex, newSection15);

fs.writeFileSync(file, content, "utf8");
console.log("Successfully fixed index.tsx with regex replacement!");
