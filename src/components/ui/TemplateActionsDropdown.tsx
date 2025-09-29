import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TemplateActionsDropdownProps {
  onCopy?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function TemplateActionsDropdown({
  onCopy,
  onDelete,
  className = "",
}: TemplateActionsDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleCopy = () => {
    setShowDropdown(false);
    onCopy?.();
  };

  const handleDelete = () => {
    setShowDropdown(false);
    onDelete?.();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="w-9 h-9 flex-center bg-white border border-base-border rounded-md shadow-outline hover:bg-base-muted"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Дополнительно"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00065 8.66669C8.36884 8.66669 8.66732 8.36821 8.66732 8.00002C8.66732 7.63183 8.36884 7.33335 8.00065 7.33335C7.63246 7.33335 7.33398 7.63183 7.33398 8.00002C7.33398 8.36821 7.63246 8.66669 8.00065 8.66669Z"
            stroke="#18181B"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.00065 4.00002C8.36884 4.00002 8.66732 3.70154 8.66732 3.33335C8.66732 2.96516 8.36884 2.66669 8.00065 2.66669C7.63246 2.66669 7.33398 2.96516 7.33398 3.33335C7.33398 3.70154 7.63246 4.00002 8.00065 4.00002Z"
            stroke="#18181B"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.00065 13.3334C8.36884 13.3334 8.66732 13.0349 8.66732 12.6667C8.66732 12.2985 8.36884 12 8.00065 12C7.63246 12 7.33398 12.2985 7.33398 12.6667C7.33398 13.0349 7.63246 13.3334 8.00065 13.3334Z"
            stroke="#18181B"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full min-w-max mt-2 bg-white border border-base-border rounded-md shadow-lg z-50 p-1"
          >
            <div className="text-sm/5">
              <button
                onClick={handleCopy}
                className="w-full px-2 py-1.5 text-left text-sm hover:bg-base-chart-1/5 flex items-center rounded-[2px] gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2103_40004)">
                    <path
                      d="M2.66683 10.6663C1.9335 10.6663 1.3335 10.0663 1.3335 9.33301V2.66634C1.3335 1.93301 1.9335 1.33301 2.66683 1.33301H9.3335C10.0668 1.33301 10.6668 1.93301 10.6668 2.66634M6.66683 5.33301H13.3335C14.0699 5.33301 14.6668 5.92996 14.6668 6.66634V13.333C14.6668 14.0694 14.0699 14.6663 13.3335 14.6663H6.66683C5.93045 14.6663 5.3335 14.0694 5.3335 13.333V6.66634C5.3335 5.92996 5.93045 5.33301 6.66683 5.33301Z"
                      stroke="#09090B"
                      strokeWidth="1.33"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2103_40004">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Копировать шаблон
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-2 py-1.5 text-left text-sm hover:bg-base-chart-1/5 flex items-center rounded-[2px] gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 3.99967H14M12.6667 3.99967V13.333C12.6667 13.9997 12 14.6663 11.3333 14.6663H4.66667C4 14.6663 3.33333 13.9997 3.33333 13.333V3.99967M5.33333 3.99967V2.66634C5.33333 1.99967 6 1.33301 6.66667 1.33301H9.33333C10 1.33301 10.6667 1.99967 10.6667 2.66634V3.99967M6.66667 7.33301V11.333M9.33333 7.33301V11.333"
                    stroke="#09090B"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Удалить шаблон
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
