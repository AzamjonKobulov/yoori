import { useState } from "react";
import { useClickOutside, useDropdownPosition } from "../../hooks";
import Button from "./Button";

interface RowsPerPageDropdownProps {
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export default function RowsPerPageDropdown({
  rowsPerPage,
  onRowsPerPageChange,
  options = [5, 10, 20],
  className = "",
}: RowsPerPageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const clickOutsideRef = useClickOutside<HTMLDivElement>({
    callback: () => setIsOpen(false),
    enabled: isOpen,
  });

  const { shouldOpenUp } = useDropdownPosition(isOpen, clickOutsideRef);

  const handleOptionClick = (value: number) => {
    onRowsPerPageChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <p>Показывать строк</p>
      <div className="relative" ref={clickOutsideRef}>
        <Button
          variant="outline"
          className="min-w-17.5 !px-3 !py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {rowsPerPage}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#71717A"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        {isOpen && (
          <div
            className={`absolute left-0 w-full bg-white shadow-primary rounded-md z-[9999] border border-base-border ${
              shouldOpenUp ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <ul>
              {options.map((value) => (
                <li
                  key={value}
                  className={`py-1.5 px-3 cursor-pointer hover:bg-base-muted ${
                    value === rowsPerPage ? "bg-base-muted" : ""
                  }`}
                  onClick={() => handleOptionClick(value)}
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
