import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock, useClickOutside } from "../../hooks";

interface WaitingForPaymentProps {
  onClose?: () => void;
}

export default function WaitingForPayment({ onClose }: WaitingForPaymentProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(true);

  // Handle click outside to close modal
  const modalRef = useClickOutside<HTMLDivElement>({
    callback: () => onClose?.(),
    enabled: true,
  });

  const handleDownloadInvoice = () => {
    // Handle invoice download logic here
    console.log("Downloading invoice");
    onClose?.();
  };

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
            <h2 className="text-xl font-semibold">Ожидание оплаты счета</h2>
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
              После оплаты счета система будет активирована в течение 24 часов
              или какой-то похожий описательный текст
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={handleDownloadInvoice}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1V11M8 11L5 8M8 11L11 8M2 13H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Скачать счет
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
