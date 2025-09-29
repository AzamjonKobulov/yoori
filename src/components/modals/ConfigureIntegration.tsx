import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks/useModalBodyLock";
import { useClickOutside } from "../../hooks/useClickOutside";

interface ConfigureIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIntegration: (crm: string, integrationUrl: string) => void;
}

export default function ConfigureIntegration({
  isOpen,
  onClose,
  onAddIntegration,
}: ConfigureIntegrationProps) {
  const [selectedCrm, setSelectedCrm] = useState("");
  const [integrationUrl, setIntegrationUrl] = useState("");
  const [showCrmDropdown, setShowCrmDropdown] = useState(false);
  const modalRef = useClickOutside<HTMLDivElement>({ callback: onClose });
  const dropdownRef = useClickOutside<HTMLDivElement>({
    callback: () => setShowCrmDropdown(false),
  });

  useModalBodyLock(isOpen);

  const crmOptions = [
    "AmoCRM",
    "Bitrix24",
    "HubSpot",
    "Salesforce",
    "Pipedrive",
    "Zoho CRM",
    "Freshworks CRM",
    "Insightly",
  ];

  const handleSubmit = () => {
    if (selectedCrm && integrationUrl.trim()) {
      onAddIntegration(selectedCrm, integrationUrl.trim());
      setSelectedCrm("");
      setIntegrationUrl("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCrm("");
    setIntegrationUrl("");
    onClose();
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
              ref={modalRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white shadow-lg border border-base-border transform h-full flex flex-col p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Настроить интеграцию</h2>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-base-border rounded-md transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="#09090B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 text-sm/5 space-y-6 mt-5">
                {/* CRM Selection */}
                <div className="space-y-2">
                  <label className="block leading-none font-medium text-base-foreground">
                    CRM
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCrmDropdown(!showCrmDropdown)}
                      className="w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                    >
                      <span
                        className={
                          selectedCrm
                            ? "text-base-foreground"
                            : "text-base-muted-foreground"
                        }
                      >
                        {selectedCrm || "Выберите CRM"}
                      </span>
                      <svg
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-transform ${
                          showCrmDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {showCrmDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-base-border rounded-md shadow-lg max-h-60 overflow-y-auto"
                        >
                          {crmOptions.map((crm) => (
                            <button
                              key={crm}
                              type="button"
                              onClick={() => {
                                setSelectedCrm(crm);
                                setShowCrmDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-base-border transition-colors first:rounded-t-md last:rounded-b-md"
                            >
                              {crm}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Integration URL */}
                <div className="space-y-2">
                  <label className="block leading-none font-medium text-base-foreground">
                    Ссылка для интеграции
                  </label>
                  <input
                    type="url"
                    value={integrationUrl}
                    onChange={(e) => setIntegrationUrl(e.target.value)}
                    placeholder="https://drive.google.com"
                    className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-20">
                <Button variant="secondary" onClick={handleClose}>
                  Отмена
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!selectedCrm || !integrationUrl.trim()}
                >
                  Добавить интеграцию
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
