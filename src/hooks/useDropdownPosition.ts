import { useState, useEffect } from "react";
import type { RefObject } from "react";

interface UseDropdownPositionReturn {
  shouldOpenUp: boolean;
}

export const useDropdownPosition = (
  isOpen: boolean,
  ref: RefObject<HTMLDivElement | null>
): UseDropdownPositionReturn => {
  const [shouldOpenUp, setShouldOpenUp] = useState(false);

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const calculatePosition = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;
      const dropdownHeight = 120; // Approximate height of dropdown content
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If there's not enough space below but enough space above, open up
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setShouldOpenUp(true);
      } else {
        setShouldOpenUp(false);
      }
    };

    // Calculate position when dropdown opens
    calculatePosition();

    // Recalculate on window resize
    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, ref]);

  return { shouldOpenUp };
};
