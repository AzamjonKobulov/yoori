import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseClickOutsideProps {
  callback: () => void;
  enabled?: boolean;
}

export const useClickOutside = <T extends HTMLElement = HTMLElement>({
  callback,
  enabled = true,
}: UseClickOutsideProps): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    if (enabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
};
