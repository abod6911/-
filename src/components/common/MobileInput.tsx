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
 * MobileInput — Zero-Lag Native IME-Safe Mobile Input Component
 * Equipped with optional Virtual Touch Keyboard for 100% device-level freeze immunity.
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
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);

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
          (clearable && hasText) || true ? "pe-16" : "",
          className
        )}
        {...props}
      />

      <div className="absolute end-2 flex items-center gap-1 z-10">
        {/* Virtual Touch Keyboard Toggle Trigger Button */}
        <button
          type="button"
          onClick={() => setShowVirtualKeyboard((prev) => !prev)}
          className="px-2 py-1 rounded-xl bg-[#C96745]/15 text-[#C96745] hover:bg-[#C96745] hover:text-white text-xs font-black transition-colors cursor-pointer"
          title="افتح كيبورد اللمس الفوري بدون تعليق"
        >
          🎹
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
