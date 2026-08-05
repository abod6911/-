import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "أعلن معنا | وش الخطة؟ — جدة" },
      {
        name: "description",
        content:
          "أضف مكانك في وش الخطة؟ واظهر داخل خطط الطلعات في جدة: باقات ظهور، عروض، وخطط برعايتك.",
      },
      { property: "og:title", content: "أعلن معنا — وش الخطة؟" },
      { property: "og:description", content: "اظهر لجمهور يبحث عن طلعة في جدة الآن." },
      { property: "og:url", content: "/advertise" },
    ],
    links: [{ rel: "canonical", href: "/advertise" }],
  }),
  component: AdvertisePage,
});

const packages = [
  {
    name: "Starter Visibility",
    ar: "باقة الظهور",
    icon: "🚀",
    features: ["ملف موثّق", "صور إضافية", "ظهور في تصنيفك", "تقرير شهري"],
    featuresEn: ["Verified profile", "Extra photos", "Show in category", "Monthly report"],
  },
  {
    name: "Offers Growth",
    ar: "باقة العروض",
    icon: "💫",
    features: ["كل ميزات باقة الظهور", "عروض متعددة نشطة", "عرض مميز في صفحة العروض", "استهداف الجمهور المناسب"],
    featuresEn: ["All Starter features", "Multiple active offers", "Featured in Offers page", "Target right audience"],
    featured: true,
  },
  {
    name: "Sponsored Experience",
    ar: "باقة الخطة برعايتك",
    icon: "🏆",
    features: ["كل الميزات السابقة", "خطة كاملة برعايتك", "محتوى تواصل اجتماعي", "صفحة حملة ورابط تتبّع"],
    featuresEn: ["All Growth features", "Fully sponsored plan", "Social media content", "Campaign page & tracking link"],
  },
];

function AdvertisePage() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold md:text-4xl">💼 {t("businessTitle")}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("businessDesc")}</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {packages.map((p, index) => {
          const delayClass = `delay-${index + 1}`;
          
          return (
            <article
              key={p.name}
              className={`surface-card p-6 hover-lift animate-fade-in-up ${delayClass} ${
                p.featured ? "ring-2 ring-coral ring-offset-2 ring-offset-background" : ""
              }`}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">{p.icon}</span>
                {isRtl ? p.ar : p.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{isRtl ? p.name : p.ar}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {(isRtl ? p.features : p.featuresEn || p.features).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-3xl mt-12 bg-gradient-to-br from-navy to-navy-light p-8 text-pearl animate-fade-in-up delay-4 shadow-xl">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -end-24 h-64 w-64 rounded-full bg-teal/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -start-24 h-64 w-64 rounded-full bg-coral/20 blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">
            {isRtl ? "وش الخطوة القادمة؟" : "What's the Next Step?"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90">
            {isRtl 
              ? "بوابة أصحاب الأعمال (توثيق الملكية، تحديث الأوقات، رفع العروض، وتحليلات الأداء) ولوحة الإدارة تُبنى في المرحلة القادمة بعد تفعيل قاعدة البيانات وتسجيل الدخول."
              : "The Business Portal (claiming ownership, updating hours, uploading offers, and performance analytics) and the admin dashboard are being built in the next phase after activating the database and authentication."}
          </p>
          <Link
            to="/quick-plan"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-coral to-coral-light px-8 py-3.5 font-bold text-accent-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-coral/25"
          >
            {t("quickPlan")}
          </Link>
        </div>
      </div>
    </div>
  );
}