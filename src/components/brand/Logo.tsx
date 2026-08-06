import logoImg from "@/assets/jeddaw-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 transition-transform hover:opacity-95 ${className}`}>
      <img
        src={logoImg}
        alt="شعار جِدّاو — JEDDAW Outing Planner"
        className="h-10 md:h-11 w-auto object-contain shrink-0 drop-shadow-sm"
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