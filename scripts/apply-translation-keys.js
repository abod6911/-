import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "src/routes/index.tsx");
let content = fs.readFileSync(file, "utf8");

// Replace Section 18 How It Works text with t() lookups
const oldSection18 = `        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745] text-white text-lg font-black mb-4">
              1
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {isRtl ? "قل لنا جوّك" : "Tell Us Your Vibe"}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              اختر نوع الطلعة (روقان، عشاء بحري، عائلات، أو حماس مع الشلة).
            </p>
          </div>

          {/* Step 2 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#397C78] text-white text-lg font-black mb-4">
              2
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {isRtl ? "حدد ميزانيتك ووقتك" : "Set Time & Budget"}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              حدد الميزانية للشخص ووقت البداية والحي المفضل في جدة.
            </p>
          </div>

          {/* Step 3 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E4A23B] text-white text-lg font-black mb-4">
              3
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {isRtl ? "خذ خطتك كاملة" : "Get Full Itinerary"}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              احصل على مسار متسلسل ومجهز بالخرائط وحاسبة الفاتورة ومشاركة الواتساب.
            </p>
          </div>
        </div>`;

const newSection18 = `        <div className="grid gap-6 md:grid-cols-3">
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
        </div>`;

// Replace Section 11 Why JEDDAW text
const oldSection11 = `<h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {isRtl
                ? "المواقع الثانية تعطيك أماكن. جِدّاو يرتّب لك الطلعة كاملة."
                : "Other platforms list places. JEDDAW builds your complete outing."}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional Apps Side */}
            <div className="rounded-2xl bg-black/30 p-5 border border-white/10 text-start">
              <span className="text-xs font-extrabold text-white/50 block mb-2">❌ التطبيقات العادية</span>
              <p className="text-sm font-bold text-white/70 leading-relaxed">
                تعطيك قائمة خيارات طويلة، فتضيع بين التقييمات والانستقرام وتظل محتار وين تروح أول.
              </p>
            </div>

            {/* JEDDAW Side */}
            <div className="rounded-2xl bg-[#C96745]/20 p-5 border border-[#C96745]/40 text-start">
              <span className="text-xs font-extrabold text-[#FF9D7A] block mb-2">✨ جِدّاو الذكي</span>
              <p className="text-sm font-black text-white leading-relaxed">
                يعطيك خطة متسلسلة وموزونة: مطعم مناسب 🍽️ + قهوة روقان ☕ + فعالية حماسية 🏎️ مع مسار الخريطة والوقت.
              </p>
            </div>
          </div>`;

const newSection11 = `<h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
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
                  : "Gives long unorganized lists, leaving you lost between reviews and social media without a clear route"}
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
          </div>`;

content = content.replace(oldSection18, newSection18);
content = content.replace(oldSection11, newSection11);

fs.writeFileSync(file, content, "utf8");
console.log("Successfully updated index.tsx with node UTF-8 writing!");
