import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock, useClickOutside } from "../../hooks";

interface RequestSentProps {
  onClose?: () => void;
}

export default function RequestSent({ onClose }: RequestSentProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(true);

  // Handle click outside to close modal
  const modalRef = useClickOutside<HTMLDivElement>({
    callback: () => onClose?.(),
    enabled: true,
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={modalRef}
          className="max-w-lg w-full bg-white relative border border-base-border rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Заявка отправлена</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mb-2">
            <p className="text-sm/5 text-base-muted-foreground leading-relaxed">
              Наш менеджер свяжется с вами в ближайшее время
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Вернуться назад
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
