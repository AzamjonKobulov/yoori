import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock, useClickOutside } from "../../hooks";

interface IssueInvoiceProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}

export default function IssueInvoice({
  isOpen = false,
  onClose,
  onSubmit,
}: IssueInvoiceProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  // Handle click outside to close modal
  const modalRef = useClickOutside<HTMLDivElement>({
    callback: () => onClose?.(),
    enabled: isOpen,
  });

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Invoice submitted");
    onSubmit?.(); // Call the parent's submit handler
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={modalRef}
          className="fixed right-0 top-0 h-full w-full max-w-lg flex flex-col justify-between gap-20 bg-white border-l border-base-border shadow-lg p-6 overflow-y-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Выставить счет</h2>
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

            {/* Form - Ready for inputs */}
            <div className="space-y-4">
              {/* Add your input fields here */}
              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  Полное название
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  Юридический адрес
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  ИНН
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  КПП
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  Расчетный счет
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  Расчетный счет
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  БИК
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-primary mb-2">
                  Корр. счет
                </label>
                <input
                  type="text"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border rounded-md px-3"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-20">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Выставить счет
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
