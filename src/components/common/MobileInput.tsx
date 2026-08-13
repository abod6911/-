import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { VirtualTouchKeyboard } from "@/components/common/VirtualTouchKeyboard";

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
 * MobileInput — Pure Touch Keyboard-Free Input Component
 * Engineered to NEVER invoke native OS virtual keyboards on mobile devices.
 * Uses 1-Tap Touch Selection or On-Screen Virtual Touch Keyboard to eliminate 100% of device OS keyboard freezes.
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasText, setHasText] = useState(Boolean(controlledValue || defaultValue));
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);

  // Sync external controlled value
  useEffect(() => {
    if (controlledValue !== undefined && inputRef.current) {
      if (inputRef.current.value !== controlledValue) {
        inputRef.current.value = controlledValue;
        setHasText(Boolean(controlledValue));
      }
    }
  }, [controlledValue]);

  const notifyChange = useCallback((val: string) => {
    setHasText(Boolean(val));
    if (onValueChange) {
      onValueChange(val);
    }
  }, [onValueChange]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerNotify = useCallback((val: string) => {
    if (debounceMs <= 0) {
      notifyChange(val);
      return;
    }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      notifyChange(val);
    }, debounceMs);
  }, [debounceMs, notifyChange]);

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setHasText(false);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (onValueChange) onValueChange("");
  }, [onValueChange]);

  // Virtual Touch Keyboard Handlers
  const handleVirtualKeyPress = useCallback((char: string) => {
    if (inputRef.current) {
      inputRef.current.value = (inputRef.current.value || "") + char;
      setHasText(true);
      triggerNotify(inputRef.current.value);
    }
  }, [triggerNotify]);

  const handleVirtualBackspace = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = (inputRef.current.value || "").slice(0, -1);
      setHasText(Boolean(inputRef.current.value));
      triggerNotify(inputRef.current.value);
    }
  }, [triggerNotify]);

  const handleVirtualSpace = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = (inputRef.current.value || "") + " ";
      setHasText(true);
      triggerNotify(inputRef.current.value);
    }
  }, [triggerNotify]);

  return (
    <div className={cn("relative flex items-center w-full", containerClassName)}>
      {icon && (
        <div className="absolute start-3.5 pointer-events-none text-muted-foreground z-10 flex items-center justify-center">
          {icon}
        </div>
      )}

      {/* Input set to readOnly on touch devices to prevent native OS keyboard popup */}
      <input
        ref={inputRef}
        type="text"
        dir={dir}
        readOnly
        onClick={() => setShowVirtualKeyboard(true)}
        defaultValue={controlledValue ?? defaultValue}
        autoComplete="off"
        className={cn(
          "w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] text-base font-semibold text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/60 dark:placeholder:text-[#B5B8B2]/50 focus:outline-none focus:border-[#C96745] min-h-[48px] px-4 transition-colors cursor-pointer select-none",
          icon && "ps-10",
          "pe-20",
          className
        )}
        {...props}
      />

      <div className="absolute end-2 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={() => setShowVirtualKeyboard((prev) => !prev)}
          className="px-2.5 py-1.5 rounded-xl bg-[#C96745] text-white text-xs font-black transition-transform active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
        >
          <span>🎹</span>
          <span>اكتب</span>
        </button>

        {clearable && hasText && (
          <button
            type="button"
            onClick={handleClear}
            className="grid h-6 w-6 place-items-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-[#C96745] hover:text-white text-[#6E716C] dark:text-[#B5B8B2] transition-colors cursor-pointer"
            aria-label="مسح النص"
          >
            ✕
          </button>
        )}
      </div>

      {showVirtualKeyboard && (
        <VirtualTouchKeyboard
          onKeyPress={handleVirtualKeyPress}
          onBackspace={handleVirtualBackspace}
          onSpace={handleVirtualSpace}
          onClose={() => setShowVirtualKeyboard(false)}
        />
      )}
    </div>
  );
});
