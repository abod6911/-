import { useState } from "react";
import logoImg from "@/assets/jeddaw-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  const [currentSrc, setCurrentSrc] = useState<string>(logoImg);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (currentSrc !== "./jeddaw-logo.png") {
      setCurrentSrc("./jeddaw-logo.png");
    } else {
      setHasError(true);
    }
  };

  return (
    <span className={`inline-flex items-center transition-transform hover:scale-[1.02] ${className}`}>
      {!hasError ? (
        <img
          src={currentSrc}
          alt="شعار جِدّاو — JEDDAW Outing Planner"
          className="h-10 md:h-14 w-auto object-contain drop-shadow-sm max-w-[180px] md:max-w-[220px]"
          style={{ imageRendering: "crisp-edges" }}
          onError={handleError}
        />
      ) : (
        <div className="flex h-10 px-3.5 items-center justify-center rounded-xl bg-gradient-to-br from-[#C96745] via-[#E4A23B] to-[#397C78] text-white font-black text-sm shadow-md">
          جِدّاو JEDDAW
        </div>
      )}
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