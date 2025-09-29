import { useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ToastSuccess from "../ui/ToastSuccess";
import { ToastContext } from "../../contexts";

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastText, setToastText] = useState("");
  const showToast = useCallback(
    (title: string, text: string = "", duration: number = 3000) => {
      setToastTitle(title);
      setToastText(text);
      setIsVisible(true);

      // Auto-hide after duration
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    },
    []
  );

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  const value = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Display */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 48, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-2.5 right-2.5 z-[60]"
          >
            <ToastSuccess title={toastTitle} text={toastText} />
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
