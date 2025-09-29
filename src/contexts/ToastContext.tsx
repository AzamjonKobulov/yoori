import { createContext } from "react";

interface ToastContextType {
  showToast: (title: string, text?: string, duration?: number) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
