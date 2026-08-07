import { useEffect } from "react";

interface OriginalStyles {
  overflow: string;
  paddingRight: string;
  scrollY: number;
}

let lockCount = 0;
let originalStyles: OriginalStyles | null = null;

/**
 * Robust centralized scroll lock manager.
 * Preserves scrollbar width, scroll position, and original body inline styles.
 * Supports nested overlays and cleans up safely on unmount.
 */
export function lockBodyScroll() {
  if (typeof window === "undefined") return;

  lockCount++;

  if (lockCount === 1) {
    const scrollY = window.scrollY;
    const body = document.body;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    originalStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      scrollY,
    };

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
}

export function unlockBodyScroll() {
  if (typeof window === "undefined") return;

  if (lockCount > 0) {
    lockCount--;
  }

  if (lockCount === 0 && originalStyles) {
    const body = document.body;
    const { overflow, paddingRight, scrollY } = originalStyles;

    body.style.overflow = overflow;
    body.style.paddingRight = paddingRight;

    // Restore original scroll position smoothly
    window.scrollTo({ top: scrollY, behavior: "instant" });

    originalStyles = null;
  }
}

/**
 * React hook to manage scroll lock state declaratively.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }
  }, [isLocked]);
}
