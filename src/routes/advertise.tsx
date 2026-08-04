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
    features: ["ملف موثّق", "صور إضافية", "ظهور في تصنيفك", "تقرير شهري"],
  },
  {
    name: "Offers Growth",
    ar: "باقة العروض",
    features: ["كل ميزات باقة الظهور", "عروض متعددة نشطة", "عرض مميز في صفحة العروض", "استهداف الجمهور المناسب"],
    featured: true,
  },
  {
    name: "Sponsored Experience",
    ar: "باقة الخطة برعايتك",
    features: ["كل الميزات السابقة", "خطة كاملة برعايتك", "محتوى تواصل اجتماعي", "صفحة حملة ورابط تتبّع"],
  },
];

function AdvertisePage() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold md:text-4xl">{t("businessTitle")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("businessDesc")}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {packages.map((p) => (
          <article
            key={p.name}
            className={`surface-card p-6 ${p.featured ? "ring-2 ring-coral" : ""}`}
          >
            <h2 className="text-xl font-bold">{isRtl ? p.ar : p.name}</h2>
            <p className="text-sm text-muted-foreground">{p.name}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="surface-card mt-8 bg-navy p-8 text-pearl">
        <h2 className="text-2xl font-bold">وش الخطوة القادمة؟</h2>
        <p className="mt-2 max-w-2xl text-sm opacity-85">
          بوابة أصحاب الأعمال (توثيق الملكية، تحديث الأوقات، رفع العروض، وتحليلات الأداء) ولوحة
          الإدارة تُبنى في المرحلة القادمة بعد تفعيل قاعدة البيانات وتسجيل الدخول.
        </p>
        <Link
          to="/quick-plan"
          className="mt-5 inline-block rounded-full bg-coral px-6 py-3 font-bold text-accent-foreground"
        >
          {t("quickPlan")}
        </Link>
      </div>
    </div>
  );
}