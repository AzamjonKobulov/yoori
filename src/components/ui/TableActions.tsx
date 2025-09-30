import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export interface TableActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface TableActionsProps {
  trigger: React.ReactNode;
  onAddField: (fieldType: string) => void;
  className?: string;
}

const fieldTypes: TableActionItem[] = [
  {
    id: "discount-amount",
    label: "Скидка (сумма)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2462_18934)">
          <path
            d="M7.33398 10.0002H8.66732C9.02094 10.0002 9.36008 9.85969 9.61013 9.60964C9.86018 9.35959 10.0007 9.02045 10.0007 8.66683C10.0007 8.31321 9.86018 7.97407 9.61013 7.72402C9.36008 7.47397 9.02094 7.3335 8.66732 7.3335H6.66732C6.26732 7.3335 5.93398 7.46683 5.73398 7.7335L2.00065 11.3335M4.66732 14.0002L5.73398 13.0668C5.93398 12.8002 6.26732 12.6668 6.66732 12.6668H9.33398C10.0673 12.6668 10.734 12.4002 11.2007 11.8668L14.2673 8.93351C14.5246 8.6904 14.6747 8.35505 14.6847 8.00123C14.6947 7.64741 14.5638 7.30411 14.3207 7.04685C14.0775 6.78959 13.7422 6.63944 13.3884 6.62944C13.0345 6.61944 12.6912 6.7504 12.434 6.99351L9.63398 9.59352M1.33398 10.6668L5.33398 14.6668M12.6007 6.00023C12.6007 7.06798 11.7351 7.93356 10.6674 7.93356C9.59963 7.93356 8.73405 7.06798 8.73405 6.00023C8.73405 4.93248 9.59963 4.06689 10.6674 4.06689C11.7351 4.06689 12.6007 4.93248 12.6007 6.00023ZM6.00065 3.3335C6.00065 4.43807 5.10522 5.3335 4.00065 5.3335C2.89608 5.3335 2.00065 4.43807 2.00065 3.3335C2.00065 2.22893 2.89608 1.3335 4.00065 1.3335C5.10522 1.3335 6.00065 2.22893 6.00065 3.3335Z"
            stroke="#09090B"
            stroke-width="1.33"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2462_18934">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "discount-percent",
    label: "Скидка (%)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2462_28282)">
          <path
            d="M7.33398 10.0002H8.66732C9.02094 10.0002 9.36008 9.85969 9.61013 9.60964C9.86018 9.35959 10.0007 9.02045 10.0007 8.66683C10.0007 8.31321 9.86018 7.97407 9.61013 7.72402C9.36008 7.47397 9.02094 7.3335 8.66732 7.3335H6.66732C6.26732 7.3335 5.93398 7.46683 5.73398 7.7335L2.00065 11.3335M4.66732 14.0002L5.73398 13.0668C5.93398 12.8002 6.26732 12.6668 6.66732 12.6668H9.33398C10.0673 12.6668 10.734 12.4002 11.2007 11.8668L14.2673 8.93351C14.5246 8.6904 14.6747 8.35505 14.6847 8.00123C14.6947 7.64741 14.5638 7.30411 14.3207 7.04685C14.0775 6.78959 13.7422 6.63944 13.3884 6.62944C13.0345 6.61944 12.6912 6.7504 12.434 6.99351L9.63398 9.59352M1.33398 10.6668L5.33398 14.6668M12.6007 6.00023C12.6007 7.06798 11.7351 7.93356 10.6674 7.93356C9.59963 7.93356 8.73405 7.06798 8.73405 6.00023C8.73405 4.93248 9.59963 4.06689 10.6674 4.06689C11.7351 4.06689 12.6007 4.93248 12.6007 6.00023ZM6.00065 3.3335C6.00065 4.43807 5.10522 5.3335 4.00065 5.3335C2.89608 5.3335 2.00065 4.43807 2.00065 3.3335C2.00065 2.22893 2.89608 1.3335 4.00065 1.3335C5.10522 1.3335 6.00065 2.22893 6.00065 3.3335Z"
            stroke="#09090B"
            stroke-width="1.33"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2462_28282">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "tax-percent",
    label: "Налог (%)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2462_28255)">
          <path
            d="M12.0605 6.91357C12.6908 7.14853 13.2515 7.53859 13.691 8.04771C14.1306 8.55682 14.4346 9.16854 14.575 9.82629C14.7155 10.484 14.6878 11.1666 14.4946 11.8108C14.3013 12.455 13.9488 13.0401 13.4695 13.512C12.9902 13.9838 12.3997 14.3272 11.7525 14.5104C11.1054 14.6936 10.4225 14.7106 9.767 14.5599C9.11152 14.4092 8.50462 14.0956 8.00243 13.6482C7.50024 13.2008 7.11897 12.634 6.89388 12.0002M4.66732 4.00016H5.33398V6.66683M11.1405 9.25342L11.6072 9.72675L9.72721 11.6068M9.33398 5.3335C9.33398 7.54264 7.54312 9.3335 5.33398 9.3335C3.12485 9.3335 1.33398 7.54264 1.33398 5.3335C1.33398 3.12436 3.12485 1.3335 5.33398 1.3335C7.54312 1.3335 9.33398 3.12436 9.33398 5.3335Z"
            stroke="#09090B"
            stroke-width="1.33"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2462_28255">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "markup-percent",
    label: "Наценка (%)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2462_28248)">
          <path
            d="M10.0007 6.00016L6.00065 10.0002M6.00065 6.00016H6.00732M10.0007 10.0002H10.0073M14.6673 8.00016C14.6673 11.6821 11.6826 14.6668 8.00065 14.6668C4.31875 14.6668 1.33398 11.6821 1.33398 8.00016C1.33398 4.31826 4.31875 1.3335 8.00065 1.3335C11.6826 1.3335 14.6673 4.31826 14.6673 8.00016Z"
            stroke="#09090B"
            stroke-width="1.33"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2462_28248">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "markup-amount",
    label: "Наценка(сумма)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2462_28248)">
          <path
            d="M10.0007 6.00016L6.00065 10.0002M6.00065 6.00016H6.00732M10.0007 10.0002H10.0073M14.6673 8.00016C14.6673 11.6821 11.6826 14.6668 8.00065 14.6668C4.31875 14.6668 1.33398 11.6821 1.33398 8.00016C1.33398 4.31826 4.31875 1.3335 8.00065 1.3335C11.6826 1.3335 14.6673 4.31826 14.6673 8.00016Z"
            stroke="#09090B"
            stroke-width="1.33"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2462_28248">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "quantity",
    label: "Кол-во",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.66732 2.6665V13.3332M6.00065 2.6665V13.3332M9.33398 2.6665V13.3332M12.6673 2.6665V13.3332M14.6673 3.99984L1.33398 11.9998"
          stroke="#09090B"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "number-multiply-price",
    label: "Число (умножение на цену)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13.3332H6.66667M9.33333 6.6665H12M4 9.33317H5.33333V13.3332M9.33333 2.6665H10.6667V6.6665M10.6667 9.33317C11.403 9.33317 12 9.93012 12 10.6665V11.9998C12 12.7362 11.403 13.3332 10.6667 13.3332C9.93029 13.3332 9.33333 12.7362 9.33333 11.9998V10.6665C9.33333 9.93012 9.93029 9.33317 10.6667 9.33317ZM5.33333 2.6665C6.06971 2.6665 6.66667 3.26346 6.66667 3.99984V5.33317C6.66667 6.06955 6.06971 6.6665 5.33333 6.6665C4.59695 6.6665 4 6.06955 4 5.33317V3.99984C4 3.26346 4.59695 2.6665 5.33333 2.6665Z"
          stroke="#09090B"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "number-multiply-fields",
    label: "Число (умножений полей)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13.3332H6.66667M9.33333 6.6665H12M4 9.33317H5.33333V13.3332M9.33333 2.6665H10.6667V6.6665M10.6667 9.33317C11.403 9.33317 12 9.93012 12 10.6665V11.9998C12 12.7362 11.403 13.3332 10.6667 13.3332C9.93029 13.3332 9.33333 12.7362 9.33333 11.9998V10.6665C9.33333 9.93012 9.93029 9.33317 10.6667 9.33317ZM5.33333 2.6665C6.06971 2.6665 6.66667 3.26346 6.66667 3.99984V5.33317C6.66667 6.06955 6.06971 6.6665 5.33333 6.6665C4.59695 6.6665 4 6.06955 4 5.33317V3.99984C4 3.26346 4.59695 2.6665 5.33333 2.6665Z"
          stroke="#09090B"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "text",
    label: "Текст",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.66602 4.6665V2.6665H13.3327V4.6665M5.99935 13.3332H9.99935M7.99935 2.6665V13.3332"
          stroke="#09090B"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "price",
    label: "Цена",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.00065 8H4.00732M12.0007 8H12.0073M2.66732 4H13.334C14.0704 4 14.6673 4.59695 14.6673 5.33333V10.6667C14.6673 11.403 14.0704 12 13.334 12H2.66732C1.93094 12 1.33398 11.403 1.33398 10.6667V5.33333C1.33398 4.59695 1.93094 4 2.66732 4ZM9.33398 8C9.33398 8.73638 8.73703 9.33333 8.00065 9.33333C7.26427 9.33333 6.66732 8.73638 6.66732 8C6.66732 7.26362 7.26427 6.66667 8.00065 6.66667C8.73703 6.66667 9.33398 7.26362 9.33398 8Z"
          stroke="#09090B"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    onClick: () => {},
  },
  {
    id: "article",
    label: "Артикул",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.66732 14.6668H12.0007C12.3543 14.6668 12.6934 14.5264 12.9435 14.2763C13.1935 14.0263 13.334 13.6871 13.334 13.3335V4.66683L10.0007 1.3335H4.00065C3.64703 1.3335 3.30789 1.47397 3.05784 1.72402C2.80779 1.97407 2.66732 2.31321 2.66732 2.66683V5.3335M9.33398 1.3335V4.00016C9.33398 4.35378 9.47446 4.69292 9.72451 4.94297C9.97456 5.19302 10.3137 5.3335 10.6673 5.3335H13.334M6.66732 8.00016H8.00065V12.0002M6.66732 12.0002H9.33398M2.66732 8.00016C3.4037 8.00016 4.00065 8.59712 4.00065 9.3335V10.6668C4.00065 11.4032 3.4037 12.0002 2.66732 12.0002C1.93094 12.0002 1.33398 11.4032 1.33398 10.6668V9.3335C1.33398 8.59712 1.93094 8.00016 2.66732 8.00016Z"
          stroke="#09090B"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    onClick: () => {},
  },
];

export default function TableActions({
  trigger,
  onAddField,
  className = "",
}: TableActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const dropdownWidth = 280; // min-w-[280px]
        const padding = 16; // Add some padding from viewport edge

        let x = rect.left;

        if (rect.left + dropdownWidth > viewportWidth - padding) {
          x = rect.right - dropdownWidth;
        }

        setDropdownCoords({ x, y: rect.bottom + 4 });
      }
    };

    if (isOpen && triggerRef.current) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      // Calculate initial dropdown position
      updatePosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const handleFieldClick = (fieldType: string) => {
    onAddField(fieldType);
    setIsOpen(false);
  };

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-md p-1 mt-3.5 -ml-3.5 min-w-[280px]"
          style={{
            left: dropdownCoords.x,
            top: dropdownCoords.y,
          }}
        >
          <ul className="py-1">
            {fieldTypes.map((field) => (
              <li key={field.id}>
                <button
                  className="w-full text-start hover:bg-base-chart-1/5 py-1.5 px-3 flex items-center gap-2 text-sm/5 text-gray-700 rounded-sm"
                  onClick={() => handleFieldClick(field.id)}
                >
                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                    {field.icon}
                  </span>
                  <span>{field.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>

      {typeof document !== "undefined" && isOpen
        ? createPortal(dropdownContent, document.body)
        : null}
    </div>
  );
}
