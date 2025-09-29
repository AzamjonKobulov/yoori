import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onVersionSelect?: (versionDate: string) => void;
}

export default function VersionHistory({
  isOpen,
  onClose,
  onVersionSelect,
}: VersionHistoryProps) {
  const handleVersionClick = (versionDate: string) => {
    onVersionSelect?.(versionDate);
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white shadow-lg border border-base-border transform h-full"
            >
              <div className="p-5 h-full flex flex-col overflow-y-auto">
                <div className="flex-between">
                  <h2 className="text-lg/7 font-semibold">История версий</h2>

                  <button
                    className="size-8 shrink-0 flex-center hover:bg-base-border/50 rounded-md"
                    onClick={onClose}
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

                <div className="flex-1 space-y-5 mt-5">
                  {/* Date */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm/5 text-base-muted-foreground">
                      Сегодня
                    </span>
                    <div className="flex-1 border border-base-border"></div>
                  </div>

                  {/* Version history */}
                  <div className="space-y-5">
                    <div className="flex-between border border-base-border rounded-md p-4">
                      <div className="flex items-center gap-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M10 9H8M16 13H8M16 17H8M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                            stroke="#18181B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="space-y-1">
                          <p className="font-medium text-sm/[100%]">
                            2 апреля, 13:26
                          </p>
                          <p className="text-sm/5 text-base-muted-foreground">
                            Иванов И.С.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => handleVersionClick("2 апреля, 13:26")}
                      >
                        Открыть
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 2H14M14 2V6M14 2L6.66667 9.33333M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                            stroke="#8942FE"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                    <div className="flex-between border border-base-border rounded-md p-4">
                      <div className="flex items-center gap-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M10 9H8M16 13H8M16 17H8M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                            stroke="#18181B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="space-y-1">
                          <p className="font-medium text-sm/[100%]">
                            2 апреля, 12:15
                          </p>
                          <p className="text-sm/5 text-base-muted-foreground">
                            Петров А.В.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => handleVersionClick("2 апреля, 12:15")}
                      >
                        Открыть
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 2H14M14 2V6M14 2L6.66667 9.33333M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                            stroke="#8942FE"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                    <div className="flex-between border border-base-border rounded-md p-4">
                      <div className="flex items-center gap-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M10 9H8M16 13H8M16 17H8M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                            stroke="#18181B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="space-y-1">
                          <p className="font-medium text-sm/[100%]">
                            2 апреля, 10:30
                          </p>
                          <p className="text-sm/5 text-base-muted-foreground">
                            Сидоров В.П.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => handleVersionClick("2 апреля, 10:30")}
                      >
                        Открыть
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 2H14M14 2V6M14 2L6.66667 9.33333M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                            stroke="#8942FE"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm/5 text-base-muted-foreground">
                      На прошлой неделе
                    </span>
                    <div className="flex-1 border border-base-border"></div>
                  </div>

                  {/* Version history */}
                  <div className="space-y-5">
                    <div className="flex-between border border-base-border rounded-md p-4">
                      <div className="flex items-center gap-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M10 9H8M16 13H8M16 17H8M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                            stroke="#18181B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="space-y-1">
                          <p className="font-medium text-sm/[100%]">
                            28 марта, 16:45
                          </p>
                          <p className="text-sm/5 text-base-muted-foreground">
                            Козлов Д.И.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => handleVersionClick("28 марта, 16:45")}
                      >
                        Открыть
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 2H14M14 2V6M14 2L6.66667 9.33333M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                            stroke="#8942FE"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                    <div className="flex-between border border-base-border rounded-md p-4">
                      <div className="flex items-center gap-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M10 9H8M16 13H8M16 17H8M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                            stroke="#18181B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="space-y-1">
                          <p className="font-medium text-sm/[100%]">
                            25 марта, 14:20
                          </p>
                          <p className="text-sm/5 text-base-muted-foreground">
                            Морозов С.А.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => handleVersionClick("25 марта, 14:20")}
                      >
                        Открыть
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 2H14M14 2V6M14 2L6.66667 9.33333M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                            stroke="#8942FE"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm/5 text-base-muted-foreground">
                      Май
                    </span>
                    <div className="flex-1 border border-base-border"></div>
                  </div>

                  {/* Version history */}
                  <div className="space-y-5">
                    <div className="flex-between border border-base-border rounded-md p-4">
                      <div className="flex items-center gap-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M10 9H8M16 13H8M16 17H8M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                            stroke="#18181B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="space-y-1">
                          <p className="font-medium text-sm/[100%]">
                            15 мая, 09:10
                          </p>
                          <p className="text-sm/5 text-base-muted-foreground">
                            Волков Н.М.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => handleVersionClick("15 мая, 09:10")}
                      >
                        Открыть
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 2H14M14 2V6M14 2L6.66667 9.33333M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                            stroke="#8942FE"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-4 mt-20">
                  <Button variant="outline" onClick={onClose}>
                    Отмена
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
