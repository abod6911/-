import React, { memo, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface MobileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  debounceMs?: number;
  containerClassName?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
}

/**
 * MobileInput - Zero-Lag Native Mobile Input Component
 * Engineered specifically for mobile touchscreen input reliability.
 * Prevents main-thread layout thrashing, text composition hangs, and browser autocorrect loops.
 */
export const MobileInput = memo(function MobileInput({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  debounceMs = 0,
  containerClassName,
  className,
  icon,
  clearable = true,
  type = "text",
  dir = "auto",
  inputMode,
  ...props
}: MobileInputProps) {
  const [localValue, setLocalValue] = useState(controlledValue ?? defaultValue);

  // Sync controlled value if changed externally
  useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue]);

  // Debounced callback to parent
  useEffect(() => {
    if (!onValueChange) return;

    if (debounceMs <= 0) {
      onValueChange(localValue);
      return;
    }

    const timer = setTimeout(() => {
      onValueChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onValueChange, debounceMs]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue("");
    if (onValueChange) onValueChange("");
  }, [onValueChange]);

  return (
    <div className={cn("relative flex items-center w-full", containerClassName)}>
      {icon && (
        <div className="absolute start-3.5 pointer-events-none text-muted-foreground z-10 flex items-center justify-center">
          {icon}
        </div>
      )}
      <input
        type={type}
        dir={dir}
        inputMode={inputMode ?? (type === "email" ? "email" : type === "search" ? "search" : "text")}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        value={localValue}
        onChange={handleChange}
        className={cn(
          "w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] text-base font-semibold text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/60 dark:placeholder:text-[#B5B8B2]/50 focus:outline-none focus:border-[#C96745] min-h-[48px] px-4 transition-colors select-text [touch-action:manipulation]",
          icon && "ps-10",
          clearable && localValue.length > 0 && "pe-10",
          className
        )}
        {...props}
      />
      {clearable && localValue.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute end-3 grid h-6 w-6 place-items-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-[#C96745] hover:text-white text-[#6E716C] dark:text-[#B5B8B2] transition-colors z-10 cursor-pointer"
          aria-label="مسح النص"
        >
          ✕
        </button>
      )}
    </div>
  );
});
