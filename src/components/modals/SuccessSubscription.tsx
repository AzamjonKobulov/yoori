import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock, useClickOutside } from "../../hooks";

interface SuccessSubscriptionProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SuccessSubscription({
  isOpen = false,
  onClose,
}: SuccessSubscriptionProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  // Handle click outside to close modal
  const modalRef = useClickOutside<HTMLDivElement>({
    callback: () => onClose?.(),
    enabled: isOpen,
  });

  if (!isOpen) return null;
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
          <img
            src="/assets/images/subscription-success.svg"
            alt="Success subscription"
            className="absolute top-7 left-0 w-full"
          />

          <div className="flex flex-col items-center space-y-6">
            <div className="size-26.5 shrink-0 flex-center border border-base-border rounded-full mt-4">
              <div className="size-18 shrink-0 flex-center bg-gradient-to-b from-[#43D38C] to-[#66E29F] rounded-full">
                <img
                  src="/assets/images/subscription-success-tick.svg"
                  alt="Check circle"
                />
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-lg/7 font-semibold">Подписка оплачена!</h3>
              <p className="text-sm/5 text-base-muted-foreground">
                Тариф «Профи»{" "}
                <span className="font-medium">продлён до 23.08.2025</span>
              </p>
            </div>

            <Button variant="outline" onClick={onClose}>
              Вернуться назад
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
