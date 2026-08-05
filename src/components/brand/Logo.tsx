import logoImg from "@/assets/jeddaw-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-2xl bg-[#FAF6F0] px-3.5 py-1.5 shadow-sm border border-[#E2D3BE]/80 hover:scale-105 transition-transform ${className}`}>
      <img
        src={logoImg}
        alt="شعار جِدّاو — مخطط طلعات جدة"
        className="h-8.5 w-auto object-contain shrink-0"
      />
    </span>
  );
}

export function RouteLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 40" className={className} preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 30C60 30 80 8 150 8s90 24 150 24 100-18 100-18"
        fill="none"
        stroke="#397C78"
        strokeWidth="2.5"
        className="animate-route-draw"
      />
    </svg>
  );
}