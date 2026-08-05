import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Flame, Megaphone, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "أعلن مع جِدّاو | JEDDAW — باقات الشركاء وعروض الصيف" },
      {
        name: "description",
        content: "عندك مكان يستاهل يدخل خطط جِدّاو؟ حدّث معلومات مكانك، أضف عروضك، واظهر للآلاف من زوار وأهالي جدة يبحثون عن تجربة متميزة.",
      },
    ],
    links: [{ rel: "canonical", href: "/advertise" }],
  }),
  component: AdvertisePage,
});

export function AdvertisePage() {
  const { t, isRtl } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const packages = [
    {
      id: "p1",
      name: "🚀 باقة الانطلاق",
      badge: "للمحلات الناشئة",
      monthlyPrice: 490,
      yearlyPrice: 343,
      desc: "مثالية للمقاهي والمطاعم الناشئة للظهور المباشر في الخطط القريبة والبحث",
      features: [
        "إضافة المكان وتوثيق البيانات رسمياً بالمنصة",
        "الظهور في نتائج بحث الأحياء والخرائط القريبة",
        "تحديث أوقات العمل والأسعار والمنيو",
        "عرض الإيموجيات والشارات الخاصة بمكانك",
      ],
      featured: false,
    },
    {
      id: "p2",
      name: "💫 الباقة المتقدمة",
      badge: "الأكثر طلباً ⭐",
      monthlyPrice: 990,
      yearlyPrice: 693,
      desc: "خيار رائع للظهور في الخطط الموصى بها وتقديم العروض الحصرية وزيادة التفاعل",
      features: [
        "كل مميزات باقة الانطلاق الأساسية",
        "شارة 'اختيار جِدّاو' الفاخرة المعتمدة",
        "إضافة العروض والخصومات المباشرة للزوار",
        "أولوية التواجد في خيارات التبديل بالخطط",
        "تقرير إحصائيات التفاعل والزيارات الشهرية",
      ],
      featured: true,
    },
    {
      id: "p3",
      name: "🏆 الباقة الراعية VIP",
      badge: "أقصى انتشار وإعلانات ممولة 🔥",
      monthlyPrice: 1890,
      yearlyPrice: 1323,
      desc: "للعلامات التجارية الكبيرة والفعاليات التي تبحث عن أقصى انتشار وتواجد إعلاني في جدة",
      features: [
        "كل مميزات الباقة المتقدمة الفاخرة",
        "الظهور في كروت وتوصيات الصفحة الرئيسية",
        "إعلان ممول مميز في الخطط الجاهزة والويكند",
        "📢 حملات إعلانية ممولة ومستهدفة على منصات التواصل الاجتماعي (تيك توك، إنستغرام، وسناب شات)",
        "مدير حساب مخصص وتحديث فوري للمعلومات ودعم 24/7",
      ],
      featured: false,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#C96745]/15 px-4 py-1.5 text-xs font-black text-[#C96745] border border-[#C96745]/20">
          <Zap className="h-4 w-4" /> {t("businessHeader")}
        </span>
        <h1 className="mt-4 text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-5xl leading-tight">
          {t("businessTitle")}
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed font-semibold">
          {t("businessDesc")}
        </p>
      </div>

      {/* ===== Summer Offer Banner & Billing Toggle ===== */}
      <div className="mt-10 max-w-2xl mx-auto text-center">
        {/* Summer Special Banner */}
        <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] p-0.5 shadow-xl mb-6">
          <div className="rounded-[14px] bg-[#FAF6F0] dark:bg-[#1A2221] px-5 py-2.5 flex items-center gap-2 text-xs font-black text-[#252A28] dark:text-[#F5F1E8]">
            <Flame className="h-4 w-4 text-[#C96745] animate-bounce" />
            <span>☀️ عروض الصيف الخارقة — احصل على <span className="text-[#C96745] font-extrabold underline">خصم 30%</span> عند الاشتراك السنوي!</span>
          </div>
        </div>

        {/* Toggle Switch Pills */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EADECB] dark:bg-[#253230] p-1.5 border border-[#E2D3BE] dark:border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={`rounded-full px-6 py-2.5 text-xs font-black transition-all ${
              !isYearly
                ? "bg-[#C96745] text-white shadow-lift scale-105"
                : "text-[#6E716C] dark:text-[#B5B8B2] hover:text-[#252A28]"
            }`}
          >
            شهري 📅
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={`inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-black transition-all ${
              isYearly
                ? "bg-[#397C78] text-white shadow-lift scale-105"
                : "text-[#6E716C] dark:text-[#B5B8B2] hover:text-[#252A28]"
            }`}
          >
            <span>سنوي (عروض الصيف 🔥)</span>
            <span className="rounded-md bg-[#E4A23B] px-1.5 py-0.5 text-[10px] text-white font-extrabold">
              خصم 30%
            </span>
          </button>
        </div>
      </div>

      {/* ===== Packages Grid ===== */}
      <div className="mt-12 grid gap-8 md:grid-cols-3 items-stretch">
        {packages.map((pkg, i) => {
          const price = isYearly ? pkg.yearlyPrice : pkg.monthlyPrice;
          const savings = isYearly ? (pkg.monthlyPrice - pkg.yearlyPrice) * 12 : 0;

          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-7 md:p-8 flex flex-col justify-between hover-lift relative transition-all duration-300 ${
                pkg.featured
                  ? "bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] dark:from-[#1E2826] dark:via-[#192220] dark:to-[#1E2826] border-2 border-[#C96745] shadow-2xl ring-4 ring-[#C96745]/15 scale-[1.03]"
                  : "bg-white/90 dark:bg-[#1A2221] border border-[#E2D3BE] dark:border-white/10 shadow-lg"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Badge Tag */}
              {pkg.featured ? (
                <span className="absolute -top-4 start-1/2 -translate-x-1/2 rounded-full bg-[#C96745] px-5 py-1.5 text-xs font-black text-white shadow-lift border border-white/20">
                  {pkg.badge}
                </span>
              ) : (
                <span className="inline-block rounded-full bg-[#397C78]/15 text-[#397C78] dark:text-[#5EAAA5] px-3.5 py-1 text-[11px] font-extrabold mb-3 w-fit">
                  {pkg.badge}
                </span>
              )}

              <div>
                <h3 className="text-xl font-black text-[#252A28] dark:text-[#F5F1E8]">{pkg.name}</h3>
                <p className="mt-2 text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold leading-relaxed min-h-[36px]">
                  {pkg.desc}
                </p>

                {/* Price Display */}
                <div className="mt-6 border-y border-[#E2D3BE]/60 dark:border-white/10 py-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-black text-[#C96745]">
                      {price.toLocaleString()} ر.س
                    </span>
                    <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-bold">
                      / شهر {isYearly ? "(تدفع سنوياً)" : ""}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="mt-1 text-[11px] font-extrabold text-[#397C78] dark:text-[#5EAAA5] flex items-center gap-1">
                      ✨ توفير عروض الصيف: {savings.toLocaleString()} ر.س / سنوياً!
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3.5 text-xs">
                  {pkg.features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#252A28] dark:text-[#F5F1E8] font-bold">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#397C78] dark:text-[#5EAAA5] shrink-0 mt-0.5" />
                      <span className={feat.includes("سناب شات") ? "text-[#C96745] font-extrabold" : ""}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() =>
                  alert(
                    `مرحباً بك! اخترت ${pkg.name} (${isYearly ? "سنوي مع خصم 30%" : "شهري"}). سنتواصل معك فوراً لتأكيد انضمامك!`
                  )
                }
                className={`mt-8 w-full rounded-full py-3.5 text-center text-xs font-black transition-all min-h-[50px] shadow-lift ${
                  pkg.featured
                    ? "bg-[#C96745] text-white hover:bg-[#b55837] animate-pulse-glow"
                    : "bg-[#397C78] text-white hover:bg-[#2e6562]"
                }`}
              >
                انضم الآن واضف مكانك 🚀
              </button>
            </div>
          );
        })}
      </div>

      {/* Safety & Guarantee Badge */}
      <div className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] bg-white dark:bg-[#1A2221] p-5 rounded-2xl border border-[#E2D3BE] dark:border-white/10 shadow-sm max-w-2xl mx-auto">
        <ShieldCheck className="h-6 w-6 text-[#397C78] shrink-0" />
        <span>جميع الباقات تضمن توثيق مكانك رسمياً، تحديث الصور والبيانات بأي وقت، وتغطية استثمارك بزيارات حقيقية!</span>
      </div>
    </div>
  );
}