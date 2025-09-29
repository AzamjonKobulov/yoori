import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ActionItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
}

export interface ActionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ActionItem[];
  trigger: React.ReactNode;
  className?: string;
}

export default function ActionsDropdown({
  isOpen,
  onClose,
  actions,
  trigger,
  className = "",
}: ActionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`ml-auto ${className}`} ref={dropdownRef}>
      {trigger}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-50 absolute right-0 top-full z-20 bg-white border border-base-border divide-y divide-base-border rounded-md shadow-md mt-2 py-1"
          >
            <div className="font-semibold text-sm/5 py-1.5 px-3">Действия</div>
            <ul className="p-1">
              {actions.map((action, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-start hover:bg-base-blue-100 rounded py-1.5 px-2 flex items-center gap-2 ${
                      action.variant === "destructive"
                        ? "text-base-destructive"
                        : ""
                    }`}
                    onClick={() => {
                      action.onClick();
                      onClose();
                    }}
                  >
                    {action.icon && (
                      <span className="flex-shrink-0">{action.icon}</span>
                    )}
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
