import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside, useDropdownPosition } from "../hooks";
import Button from "./ui/Button";

interface AddProductDropdownProps {
  onAddFromList: () => void;
  onQuickAdd: () => void;
  onCopyFrom?: () => void;
  showCopyFrom?: boolean;
}

export default function AddProductDropdown({
  onAddFromList,
  onQuickAdd,
  onCopyFrom,
  showCopyFrom = true,
}: AddProductDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const clickOutsideRef = useClickOutside<HTMLDivElement>({
    callback: () => setIsDropdownOpen(false),
    enabled: isDropdownOpen,
  });

  const { shouldOpenUp } = useDropdownPosition(isDropdownOpen, clickOutsideRef);

  const handleOpenAddProduct = () => {
    setIsDropdownOpen(false);
    onAddFromList();
  };

  const handleQuickAdd = () => {
    setIsDropdownOpen(false);
    onQuickAdd();
  };

  const handleCopyFrom = () => {
    if (onCopyFrom) {
      setIsDropdownOpen(false);
      onCopyFrom();
    }
  };

  return (
    <div className="relative w-full" ref={clickOutsideRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 mt-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Добавить товар
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="#8942FE"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </Button>
      <div className="border-b border-base-border mt-2"></div>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className={`w-fit absolute left-0 z-50 bg-white text-sm/5 border border-base-border rounded-md shadow-md p-1 ${
              shouldOpenUp ? "bottom-full mb-2" : "top-full mt-5"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <ul>
              <li
                className="w-full hover:bg-base-chart-1/[4%] rounded-[2px] cursor-pointer py-1.5 px-2"
                onClick={handleOpenAddProduct}
              >
                Добавить из списка товаров
              </li>
              <li
                className="w-full hover:bg-base-chart-1/[4%] rounded-[2px] cursor-pointer py-1.5 px-2"
                onClick={handleQuickAdd}
              >
                Быстрое добавление
              </li>
              {showCopyFrom && (
                <li
                  className="w-full flex-between hover:bg-base-chart-1/[4%] rounded-[2px] cursor-pointer py-1.5 px-2"
                  onClick={handleCopyFrom}
                >
                  Копировать из
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="#09090B"
                      stroke-width="1.33"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
