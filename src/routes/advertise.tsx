import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "أعلن مع جِدّاو | JEDDAW — لأصحاب الأماكن والفعاليات" },
      {
        name: "description",
        content: "عندك مكان يستاهل يدخل خطط جِدّاو؟ حدّث معلومات مكانك، أضف عروضك، واظهر للأشخاص الذين يبحثون عن تجربة تناسبهم فعلًا.",
      },
    ],
    links: [{ rel: "canonical", href: "/advertise" }],
  }),
  component: AdvertisePage,
});

export function AdvertisePage() {
  const { t, isRtl } = useLanguage();

  const packages = [
    {
      name: "🚀 باقة الانطلاق",
      price: "490 ر.س",
      period: "/ شهر",
      desc: "مثالية للمقاهي والمطاعم الناشئة للظهور المباشر في الخطط القريبة",
      features: [
        "إضافة المكان وتوثيق البيانات رسمياً",
        "الظهور في نتائج بحث الأحياء القريبة",
        "تحديث أوقات العمل والأسعار",
        "عرض الإيموجيات والشارات الخاصة",
      ],
      featured: false,
    },
    {
      name: "💫 الباقة المتقدمة",
      price: "990 ر.س",
      period: "/ شهر",
      desc: "خيار رائع للظهور في الخطط الموصى بها وتقديم العروض الحصرية",
      features: [
        "كل مميزات باقة الانطلاق",
        "شارة 'اختيار جِدّاو' الفاخرة",
        "إضافة العروض والخصومات المباشرة",
        "أولوية التواجد في خيارات التبديل",
        "تقرير إحصائيات التفاعل شهرية",
      ],
      featured: true,
    },
    {
      name: "🏆 الباقة الراعية",
      price: "1,890 ر.س",
      period: "/ شهر",
      desc: "للعلامات والفعاليات التي تبحث عن أقصى انتشار في جدة",
      features: [
        "كل مميزات الباقة المتقدمة",
        "الظهور في كروت الصفحة الرئيسية",
        "إعلان ممول مميز في الخطط الجاهزة",
        "دعم فني وتحديث فوري للمعلومات",
      ],
      featured: false,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#C96745]/15 px-4 py-1.5 text-xs font-bold text-[#C96745]">
          <Zap className="h-4 w-4" /> {t("businessHeader")}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-[#252A28] md:text-5xl">
          {t("businessTitle")}
        </h1>
        <p className="mt-4 text-base md:text-lg text-[#6E716C] leading-relaxed font-semibold">
          {t("businessDesc")}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {packages.map((pkg, i) => (
          <div
            key={pkg.name}
            className={`surface-card p-8 flex flex-col justify-between hover-lift relative ${
              pkg.featured
                ? "border-2 border-[#C96745] ring-2 ring-[#C96745]/20 bg-[#FAF6F0]"
                : "border border-[#E2D3BE]"
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {pkg.featured && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#C96745] px-4 py-1 text-xs font-bold text-white shadow-sm">
                الأكثر طلباً ⭐
              </span>
            )}

            <div>
              <h3 className="text-xl font-bold text-[#252A28]">{pkg.name}</h3>
              <p className="mt-2 text-xs text-[#6E716C] font-semibold leading-relaxed">{pkg.desc}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#C96745]">{pkg.price}</span>
                <span className="text-xs text-[#6E716C] font-bold">{pkg.period}</span>
              </div>

              <ul className="mt-6 space-y-3 border-t border-[#E2D3BE] pt-6 text-sm">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-[#252A28] font-medium">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#397C78] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => alert("شكراً لاهتمامك! تواصل معنا عبر البريد أو واتساب للانضمام إلى جِدّاو.")}
              className={`mt-8 w-full rounded-full py-3.5 text-center text-sm font-bold transition-all min-h-[48px] ${
                pkg.featured
                  ? "bg-[#C96745] text-white shadow-lift hover:bg-[#b55837]"
                  : "border border-[#E2D3BE] bg-[#F4EBDD] text-[#252A28] hover:border-[#C96745]"
              }`}
            >
              {t("addPlace")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}