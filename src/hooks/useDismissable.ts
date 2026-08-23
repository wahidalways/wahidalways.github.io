import { useEffect, useRef } from "react";

/**
 * Shared open/close plumbing for the header popovers.
 *
 * Both of them previously closed on `mousedown` outside and nothing else, which
 * left a keyboard user with no way out: Escape did nothing, and tabbing away
 * left the panel hanging open behind the rest of the page. This closes on an
 * outside pointer press *and* on Escape, and Escape returns focus to the
 * trigger so the caret does not get dumped at the top of the document.
 */
export function useDismissable<T extends HTMLElement>(open: boolean, onDismiss: () => void) {
  const containerRef = useRef<T>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Held in a ref so an inline arrow function from the caller does not tear the
  // listeners down and rebuild them on every render.
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) dismissRef.current();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      dismissRef.current();
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return { containerRef, triggerRef };
}
