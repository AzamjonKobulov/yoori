import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface UserActionsDropdownProps {
  onImportUsers?: () => void;
  className?: string;
}

export default function UserActionsDropdown({
  onImportUsers,
  className = "",
}: UserActionsDropdownProps) {
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

  const handleImportUsers = () => {
    setShowDropdown(false);
    onImportUsers?.();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className="w-9 h-9 flex-center bg-white border border-base-border rounded-md shadow-outline hover:bg-base-muted transition-colors duration-200"
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
                onClick={handleImportUsers}
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
                    d="M1.33325 14C1.3332 12.9735 1.62934 11.9689 2.18615 11.1066C2.74296 10.2443 3.53677 9.56095 4.47232 9.13865C5.40787 8.71634 6.44541 8.57297 7.46043 8.72575C8.47544 8.87854 9.4248 9.32097 10.1946 9.99997M12.6666 10.6667V14.6667M14.6666 12.6667H10.6666M9.99992 5.33333C9.99992 7.17428 8.50753 8.66667 6.66659 8.66667C4.82564 8.66667 3.33325 7.17428 3.33325 5.33333C3.33325 3.49238 4.82564 2 6.66659 2C8.50753 2 9.99992 3.49238 9.99992 5.33333Z"
                    stroke="#09090B"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Импортировать пользователей из CRM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
