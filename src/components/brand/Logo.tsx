export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 44 44" className="h-9 w-9 shrink-0" aria-hidden="true">
        {/* Route trail line */}
        <path
          d="M6 34C12 34 14 24 22 22S32 26 38 24"
          fill="none"
          stroke="#397C78"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        {/* Location Pin combined with Question Mark shape */}
        <path
          d="M22 4C15.4 4 10 9.4 10 16C10 24 22 34 22 34S34 24 34 16C34 9.4 28.6 4 22 4Z"
          fill="#C96745"
        />
        {/* Arabic Question mark stroke inside pin */}
        <path
          d="M19.2 12.8C19.2 11.2 20.4 10 22 10C23.6 10 24.8 11.1 24.8 12.5C24.8 14 23.4 14.6 22.6 15.2C21.8 15.7 21.6 16.2 21.6 17"
          fill="none"
          stroke="#FAF6F0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Dot of question mark */}
        <circle cx="21.6" cy="20" r="1.4" fill="#FAF6F0" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight text-foreground font-sans">
        وش الخطة؟
      </span>
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