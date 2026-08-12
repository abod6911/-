import { useEffect } from "react";

export interface MobileViewportState {
  inputFocused: boolean;
  keyboardOpen: boolean;
  keyboardHeight: number;
  vvHeight: number;
  vvTop: number;
}

const isEditableElement = (el: Element | null): boolean => {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") {
    return true;
  }
  const editable = el.getAttribute("contenteditable");
  return editable === "true" || editable === "";
};

/**
 * Ultra-Lean Mobile Viewport Manager.
 * Prevents forced reflow and layout thrashing during input typing & virtual keyboard events.
 * Caches DOM values to avoid redundant style invalidations on documentElement.
 */
export function useMobileViewport(): MobileViewportState {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    let focusoutTimeoutId: NodeJS.Timeout | null = null;

    let baselineHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    let isInputFocused = false;

    let lastVvHeight = 0;
    let lastVvTop = -1;
    let lastKeyboardHeight = -1;
    let lastInputFocusedState: boolean | null = null;

    const root = document.documentElement;

    const updateGeometry = () => {
      const vv = window.visualViewport;
      const currentVvHeight = Math.round(vv ? vv.height : window.innerHeight);
      const currentVvTop = Math.round(vv ? vv.offsetTop : 0);
      const currentVvLeft = Math.round(vv ? vv.offsetLeft : 0);
      const currentVvWidth = Math.round(vv ? vv.width : window.innerWidth);

      if (!isInputFocused) {
        baselineHeight = Math.max(baselineHeight, currentVvHeight);
      }

      const heightDifference = Math.max(0, baselineHeight - currentVvHeight);
      const heightReduced = heightDifference > 100 || (baselineHeight > 0 && currentVvHeight / baselineHeight < 0.85);
      const isKeyboardOpen = isInputFocused && heightReduced;

      // Caching check to prevent redundant layout thrashing
      if (Math.abs(currentVvHeight - lastVvHeight) >= 3) {
        root.style.setProperty("--vv-height", `${currentVvHeight}px`);
        lastVvHeight = currentVvHeight;
      }

      if (Math.abs(currentVvTop - lastVvTop) >= 2) {
        root.style.setProperty("--vv-top", `${currentVvTop}px`);
        root.style.setProperty("--vv-left", `${currentVvLeft}px`);
        root.style.setProperty("--vv-width", `${currentVvWidth}px`);
        lastVvTop = currentVvTop;
      }

      if (Math.abs(heightDifference - lastKeyboardHeight) >= 3) {
        root.style.setProperty("--keyboard-height", `${heightDifference}px`);
        lastKeyboardHeight = heightDifference;
      }

      if (lastInputFocusedState !== isInputFocused) {
        root.dataset.inputFocused = isInputFocused ? "true" : "false";
        root.dataset.keyboardOpen = isKeyboardOpen ? "true" : "false";
        lastInputFocusedState = isInputFocused;
      }
    };

    const scheduleGeometryUpdate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateGeometry);
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as Element | null;
      if (isEditableElement(target)) {
        if (focusoutTimeoutId) {
          clearTimeout(focusoutTimeoutId);
          focusoutTimeoutId = null;
        }

        if (!isInputFocused) {
          isInputFocused = true;
          scheduleGeometryUpdate();
        }
      }
    };

    const handleFocusOut = () => {
      if (focusoutTimeoutId) clearTimeout(focusoutTimeoutId);

      focusoutTimeoutId = setTimeout(() => {
        const active = document.activeElement;
        if (!isEditableElement(active)) {
          isInputFocused = false;
          scheduleGeometryUpdate();
        }
      }, 150);
    };

    // Initial setup
    updateGeometry();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", scheduleGeometryUpdate);
      vv.addEventListener("scroll", scheduleGeometryUpdate);
    }
    window.addEventListener("resize", scheduleGeometryUpdate);
    window.addEventListener("orientationchange", scheduleGeometryUpdate);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (focusoutTimeoutId) clearTimeout(focusoutTimeoutId);

      if (vv) {
        vv.removeEventListener("resize", scheduleGeometryUpdate);
        vv.removeEventListener("scroll", scheduleGeometryUpdate);
      }
      window.removeEventListener("resize", scheduleGeometryUpdate);
      window.removeEventListener("orientationchange", scheduleGeometryUpdate);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return {
    inputFocused: false,
    keyboardOpen: false,
    keyboardHeight: 0,
    vvHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    vvTop: 0,
  };
}
