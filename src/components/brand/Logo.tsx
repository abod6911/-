export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path
          d="M8 30c6-1 8-10 14-11s8 4 8 4"
          fill="none"
          stroke="var(--teal)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path
          d="M20 4c-4.4 0-8 3.5-8 7.9 0 5.4 8 12.1 8 12.1s8-6.7 8-12.1C28 7.5 24.4 4 20 4Z"
          fill="var(--navy)"
        />
        <path
          d="M17.6 10.4c0-1.4 1.1-2.4 2.5-2.4s2.4 1 2.4 2.2c0 1.3-1.1 1.7-1.8 2.2-.6.4-.8.8-.8 1.4"
          fill="none"
          stroke="var(--coral)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="19.9" cy="17" r="1.3" fill="var(--coral)" />
      </svg>
      <span className="text-lg font-bold leading-none text-navy">وش الخطة؟</span>
    </span>
  );
}

export function RouteLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 40" className={className} preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 30C60 30 80 8 150 8s90 24 150 24 100-18 100-18"
        fill="none"
        stroke="var(--teal-soft)"
        strokeWidth="2"
        className="animate-route-draw"
      />
    </svg>
  );
}