import { useEffect, useState } from "react";

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
 * Clean & Robust Mobile Viewport Manager.
 * Separates inputFocused (immediate on focusin) from keyboardOpen (baseline geometry reduction).
 * Writes geometry directly to CSS Custom Properties (--vv-height, --vv-top) using RAF.
 */
export function useMobileViewport(): MobileViewportState {
  const [state, setState] = useState<MobileViewportState>({
    inputFocused: false,
    keyboardOpen: false,
    keyboardHeight: 0,
    vvHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    vvTop: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    let focusoutTimeoutId: NodeJS.Timeout | null = null;
    let staggeredTimers: NodeJS.Timeout[] = [];

    let baselineHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    let isInputFocused = false;
    let isKeyboardOpen = false;

    const root = document.documentElement;

    const updateGeometry = () => {
      const vv = window.visualViewport;
      const currentVvHeight = vv ? vv.height : window.innerHeight;
      const currentVvTop = vv ? vv.offsetTop : 0;
      const currentVvLeft = vv ? vv.offsetLeft : 0;
      const currentVvWidth = vv ? vv.width : window.innerWidth;

      // Update baseline when input is not focused
      if (!isInputFocused) {
        baselineHeight = Math.max(baselineHeight, currentVvHeight);
      }

      // Height reduction relative to baseline
      const heightDifference = Math.max(0, baselineHeight - currentVvHeight);

      // Keyboard is open if an input is focused AND height is reduced substantially (>100px or <85% baseline)
      const heightReduced = heightDifference > 100 || (baselineHeight > 0 && currentVvHeight / baselineHeight < 0.85);
      const newKeyboardOpen = isInputFocused && heightReduced;

      // Write CSS custom properties directly to documentElement (no React rerenders per pixel)
      root.style.setProperty("--vv-height", `${currentVvHeight}px`);
      root.style.setProperty("--vv-top", `${currentVvTop}px`);
      root.style.setProperty("--vv-left", `${currentVvLeft}px`);
      root.style.setProperty("--vv-width", `${currentVvWidth}px`);
      root.style.setProperty("--keyboard-height", `${heightDifference}px`);

      root.dataset.inputFocused = isInputFocused ? "true" : "false";
      root.dataset.keyboardOpen = newKeyboardOpen ? "true" : "false";

      if (isInputFocused !== state.inputFocused || newKeyboardOpen !== isKeyboardOpen) {
        isKeyboardOpen = newKeyboardOpen;
        setState({
          inputFocused: isInputFocused,
          keyboardOpen: newKeyboardOpen,
          keyboardHeight: heightDifference,
          vvHeight: currentVvHeight,
          vvTop: currentVvTop,
        });
      }
    };

    const scheduleGeometryUpdate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateGeometry);
    };

    // Staggered measurements for Safari delayed viewport animations
    const scheduleStaggeredUpdates = () => {
      staggeredTimers.forEach(clearTimeout);
      staggeredTimers = [
        setTimeout(scheduleGeometryUpdate, 50),
        setTimeout(scheduleGeometryUpdate, 150),
        setTimeout(scheduleGeometryUpdate, 300),
      ];
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as Element | null;
      if (isEditableElement(target)) {
        if (focusoutTimeoutId) {
          clearTimeout(focusoutTimeoutId);
          focusoutTimeoutId = null;
        }

        isInputFocused = true;
        root.dataset.inputFocused = "true"; // IMMEDIATE DOM attribute write before resize event!

        scheduleGeometryUpdate();
        scheduleStaggeredUpdates();
      }
    };

    const handleFocusOut = () => {
      if (focusoutTimeoutId) clearTimeout(focusoutTimeoutId);

      // Brief delay to check if focus moved to another editable element
      focusoutTimeoutId = setTimeout(() => {
        const active = document.activeElement;
        if (!isEditableElement(active)) {
          isInputFocused = false;
          root.dataset.inputFocused = "false";
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
      staggeredTimers.forEach(clearTimeout);

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

  return state;
}
