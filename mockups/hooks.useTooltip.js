import { useState, useCallback } from "react";

/**
 * Simple hover-tooltip state hook.
 * Returns { isVisible, show, hide } — attach show/hide to
 * onMouseEnter / onMouseLeave on the trigger element.
 */
export function useTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const show = useCallback(() => setIsVisible(true),  []);
  const hide = useCallback(() => setIsVisible(false), []);
  return { isVisible, show, hide };
}
