import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks/useModalBodyLock";

interface ImportProductsProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (file: File) => void;
}

export default function ImportProducts({
  isOpen,
  onClose,
  onImport,
}: ImportProductsProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  const [isUpdateChecked, setIsUpdateChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleReplaceFile = () => {
    setSelectedFile(null);
    // Reset the file input
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImport = () => {
    if (onImport && selectedFile) {
      onImport(selectedFile);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end">
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
              className="bg-white shadow-lg border border-base-border transform h-full flex flex-col overflow-auto p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Импортировать товары</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
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
                      stroke="#71717A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-5 text-sm/5 mt-5">
                <div className="space-y-5 text-base-muted-foreground">
                  <div className="">
                    <p>Чтобы успешно добавить товары в систему:</p>
                    <ul className="list-disc list-inside pl-2">
                      <li>
                        Необходимо —
                        <button className="text-base-chart-1 pl-2">
                          Скачать пример таблицы
                        </button>
                      </li>
                      <li>
                        Подготовить таблицу для импорта (Таблица имеет
                        ограничение в 25 столбцов, первая строка остается
                        неизменной)
                      </li>
                    </ul>
                  </div>

                  <p>
                    Импорт производится из первых 10.000 и одной строки (Первая
                    строка — заголовки столбцов). Все, что будет за пределами
                    10.001, будет проигнорировано
                  </p>

                  <div className="space-y-2">
                    <p>Правила обновления товаров следующие:</p>
                    <ul className="list-decimal list-inside space-y-2 pl-2">
                      <li>Выполняется поиск по ID (если он заполнен)</li>
                      <li>
                        Если ID не заполнено — выполняется поиск по External ID
                      </li>
                      <li>
                        Если «External ID» не заполнен — выполняется поиск по
                        «Артикул»
                      </li>
                      <li>
                        Если поиск не дал результатов или ни одно из
                        вышеперечисленных полей не заполнено — будет создан
                        новый товар
                      </li>
                      <li>
                        Если товар найден по одному из вышеперечисленных полей —
                        товар будет обновлён
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="file-input"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-input"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-base-border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {selectedFile ? (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.67737 2.00631 11.2874 2.66082 12.4933 3.82667L14 5.33333M14 5.33333V2M14 5.33333H10.6667M14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14C6.32263 13.9937 4.71265 13.3392 3.50667 12.1733L2 10.6667M2 10.6667H5.33333M2 10.6667V14"
                            stroke="#18181B"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Заменить
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10"
                            stroke="#18181B"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Выберите файл
                      </>
                    )}
                  </label>

                  {/* Display selected file name */}
                  {selectedFile && (
                    <div className="group relative flex items-center gap-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M8 13H10M14 13H16M8 17H10M14 17H16M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                          stroke="#18181B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm">{selectedFile.name}</span>

                      {/* X button on hover */}
                      <button
                        onClick={handleReplaceFile}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 3L3 9M3 3L9 9"
                            stroke="#6B7280"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <label htmlFor="check" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="check"
                    className="peer hidden"
                    checked={isUpdateChecked}
                    onChange={(e) => setIsUpdateChecked(e.target.checked)}
                  />
                  <div className="size-4 flex-center border border-base-foreground rounded-[2px] peer-checked:bg-base-chart-1 peer-checked:border-base-chart-1 shadow-primary">
                    <svg
                      width="12"
                      height="9"
                      viewBox="0 0 12 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="peer-checked:block"
                    >
                      <path
                        d="M11.3346 1L4.0013 8.33333L0.667969 5"
                        stroke="#FAFAFA"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Обновить товар при совпадении артикула</span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-20">
                <Button variant="outline" onClick={onClose}>
                  Отмена
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImport}
                  className="disabled:opacity-50"
                  disabled={!selectedFile}
                >
                  Импортировать
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
