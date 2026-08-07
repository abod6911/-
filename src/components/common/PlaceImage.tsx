import React, { useState } from "react";
import { MapPin } from "lucide-react";

interface PlaceImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

export const PlaceImage: React.FC<PlaceImageProps> = ({
  src,
  alt,
  className = "",
  fallbackText = "جِدّاو | JEDDAW",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src || DEFAULT_FALLBACK_IMAGE);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (imgSrc !== DEFAULT_FALLBACK_IMAGE) {
      setImgSrc(DEFAULT_FALLBACK_IMAGE);
    } else {
      setError(true);
    }
  };

  if (!src || error) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#091C1A] via-[#122A27] to-[#C96745] text-white p-4 overflow-hidden ${className}`}
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur shadow-sm mb-1.5">
            <MapPin className="h-4 w-4 text-[#FF9D7A]" />
          </div>
          <span className="text-xs font-black text-white/95 tracking-wide line-clamp-1">{alt}</span>
          <span className="text-[10px] font-extrabold text-[#FF9D7A] tracking-wider mt-0.5">{fallbackText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#E2D3BE]/30 dark:bg-white/5 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-[#FAF6F0] via-[#E2D3BE]/50 to-[#FAF6F0] dark:from-[#1C2422] dark:via-[#253230] dark:to-[#1C2422]" />
      )}

      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};
