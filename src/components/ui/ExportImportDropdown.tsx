import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

interface ExportImportDropdownProps {
  onImport?: () => void;
  onExport?: () => void;
  className?: string;
}

export default function ExportImportDropdown({
  onImport,
  onExport,
  className = "",
}: ExportImportDropdownProps) {
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

  const handleImport = () => {
    setShowDropdown(false);
    onImport?.();
  };

  const handleExport = () => {
    setShowDropdown(false);
    onExport?.();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        className="!size-9 flex-center hover:bg-base-border/50 rounded-md transition-colors duration-200 !p-0"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z"
            stroke="#71717A"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 4C8.36819 4 8.66667 3.70152 8.66667 3.33333C8.66667 2.96514 8.36819 2.66667 8 2.66667C7.63181 2.66667 7.33333 2.96514 7.33333 3.33333C7.33333 3.70152 7.63181 4 8 4Z"
            stroke="#71717A"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 13.3333C8.36819 13.3333 8.66667 13.0349 8.66667 12.6667C8.66667 12.2985 8.36819 12 8 12C7.63181 12 7.33333 12.2985 7.33333 12.6667C7.33333 13.0349 7.63181 13.3333 8 13.3333Z"
            stroke="#71717A"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

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
                onClick={handleImport}
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
                    d="M2.66671 14.6666H12C12.3537 14.6666 12.6928 14.5261 12.9428 14.2761C13.1929 14.026 13.3334 13.6869 13.3334 13.3333V4.66659L10 1.33325H4.00004C3.64642 1.33325 3.30728 1.47373 3.05723 1.72378C2.80718 1.97382 2.66671 2.31296 2.66671 2.66659V5.33325M9.33337 1.33325V3.99992C9.33337 4.35354 9.47385 4.69268 9.7239 4.94273C9.97395 5.19278 10.3131 5.33325 10.6667 5.33325H13.3334M1.33337 9.99992H8.00004M8.00004 9.99992L6.00004 11.9999M8.00004 9.99992L6.00004 7.99992"
                    stroke="#18181B"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Импортировать товары
              </button>
              <button
                onClick={handleExport}
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
                    d="M9.33337 1.33325V3.99992C9.33337 4.35354 9.47385 4.69268 9.7239 4.94273C9.97395 5.19278 10.3131 5.33325 10.6667 5.33325H13.3334M2.66671 4.66659V2.66659C2.66671 2.31296 2.80718 1.97382 3.05723 1.72378C3.30728 1.47373 3.64642 1.33325 4.00004 1.33325H10L13.3334 4.66659V13.3333C13.3334 13.6869 13.1929 14.026 12.9428 14.2761C12.6928 14.5261 12.3537 14.6666 12 14.6666L4.04203 14.6659C3.77866 14.7002 3.51105 14.6551 3.27349 14.5363C3.03594 14.4176 2.83927 14.2305 2.7087 13.9993M3.33337 7.33325L1.33337 9.33325M1.33337 9.33325L3.33337 11.3333M1.33337 9.33325H8.00004"
                    stroke="#09090B"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Экспорт товаров
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
