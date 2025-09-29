import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks";
import { apiCP } from "../../http/apis";

interface CreateNewClientProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onContinue?: () => void;
}

export default function CreateNewClient({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: CreateNewClientProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const typeOptions = ["Физическое лицо", "Юридическое лицо"];
  const typeRef = useRef<HTMLDivElement>(null);

  // Close type dropdown on outside click
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (typeRef.current && !typeRef.current.contains(target)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    return () => document.removeEventListener("mousedown", onDocClick, true);
  }, []);

  const toggleTypeDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTypeOpen((p) => !p);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setIsTypeOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          {/* Backdrop with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Modal with slide-right animation */}
          <div className="relative w-full max-w-lg h-full">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white shadow-lg border border-base-border transform h-full"
            >
              <div className="p-5 space-y-5 h-full flex flex-col overflow-y-auto">
                <div className="flex-between">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="size-8 flex-center hover:bg-base-border/50 rounded-md"
                      onClick={onBack ?? onClose}
                      aria-label="Назад"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 19L5 12M5 12L12 5M5 12H19"
                          stroke="#71717A"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <h2 className="text-lg/7 font-semibold">
                      Создать нового клиента
                    </h2>
                  </div>

                  <button
                    className="size-8 shrink-0 flex-center hover:bg-base-border/50 rounded-md"
                    onClick={onClose}
                    aria-label="Закрыть"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.7">
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="#18181B"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </button>
                </div>

                {/* Тип клиента */}
                <div className="space-y-2 text-sm/5">
                  <label className="block text-sm/3.5">Тип клиента</label>
                  <div className="relative" ref={typeRef}>
                    <button
                      className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                        selectedType
                          ? "text-base-foreground"
                          : "text-base-muted-foreground"
                      }`}
                      onClick={toggleTypeDropdown}
                    >
                      {selectedType || "Выберите тип"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${
                          isTypeOpen ? "rotate-180" : ""
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
                    </button>

                    <AnimatePresence>
                      {isTypeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                        >
                          <ul className="p-1">
                            {typeOptions.map((type) => (
                              <li
                                key={type}
                                className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                  selectedType === type
                                    ? "bg-base-muted"
                                    : "hover:bg-base-muted"
                                }`}
                                onClick={() => handleTypeSelect(type)}
                              >
                                {type}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-end gap-4 mt-20">
                  <Button variant="outline" onClick={onClose}>
                    Отмена
                  </Button>
                  <Button variant="primary" onClick={onContinue}>
                    Создать
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
