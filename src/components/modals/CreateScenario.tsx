import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks";

interface CreateScenarioProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateScenario?: (scenarioData: {
    name: string;
    condition: string;
    scheme: string;
    status: string;
    action: string;
  }) => void;
}

export default function CreateScenario({
  isOpen,
  onClose,
  onCreateScenario,
}: CreateScenarioProps) {
  const [formData, setFormData] = useState({
    name: "",
    condition: "",
    scheme: "",
    status: "",
    action: "",
  });

  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isSchemeOpen, setIsSchemeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);

  const conditionRef = useRef<HTMLDivElement>(null);
  const schemeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  // Close dropdowns on outside click
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (conditionRef.current && !conditionRef.current.contains(target)) {
        setIsConditionOpen(false);
      }
      if (schemeRef.current && !schemeRef.current.contains(target)) {
        setIsSchemeOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(target)) {
        setIsStatusOpen(false);
      }
      if (actionRef.current && !actionRef.current.contains(target)) {
        setIsActionOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    return () => document.removeEventListener("mousedown", onDocClick, true);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleConditionDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConditionOpen((p) => !p);
  };

  const toggleSchemeDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSchemeOpen((p) => !p);
  };

  const toggleStatusDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStatusOpen((p) => !p);
  };

  const toggleActionDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionOpen((p) => !p);
  };

  const handleConditionSelect = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      condition: condition,
    }));
    setIsConditionOpen(false);
  };

  const handleSchemeSelect = (scheme: string) => {
    setFormData((prev) => ({
      ...prev,
      scheme: scheme,
    }));
    setIsSchemeOpen(false);
  };

  const handleStatusSelect = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status: status,
    }));
    setIsStatusOpen(false);
  };

  const handleActionSelect = (action: string) => {
    setFormData((prev) => ({
      ...prev,
      action: action,
    }));
    setIsActionOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name.trim() &&
      formData.condition &&
      formData.scheme &&
      formData.status &&
      formData.action
    ) {
      onCreateScenario?.(formData);
      setFormData({
        name: "",
        condition: "",
        scheme: "",
        status: "",
        action: "",
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      condition: "",
      scheme: "",
      status: "",
      action: "",
    });
    onClose();
  };

  // Mock options - you can replace this with actual data
  const conditionOptions = [
    "Изменился статус в CRM",
    "Создана новая заявка",
    "Изменен приоритет сделки",
    "Добавлен новый контакт",
    "Обновлен коммерческий запрос",
  ];

  const schemeOptions = [
    "Сайты",
    "Лид-магнит",
    "Воронка продаж",
    "Email-маркетинг",
    "Социальные сети",
  ];

  const statusOptions = [
    "В работе",
    "Завершено",
    "Отложено",
    "Отменено",
    "Новый",
  ];

  const actionOptions = [
    "Продано",
    "Отправлено уведомление",
    "Создана задача",
    "Изменен статус",
    "Добавлен комментарий",
  ];

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
            onClick={handleClose}
          />

          {/* Modal with slide-right animation */}
          <div className="relative w-full max-w-lg h-full">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white shadow-lg border border-base-border transform h-full flex flex-col overflow-y-auto p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-base-foreground">
                  Создать новый сценарий
                </h2>
                <button
                  onClick={handleClose}
                  className="size-8 shrink-0 flex-center hover:bg-base-border/50 rounded-md"
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

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col space-y-5"
              >
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm/3.5">
                    Название
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder=""
                    className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                    required
                  />
                </div>

                {/* Condition Field */}
                <div className="space-y-2 text-sm/5">
                  <label className="block text-sm/3.5">Условие</label>
                  <div className="relative" ref={conditionRef}>
                    <button
                      type="button"
                      className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                        formData.condition
                          ? "text-base-foreground"
                          : "text-base-muted-foreground"
                      }`}
                      onClick={toggleConditionDropdown}
                    >
                      {formData.condition || "Выберите условие"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${
                          isConditionOpen ? "rotate-180" : ""
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
                      {isConditionOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                        >
                          <ul className="p-1">
                            {conditionOptions.map((option, index) => (
                              <li
                                key={index}
                                className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                  formData.condition === option
                                    ? "bg-base-muted"
                                    : "hover:bg-base-muted"
                                }`}
                                onClick={() => handleConditionSelect(option)}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Scheme Field */}
                <div className="space-y-2 text-sm/5">
                  <label className="block text-sm/3.5">Схема или воронка</label>
                  <div className="relative" ref={schemeRef}>
                    <button
                      type="button"
                      className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                        formData.scheme
                          ? "text-base-foreground"
                          : "text-base-muted-foreground"
                      }`}
                      onClick={toggleSchemeDropdown}
                    >
                      {formData.scheme || "Выберите схему"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${
                          isSchemeOpen ? "rotate-180" : ""
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
                      {isSchemeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                        >
                          <ul className="p-1">
                            {schemeOptions.map((option, index) => (
                              <li
                                key={index}
                                className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                  formData.scheme === option
                                    ? "bg-base-muted"
                                    : "hover:bg-base-muted"
                                }`}
                                onClick={() => handleSchemeSelect(option)}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Status Field */}
                <div className="space-y-2 text-sm/5">
                  <label className="block text-sm/3.5">Статус</label>
                  <div className="relative" ref={statusRef}>
                    <button
                      type="button"
                      className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                        formData.status
                          ? "text-base-foreground"
                          : "text-base-muted-foreground"
                      }`}
                      onClick={toggleStatusDropdown}
                    >
                      {formData.status || "Выберите статус"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${
                          isStatusOpen ? "rotate-180" : ""
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
                      {isStatusOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                        >
                          <ul className="p-1">
                            {statusOptions.map((option, index) => (
                              <li
                                key={index}
                                className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                  formData.status === option
                                    ? "bg-base-muted"
                                    : "hover:bg-base-muted"
                                }`}
                                onClick={() => handleStatusSelect(option)}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Action Field */}
                <div className="space-y-2 text-sm/5">
                  <label className="block text-sm/3.5">Действие</label>
                  <div className="relative" ref={actionRef}>
                    <button
                      type="button"
                      className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                        formData.action
                          ? "text-base-foreground"
                          : "text-base-muted-foreground"
                      }`}
                      onClick={toggleActionDropdown}
                    >
                      {formData.action || "Выберите действие"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${
                          isActionOpen ? "rotate-180" : ""
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
                      {isActionOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                        >
                          <ul className="p-1">
                            {actionOptions.map((option, index) => (
                              <li
                                key={index}
                                className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                  formData.action === option
                                    ? "bg-base-muted"
                                    : "hover:bg-base-muted"
                                }`}
                                onClick={() => handleActionSelect(option)}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Spacer to push buttons to bottom */}
                <div className="flex-1"></div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 justify-end pt-4 mt-20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="px-6"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6"
                    disabled={
                      !formData.name.trim() ||
                      !formData.condition ||
                      !formData.scheme ||
                      !formData.status ||
                      !formData.action
                    }
                  >
                    Создать
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
