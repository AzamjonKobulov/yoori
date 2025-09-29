import React, { useState } from "react";
import { useClickOutside, useDropdownPosition } from "../../hooks";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const clickOutsideRef = useClickOutside<HTMLDivElement>({
    callback: () => setIsOpen(false),
    enabled: isOpen,
  });

  const { shouldOpenUp } = useDropdownPosition(isOpen, clickOutsideRef);

  return (
    <div className={`relative ${className}`} ref={clickOutsideRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div 
          className={`absolute left-0 w-full bg-white shadow-primary rounded-md z-10 ${
            shouldOpenUp 
              ? "bottom-full mb-1" 
              : "top-full mt-1"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
