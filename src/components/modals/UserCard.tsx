import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks/useModalBodyLock";
import { useState, useRef, useEffect } from "react";

type UserData = {
  id: string;
  name: string;
  status: string;
  lastLogin: string;
  createdOffers: number;
  avatar: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  email?: string;
  role?: string;
};

interface UserCardProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData | null;
  onEdit?: (user: UserData | null) => void;
  onDelete?: (user: UserData | null) => void;
}

export default function UserCard({
  isOpen,
  onClose,
  user,
  onEdit,
  onDelete,
}: UserCardProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  // Actions dropdown state
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Close actions dropdown on outside click
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (actionsRef.current && !actionsRef.current.contains(target)) {
        setShowActionsDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    return () => document.removeEventListener("mousedown", onDocClick, true);
  }, []);

  if (!isOpen || !user) return null;

  // Parse full name into parts if not already available
  const nameParts = user.name.split(" ");
  const lastName = user.lastName || nameParts[0] || "";
  const firstName = user.firstName || nameParts[1] || "";
  const middleName = user.middleName || nameParts[2] || "";

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Активен":
        return "bg-teal-500 text-white";
      case "Заблокирован":
        return "bg-base-destructive text-white";
      case "Неактивен":
        return "bg-base-muted text-base-foreground";
      default:
        return "bg-base-muted text-base-foreground";
    }
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
              className="bg-white shadow-lg border border-base-border transform h-full flex flex-col p-5"
            >
              {/* Header */}
              <div className="flex justify-between">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium">{user.name}</h2>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md shadow ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="h-fit p-2 hover:bg-gray-100 rounded-md transition-colors"
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
              <div className="flex-1 overflow-y-auto space-y-5 text-sm/5 mt-5">
                {/* User Profile Section */}
                <div className="space-y-4">
                  <div className="size-18 shrink-0 bg-black/5 flex-center border border-base-border rounded-md overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5 flex-1 border-b border-base-border pb-5">
                    <div className="space-y-1">
                      <p className="text-sm leading-none">Фамилия</p>
                      <span className="text-sm/5 text-base-muted-foreground">
                        {lastName}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-none">Имя</p>
                      <span className="text-sm/5 text-base-muted-foreground">
                        {firstName}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-none">Отчество</p>
                      <span className="text-sm/5 text-base-muted-foreground">
                        {middleName}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-none">Почта</p>
                      <span className="text-sm/5 text-base-muted-foreground">
                        {user.email || "Не указана"}
                      </span>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-sm leading-none">Роль пользователя</p>
                      <span className="text-sm/5 text-base-muted-foreground">
                        {user.role || "Не указана"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Section */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <p className="text-sm leading-none">Последний вход</p>
                    <span className="text-sm/5 text-base-muted-foreground">
                      {user.lastLogin}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm leading-none">Кол-во созданных КП</p>
                    <span className="text-sm/5 text-base-muted-foreground">
                      {user.createdOffers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-between">
                <div className="relative" ref={actionsRef}>
                  <Button
                    variant="ghost"
                    className="text-base-foreground font-medium"
                    onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                  >
                    Действия
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`ml-1 transition-transform duration-200 ${
                        showActionsDropdown ? "rotate-180" : ""
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
                  </Button>

                  <AnimatePresence>
                    {showActionsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 mb-1 w-48 bg-white border border-base-border rounded-md shadow-lg z-10"
                      >
                        <ul className="py-1">
                          <li>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-base-muted transition-colors"
                              onClick={() => {
                                if (onDelete && user) {
                                  onDelete(user);
                                  onClose();
                                }
                                setShowActionsDropdown(false);
                              }}
                            >
                              Удалить пользователя
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2 mt-20">
                  <Button variant="outline" onClick={onClose}>
                    Отмена
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (onEdit && user) {
                        onEdit(user);
                        onClose();
                      }
                    }}
                  >
                    Редактировать данные
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
