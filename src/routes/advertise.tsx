import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Flame, Megaphone, PhoneCall, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
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
  const [isYearly, setIsYearly] = useState(true); // Default to yearly summer discount

  const ownerWhatsapp = "966572563602";

  const packages = [
    {
      id: "p1",
      nameAr: "🚀 باقة الانطلاق",
      nameEn: "🚀 Starter Package",
      badgeAr: "للمحلات والمقاهي الناشئة",
      badgeEn: "For Emerging Spots & Cafes",
      monthlyPrice: 490,
      yearlyPrice: 343,
      descAr: "مثالية للمقاهي والمطاعم الناشئة للظهور المباشر في الخطط القريبة والبحث في الأحياء",
      descEn: "Ideal for emerging cafes & spots to appear in local search & nearby routes.",
      featuresAr: [
        "إضافة المكان وتوثيق البيانات رسمياً بالمنصة",
        "الظهور في نتائج بحث الأحياء والخرائط القريبة",
        "تحديث أوقات العمل والأسعار والمنيو الإلكتروني",
        "عرض الإيموجيات والشارات الخاصة بمكانك",
      ],
      featuresEn: [
        "Official place listing & verified platform data",
        "Prominence in local district search & nearby maps",
        "Update opening hours, pricing & digital menu",
        "Custom place badge & emoji highlights",
      ],
      featured: false,
    },
    {
      id: "p2",
      nameAr: "💫 الباقة المتقدمة",
      nameEn: "💫 Growth Package",
      badgeAr: "الأكثر طلباً واختياراً ⭐",
      badgeEn: "Most Popular Choice ⭐",
      monthlyPrice: 990,
      yearlyPrice: 693,
      descAr: "خيار رائع للظهور في الخطط الموصى بها وتقديم العروض الحصرية وزيادة التفاعل والزيارات",
      descEn: "Great option to feature in recommended plans, offer exclusive deals & boost engagement.",
      featuresAr: [
        "كل مميزات باقة الانطلاق الأساسية",
        "شارة 'اختيار جِدّاو' الفاخرة المعتمدة",
        "إضافة العروض والخصومات المباشرة للزوار",
        "أولوية التواجد في خيارات التبديل بالخطط",
        "تقرير إحصائيات التفاعل والزيارات الشهرية",
      ],
      featuresEn: [
        "All features from Starter Package",
        "Verified 'JEDDAW Choice' badge",
        "Publish direct deals & discount codes",
        "Priority placement in plan swap options",
        "Monthly engagement & traffic analytics report",
      ],
      featured: true,
    },
    {
      id: "p3",
      nameAr: "🏆 الباقة الراعية VIP",
      nameEn: "🏆 VIP Sponsored Package",
      badgeAr: "أقصى انتشار وإعلانات ممولة 📢",
      badgeEn: "Maximum Reach & Sponsored Ads 📢",
      monthlyPrice: 1890,
      yearlyPrice: 1323,
      descAr: "للعلامات التجارية الكبيرة والفعاليات التي تبحث عن أقصى انتشار وتواجد إعلاني في جدة",
      descEn: "For established brands & events looking for maximum reach across social media & JEDDAW.",
      featuresAr: [
        "كل مميزات الباقة المتقدمة الفاخرة",
        "الظهور في كروت وتوصيات الصفحة الرئيسية",
        "إعلان ممول مميز في الخطط الجاهزة والويكند",
        "📢 حملات إعلانية ممولة ومستهدفة على منصات التواصل الاجتماعي (تيك توك، إنستغرام، وسناب شات)",
        "مدير حساب مخصص وتحديث فوري للمعلومات ودعم 24/7",
      ],
      featuresEn: [
        "All features from Growth Package",
        "Featured homepage placement & priority cards",
        "Sponsored ads in ready weekend itineraries",
        "📢 Targeted ad campaigns on TikTok, Instagram & Snapchat",
        "Dedicated account manager & 24/7 priority support",
      ],
      featured: false,
    },
  ];

  const handleJoinPackage = (pkg: (typeof packages)[0]) => {
    const price = isYearly ? pkg.yearlyPrice : pkg.monthlyPrice;
    const planType = isYearly
      ? isRtl
        ? "اشتراك سنوي (خصم 30% عروض الصيف 🔥)"
        : "Annual Subscription (30% OFF Summer Special 🔥)"
      : isRtl
      ? "اشتراك شهري"
      : "Monthly Subscription";

    const msg = isRtl
      ? `مرحباً فريق جِدّاو | JEDDAW 👋\n\nأود الاشتراك والانضمام إلى منصة جِدّاو لتسويق مكاني/مطعمي/كافيهي في جدة!\n\n📋 تفاصيل الباقة المختارة:\n• الباقة: ${pkg.nameAr}\n• نوع الاشتراك: ${planType}\n• السعر: ${price.toLocaleString()} ر.س / شهرياً\n\nأرجو التواصل معي لاستكمال توثيق بيانات المكان وإضافته فوراً! 🚀`
      : `Hello JEDDAW Team 👋\n\nI would like to subscribe & join JEDDAW platform to market our spot/restaurant/cafe in Jeddah!\n\n📋 Selected Package Details:\n• Package: ${pkg.nameEn}\n• Subscription Type: ${planType}\n• Rate: ${price.toLocaleString()} SAR / month\n\nPlease contact me to verify our business details and publish our spot! 🚀`;

    const url = `https://api.whatsapp.com/send?phone=${ownerWhatsapp}&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#C96745]/15 px-4 py-1.5 text-xs font-black text-[#C96745] border border-[#C96745]/20">
          <Zap className="h-4 w-4" /> {isRtl ? "شريك جِدّاو التجاري" : "JEDDAW Business Partner"}
        </span>
        <h1 className="mt-4 text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-5xl leading-tight">
          {isRtl ? "عندك مكان يستاهل يدخل خطط جِدّاو؟" : "Have a Spot That Belongs on JEDDAW?"}
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed font-semibold">
          {isRtl
            ? "حدّث معلومات مكانك، أضف عروضك، واظهر للآلاف من أهالي وزوار جدة يبحثون عن تجربة متميزة يومياً."
            : "Update your spot info, list your exclusive offers, and reach thousands of Jeddah locals & tourists."}
        </p>
      </div>

      {/* ===== Summer Offer Banner & Billing Toggle ===== */}
      <div className="mt-10 max-w-2xl mx-auto text-center">
        {/* Summer Special Banner */}
        <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] p-0.5 shadow-xl mb-6 animate-pulse-glow">
          <div className="rounded-[14px] bg-[#FAF6F0] dark:bg-[#1A2221] px-5 py-2.5 flex items-center gap-2 text-xs font-black text-[#252A28] dark:text-[#F5F1E8]">
            <Flame className="h-4 w-4 text-[#C96745] animate-bounce" />
            <span>
              {isRtl
                ? "🔥 عروض الصيف الخارقة — احصل على خصم 30% عند الاشتراك السنوي!"
                : "🔥 Summer Special — Get 30% OFF on Annual Subscriptions!"}
            </span>
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
            {isRtl ? "شهري 📅" : "Monthly 📅"}
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
            <span>{isRtl ? "سنوي (عروض الصيف 🔥)" : "Yearly (Summer Sale 🔥)"}</span>
            <span className="rounded-md bg-[#E4A23B] px-1.5 py-0.5 text-[10px] text-white font-extrabold">
              {isRtl ? "خصم 30%" : "30% OFF"}
            </span>
          </button>
        </div>
      </div>

      {/* ===== Packages Grid ===== */}
      <div className="mt-12 grid gap-8 md:grid-cols-3 items-stretch">
        {packages.map((pkg, i) => {
          const price = isYearly ? pkg.yearlyPrice : pkg.monthlyPrice;
          const savings = isYearly ? (pkg.monthlyPrice - pkg.yearlyPrice) * 12 : 0;
          const features = isRtl ? pkg.featuresAr : pkg.featuresEn;

          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-7 md:p-8 flex flex-col justify-between hover-lift relative transition-all duration-300 ${
                pkg.featured
                  ? "bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] dark:from-[#1E2826] dark:via-[#192220] dark:to-[#1E2826] border-2 border-[#C96745] shadow-2xl ring-4 ring-[#C96745]/15 scale-[1.03]"
                  : "bg-white/90 dark:bg-[#1A2221] border border-[#E2D3BE] dark:border-white/10 shadow-lg"
              }`}
            >
              {/* Badge Tag */}
              {pkg.featured ? (
                <span className="absolute -top-4 start-1/2 -translate-x-1/2 rounded-full bg-[#C96745] px-5 py-1.5 text-xs font-black text-white shadow-lift border border-white/20">
                  {isRtl ? pkg.badgeAr : pkg.badgeEn}
                </span>
              ) : (
                <span className="inline-block rounded-full bg-[#397C78]/15 text-[#397C78] dark:text-[#5EAAA5] px-3.5 py-1 text-[11px] font-extrabold mb-3 w-fit">
                  {isRtl ? pkg.badgeAr : pkg.badgeEn}
                </span>
              )}

              <div>
                <h3 className="text-xl font-black text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? pkg.nameAr : pkg.nameEn}
                </h3>
                <p className="mt-2 text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold leading-relaxed min-h-[36px]">
                  {isRtl ? pkg.descAr : pkg.descEn}
                </p>

                {/* Price Display */}
                <div className="mt-6 border-y border-[#E2D3BE]/60 dark:border-white/10 py-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-black text-[#C96745]">
                      {price.toLocaleString()} {isRtl ? "ر.س" : "SAR"}
                    </span>
                    <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-bold">
                      / {isRtl ? "شهر" : "mo"} {isYearly ? (isRtl ? "(تدفع سنوياً)" : "(billed annually)") : ""}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="mt-1 text-[11px] font-extrabold text-[#397C78] dark:text-[#5EAAA5] flex items-center gap-1">
                      ✨ {isRtl ? `توفير عروض الصيف: ${savings.toLocaleString()} ر.س / سنوياً!` : `Summer Savings: ${savings.toLocaleString()} SAR / yr!`}
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3.5 text-xs">
                  {features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#252A28] dark:text-[#F5F1E8] font-bold leading-normal">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#397C78] dark:text-[#5EAAA5] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <button
                onClick={() => handleJoinPackage(pkg)}
                className={`mt-8 w-full rounded-full py-3.5 px-4 text-center text-xs font-black transition-all min-h-[50px] shadow-lift flex items-center justify-center gap-2 cursor-pointer ${
                  pkg.featured
                    ? "bg-[#25D366] text-white hover:bg-[#20bd5a] animate-pulse-glow"
                    : "bg-[#25D366] text-white hover:bg-[#20bd5a]"
                }`}
              >
                <PhoneCall className="h-4 w-4" />
                <span>
                  {isRtl
                    ? "انضم الآن عبر WhatsApp (0572563602) 📲"
                    : "Join via WhatsApp (0572563602) 📲"}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Safety & Guarantee Badge */}
      <div className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] bg-white dark:bg-[#1A2221] p-5 rounded-2xl border border-[#E2D3BE] dark:border-white/10 shadow-sm max-w-2xl mx-auto">
        <ShieldCheck className="h-6 w-6 text-[#397C78] shrink-0" />
        <span>
          {isRtl
            ? "جميع الباقات تضمن توثيق مكانك رسمياً، تحديث الصور والبيانات بأي وقت، وتغطية استثمارك بزيارات حقيقية!"
            : "All packages include official place verification, instant image & data updates, and real visitor traffic guarantee!"}
        </span>
      </div>
    </div>
  );
}