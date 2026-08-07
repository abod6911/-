import { useState } from "react";
import logoImg from "@/assets/jeddaw-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <span className={`inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02] ${className}`}>
      <span className="grid h-10 w-10 md:h-11 md:w-11 place-items-center rounded-2xl bg-white dark:bg-[#1A2221] p-1.5 shadow-sm border border-[#E2D3BE]/80 dark:border-white/15 overflow-hidden shrink-0">
        {imgFailed ? (
          <span className="text-xl font-black text-[#C96745]">جـ</span>
        ) : (
          <img
            src={logoImg}
            alt="شعار جِدّاو — JEDDAW Outing Planner"
            className="h-full w-full object-contain"
            style={{ imageRendering: "crisp-edges" }}
            onError={() => setImgFailed(true)}
          />
        )}
      </span>
      <div className="flex flex-col text-start">
        <span className="text-base font-black tracking-tight text-[#252A28] dark:text-[#F5F1E8] leading-none">جِدّاو</span>
        <span className="text-[10px] font-extrabold text-[#C96745] tracking-widest uppercase mt-0.5">JEDDAW</span>
      </div>
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