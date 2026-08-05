import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileTabBar } from "@/components/site/MobileTabBar";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { AiAssistant } from "@/components/ai/AiAssistant";

function NotFoundComponent() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="surface-card max-w-md p-8 text-center animate-fade-in-up">
        <span className="text-6xl block mb-4">🧭</span>
        <h1 className="text-2xl font-extrabold text-foreground">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {t("notFoundSub")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lift transition-all hover:bg-primary/90 min-h-[48px]"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="surface-card max-w-md p-8 text-center animate-fade-in-up">
        <span className="text-5xl block mb-4">⚠️</span>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {t("generalError")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("netError")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 min-h-[44px]"
          >
            جرّب مرة ثانية
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-accent min-h-[44px]"
          >
            {t("backHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "جِدّاو | JEDDAW" },
      { property: "og:site_name", content: "جِدّاو | JEDDAW — مخطط طلعات جدة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@jeddaw" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Manrope:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 pb-20 lg:pb-0">
              <Outlet />
            </main>
            <SiteFooter />
            <MobileTabBar />
            <AiAssistant />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
