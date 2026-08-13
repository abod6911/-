import React, { memo, useCallback, useEffect, useRef, useState } from "react";
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
 * MobileInput — Zero-Lag Native IME-Safe Mobile Input Component
 * Engineered specifically for Arabic & Touchscreen mobile keyboards.
 * Protects native WebKit/Blink IME text composition buffers from being aborted by React state re-renders.
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
  const isComposingRef = useRef<boolean>(false);
  const [hasText, setHasText] = useState(Boolean(controlledValue || defaultValue));

  // Sync external controlled value if provided & not actively composing
  useEffect(() => {
    if (controlledValue !== undefined && inputRef.current && !isComposingRef.current) {
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

  // Debounced notification helper
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

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setHasText(Boolean(target.value));
    
    // DO NOT trigger React re-renders while native IME composition is active!
    if (!isComposingRef.current) {
      triggerNotify(target.value);
    }
  }, [triggerNotify]);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const target = e.currentTarget;
    setHasText(Boolean(target.value));
    triggerNotify(target.value);
  }, [triggerNotify]);

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    setHasText(false);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
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
        ref={inputRef}
        type={type}
        dir={dir}
        defaultValue={controlledValue ?? defaultValue}
        inputMode={inputMode ?? (type === "email" ? "email" : type === "search" ? "search" : "text")}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={cn(
          "w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] text-base font-semibold text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/60 dark:placeholder:text-[#B5B8B2]/50 focus:outline-none focus:border-[#C96745] min-h-[48px] px-4 transition-colors select-text [touch-action:manipulation]",
          icon && "ps-10",
          clearable && hasText && "pe-10",
          className
        )}
        {...props}
      />
      {clearable && hasText && (
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
