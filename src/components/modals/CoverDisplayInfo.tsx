import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalBodyLock } from "../../hooks/useModalBodyLock";
import { useClickOutside } from "../../hooks/useClickOutside";
import Button from "../ui/Button";

interface CoverDisplayInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CoverDisplayInfo({
  isOpen,
  onClose,
}: CoverDisplayInfoProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalBodyLock(isOpen);
  useClickOutside({ callback: onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 bg-white rounded-lg p-6 w-full max-w-lg overflow-y-auto"
          >
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-lg/7 font-semibold">
                Где отображается обложка
              </h2>
              <p className="text-sm/5 text-base-muted-foreground">
                Текст для описания того, где будет отображаться обложка, чтобы
                было понятно пользователю, зачем ее грузить
              </p>
            </div>

            <div className="h-67.5">
              <img
                src="/assets/images/invision-cover-place.png"
                alt="Cover Image"
                className="size-full"
              />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Понятно
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
