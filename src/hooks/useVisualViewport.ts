import { useEffect, useState } from "react";

interface ViewportState {
  isKeyboardOpen: boolean;
  keyboardHeight: number;
  visualViewportHeight: number;
}

const isEditableElement = (element: Element | null): boolean => {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    return true;
  }
  return element.getAttribute("contenteditable") === "true" || element.getAttribute("contenteditable") === "";
};

/**
 * Reusable Mobile Viewport & Visual Viewport Keyboard system.
 * Throttles geometry updates to CSS custom properties using requestAnimationFrame.
 * Only updates React state when boolean keyboard status actually changes.
 */
export function useVisualViewport(): ViewportState {
  const [state, setState] = useState<ViewportState>({
    isKeyboardOpen: false,
    keyboardHeight: 0,
    visualViewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    let currentKeyboardState = false;

    const updateGeometry = () => {
      const vv = window.visualViewport;
      const layoutHeight = window.innerHeight;
      const visualHeight = vv ? vv.height : layoutHeight;
      const offsetTop = vv ? vv.offsetTop : 0;
      const activeEl = document.activeElement;

      // Calculate keyboard height difference
      const heightDifference = Math.max(0, layoutHeight - visualHeight);
      
      // Keyboard open condition: an editable element is focused AND height is reduced substantially (>120px or <85% layout)
      const isFocused = isEditableElement(activeEl);
      const isHeightReduced = heightDifference > 120 || (layoutHeight > 0 && visualHeight / layoutHeight < 0.85);
      const isKeyboardOpen = isFocused && isHeightReduced;

      // Write CSS Custom Properties to documentElement without triggering React rerenders
      const root = document.documentElement;
      root.style.setProperty("--visual-viewport-height", `${visualHeight}px`);
      root.style.setProperty("--visual-viewport-offset-top", `${offsetTop}px`);
      root.style.setProperty("--keyboard-height", `${heightDifference}px`);
      root.dataset.keyboardOpen = isKeyboardOpen ? "true" : "false";

      // Only trigger React state update if keyboard open status changes
      if (isKeyboardOpen !== currentKeyboardState) {
        currentKeyboardState = isKeyboardOpen;
        setState({
          isKeyboardOpen,
          keyboardHeight: heightDifference,
          visualViewportHeight: visualHeight,
        });
      }
    };

    const handleEvent = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateGeometry);
    };

    // Initialize geometry
    updateGeometry();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", handleEvent);
      vv.addEventListener("scroll", handleEvent);
    }
    window.addEventListener("resize", handleEvent);
    window.addEventListener("focusin", handleEvent);
    window.addEventListener("focusout", handleEvent);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (vv) {
        vv.removeEventListener("resize", handleEvent);
        vv.removeEventListener("scroll", handleEvent);
      }
      window.removeEventListener("resize", handleEvent);
      window.removeEventListener("focusin", handleEvent);
      window.removeEventListener("focusout", handleEvent);
    };
  }, []);

  return state;
}
