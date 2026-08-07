import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { BUILD_ID } from "@/lib/build-info";

export interface MobileViewportContextType {
  inputFocused: boolean;
  keyboardOpen: boolean;
  keyboardHeight: number;
  vvHeight: number;
  vvTop: number;
}

const MobileViewportContext = createContext<MobileViewportContextType>({
  inputFocused: false,
  keyboardOpen: false,
  keyboardHeight: 0,
  vvHeight: typeof window !== "undefined" ? window.innerHeight : 0,
  vvTop: 0,
});

/**
 * Text Entry Element Helper — explicitly ignores non-text inputs (checkbox, radio, range, button, file, etc.)
 */
export const isTextEntryElement = (el: Element | null): boolean => {
  if (!el) return false;
  if (el.hasAttribute("disabled") || el.hasAttribute("readonly")) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === "textarea") return true;

  if (tag === "input") {
    const type = (el.getAttribute("type") || "text").toLowerCase();
    const textTypes = new Set(["text", "search", "email", "password", "tel", "url", "number"]);
    return textTypes.has(type);
  }

  const editable = el.getAttribute("contenteditable");
  return editable === "true" || editable === "";
};

export const MobileViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextState, setContextState] = useState<MobileViewportContextType>({
    inputFocused: false,
    keyboardOpen: false,
    keyboardHeight: 0,
    vvHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    vvTop: 0,
  });

  // Mutable refs to eliminate stale closure bugs
  const inputFocusedRef = useRef(false);
  const keyboardOpenRef = useRef(false);
  const baselineHeightRef = useRef(typeof window !== "undefined" ? window.innerHeight : 0);
  const orientationRef = useRef(typeof window !== "undefined" && window.innerHeight > window.innerWidth ? "portrait" : "landscape");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.dataset.buildId = BUILD_ID;

    if (process.env.NODE_ENV !== "production") {
      console.log(`[JEDDAW build: ${BUILD_ID}]`);
    }

    let rafId: number | null = null;
    let focusoutTimer: NodeJS.Timeout | null = null;
    let staggeredTimers: NodeJS.Timeout[] = [];

    const updateGeometry = () => {
      const vv = window.visualViewport;
      const currentHeight = vv ? vv.height : window.innerHeight;
      const currentTop = vv ? vv.offsetTop : 0;
      const currentLeft = vv ? vv.offsetLeft : 0;
      const currentWidth = vv ? vv.width : window.innerWidth;
      const currentOrientation = window.innerHeight > window.innerWidth ? "portrait" : "landscape";

      // Reset baseline if orientation changes
      if (currentOrientation !== orientationRef.current) {
        orientationRef.current = currentOrientation;
        baselineHeightRef.current = currentHeight;
      }

      // Update baseline when no text input is focused
      if (!inputFocusedRef.current) {
        baselineHeightRef.current = Math.max(baselineHeightRef.current, currentHeight);
      }

      const heightDifference = Math.max(0, baselineHeightRef.current - currentHeight);
      const isHeightReduced = heightDifference > 100 || (baselineHeightRef.current > 0 && currentHeight / baselineHeightRef.current < 0.85);
      const isKeyboardOpen = inputFocusedRef.current && isHeightReduced;

      keyboardOpenRef.current = isKeyboardOpen;

      // Write CSS custom properties directly to documentElement (no React rerender per pixel)
      root.style.setProperty("--vv-height", `${currentHeight}px`);
      root.style.setProperty("--vv-top", `${currentTop}px`);
      root.style.setProperty("--vv-left", `${currentLeft}px`);
      root.style.setProperty("--vv-width", `${currentWidth}px`);
      root.style.setProperty("--keyboard-height", `${heightDifference}px`);

      root.dataset.inputFocused = inputFocusedRef.current ? "true" : "false";
      root.dataset.keyboardOpen = isKeyboardOpen ? "true" : "false";

      // Only trigger React state update when boolean status actually changes
      setContextState((prev) => {
        if (
          prev.inputFocused !== inputFocusedRef.current ||
          prev.keyboardOpen !== isKeyboardOpen
        ) {
          return {
            inputFocused: inputFocusedRef.current,
            keyboardOpen: isKeyboardOpen,
            keyboardHeight: heightDifference,
            vvHeight: currentHeight,
            vvTop: currentTop,
          };
        }
        return prev;
      });
    };

    const scheduleUpdate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateGeometry);
    };

    const scheduleStaggered = () => {
      staggeredTimers.forEach(clearTimeout);
      staggeredTimers = [
        setTimeout(scheduleUpdate, 50),
        setTimeout(scheduleUpdate, 150),
        setTimeout(scheduleUpdate, 300),
      ];
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as Element | null;
      if (isTextEntryElement(target)) {
        if (focusoutTimer) {
          clearTimeout(focusoutTimer);
          focusoutTimer = null;
        }

        inputFocusedRef.current = true;
        root.dataset.inputFocused = "true"; // IMMEDIATE DOM attribute write before resize event!

        scheduleUpdate();
        scheduleStaggered();
      }
    };

    const handleFocusOut = () => {
      if (focusoutTimer) clearTimeout(focusoutTimer);

      focusoutTimer = setTimeout(() => {
        const active = document.activeElement;
        if (!isTextEntryElement(active)) {
          inputFocusedRef.current = false;
          root.dataset.inputFocused = "false";
          scheduleUpdate();
        }
      }, 150);
    };

    updateGeometry();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", scheduleUpdate);
      vv.addEventListener("scroll", scheduleUpdate);
    }
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (focusoutTimer) clearTimeout(focusoutTimer);
      staggeredTimers.forEach(clearTimeout);

      if (vv) {
        vv.removeEventListener("resize", scheduleUpdate);
        vv.removeEventListener("scroll", scheduleUpdate);
      }
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <MobileViewportContext.Provider value={contextState}>
      {children}
    </MobileViewportContext.Provider>
  );
};

export const useMobileViewport = () => useContext(MobileViewportContext);
