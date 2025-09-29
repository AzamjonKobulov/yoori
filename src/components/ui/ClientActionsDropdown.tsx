import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ClientActionsDropdownProps {
  onImport?: () => void;
  onExport?: () => void;
  className?: string;
}

export default function ClientActionsDropdown({
  onImport,
  onExport,
  className = "",
}: ClientActionsDropdownProps) {
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
          <circle cx="3" cy="8" r="1.333" fill="#71717A" />
          <circle cx="8" cy="8" r="1.333" fill="#71717A" />
          <circle cx="13" cy="8" r="1.333" fill="#71717A" />
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
                    d="M1.3335 14C1.33344 12.9735 1.62959 11.9689 2.18639 11.1066C2.7432 10.2443 3.53701 9.56095 4.47256 9.13865C5.40811 8.71634 6.44565 8.57297 7.46067 8.72575C8.47568 8.87854 9.42505 9.32097 10.1948 9.99997M12.6668 10.6667V14.6667M14.6668 12.6667H10.6668M10.0002 5.33333C10.0002 7.17428 8.50778 8.66667 6.66683 8.66667C4.82588 8.66667 3.3335 7.17428 3.3335 5.33333C3.3335 3.49238 4.82588 2 6.66683 2C8.50778 2 10.0002 3.49238 10.0002 5.33333Z"
                    stroke="#09090B"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Импортировать клиентов
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
                Экспорт списка клиентов
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
