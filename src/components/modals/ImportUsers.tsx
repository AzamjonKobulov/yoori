import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks/useModalBodyLock";

interface ImportUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (selectedUsers: CRMUser[]) => void;
}

interface CRMUser {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar: string;
}

const crmUsers: CRMUser[] = [
  {
    id: "1",
    name: "Иванов И.С.",
    email: "Ivan@yandex.ru",
    jobTitle: "Менеджер по продажам",
    avatar: "/assets/images/avatar.png",
  },
  {
    id: "2",
    name: "Петрова А.А.",
    email: "AnnaP@mail.ru",
    jobTitle: "Маркетолог",
    avatar: "/assets/images/avatar.png",
  },
  {
    id: "3",
    name: "Сидоров К.Б.",
    email: "SidorovKB@gmail.com",
    jobTitle: "Разработчик",
    avatar: "/assets/images/avatar.png",
  },
  {
    id: "4",
    name: "Кузнецова Е.В.",
    email: "K.Evgenia@outlook.com",
    jobTitle: "Дизайнер",
    avatar: "/assets/images/avatar.png",
  },
  {
    id: "5",
    name: "Михайлов Н.А.",
    email: "MihailovNA@yahoo.com",
    jobTitle: "Аналитик",
    avatar: "/assets/images/avatar.png",
  },
  {
    id: "6",
    name: "Федоров С.Д.",
    email: "FedorovSD@icloud.com",
    jobTitle: "Продуктовый менеджер",
    avatar: "/assets/images/avatar.png",
  },
];

export default function ImportUsers({
  isOpen,
  onClose,
  onImport,
}: ImportUsersProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedUsers((prev) =>
      prev.size === crmUsers.length
        ? new Set()
        : new Set(crmUsers.map((user) => user.id))
    );
  };

  const handleImport = () => {
    if (onImport) {
      const selectedUsersData = crmUsers.filter((user) =>
        selectedUsers.has(user.id)
      );
      onImport(selectedUsersData);
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
                <h2 className="text-lg font-medium">
                  Импортировать пользователей из CRM
                </h2>
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
                <div className="flex gap-3 bg-sky-50 border border-sky-500 rounded-lg py-4 px-5">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16V12M12 8H12.01M3.84995 8.6201C3.70399 7.96262 3.7264 7.27894 3.91511 6.63244C4.10381 5.98593 4.4527 5.39754 4.92942 4.92182C5.40614 4.4461 5.99526 4.09844 6.64216 3.91109C7.28905 3.72374 7.97278 3.70276 8.62995 3.8501C8.99166 3.2844 9.48995 2.81886 10.0789 2.49638C10.6678 2.17391 11.3285 2.00488 11.9999 2.00488C12.6714 2.00488 13.332 2.17391 13.921 2.49638C14.5099 2.81886 15.0082 3.2844 15.3699 3.8501C16.0281 3.70212 16.713 3.72301 17.3609 3.91081C18.0089 4.09862 18.5988 4.44724 19.0758 4.92425C19.5528 5.40126 19.9014 5.99117 20.0892 6.6391C20.277 7.28703 20.2979 7.97193 20.1499 8.6301C20.7156 8.99181 21.1812 9.4901 21.5037 10.079C21.8261 10.668 21.9952 11.3286 21.9952 12.0001C21.9952 12.6715 21.8261 13.3322 21.5037 13.9211C21.1812 14.5101 20.7156 15.0084 20.1499 15.3701C20.2973 16.0273 20.2763 16.711 20.089 17.3579C19.9016 18.0048 19.554 18.5939 19.0782 19.0706C18.6025 19.5473 18.0141 19.8962 17.3676 20.0849C16.7211 20.2736 16.0374 20.2961 15.3799 20.1501C15.0187 20.718 14.52 21.1855 13.9301 21.5094C13.3401 21.8333 12.678 22.0032 12.0049 22.0032C11.3319 22.0032 10.6698 21.8333 10.0798 21.5094C9.48987 21.1855 8.99119 20.718 8.62995 20.1501C7.97278 20.2974 7.28905 20.2765 6.64216 20.0891C5.99526 19.9018 5.40614 19.5541 4.92942 19.0784C4.4527 18.6027 4.10381 18.0143 3.91511 17.3678C3.7264 16.7213 3.70399 16.0376 3.84995 15.3801C3.27991 15.0193 2.81036 14.5203 2.485 13.9293C2.15963 13.3384 1.98901 12.6747 1.98901 12.0001C1.98901 11.3255 2.15963 10.6618 2.485 10.0709C2.81036 9.47992 3.27991 8.98085 3.84995 8.6201Z"
                      stroke="#0EA5E9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Здесь отображаются контакты, которые добавлены в интеграции с
                  CRM
                </div>

                {/* Select All */}
                <div className="flex items-center gap-3 py-2">
                  <div>
                    <input
                      type="checkbox"
                      id="select-all-users"
                      className="peer hidden"
                      checked={
                        selectedUsers.size === crmUsers.length &&
                        crmUsers.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all-users"
                      className="size-4 flex-center border border-base-foreground rounded-[2px] peer-checked:bg-base-chart-1 peer-checked:border-base-chart-1 shadow-primary cursor-pointer"
                    >
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.3346 1L4.0013 8.33333L0.667969 5"
                          stroke="#FAFAFA"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </label>
                  </div>
                  <span className="text-sm font-medium">
                    Выбрать всех ({selectedUsers.size}/{crmUsers.length})
                  </span>
                </div>

                {/* Users list */}
                <ul className="space-y-3">
                  {crmUsers.map((user) => (
                    <li
                      key={user.id}
                      className="flex-between gap-5 border border-base-border rounded-md py-4 pr-4 pl-6"
                    >
                      <div className="flex items-center gap-6">
                        {/* checkbox */}
                        <div>
                          <input
                            type="checkbox"
                            id={`user-checkbox-${user.id}`}
                            className="peer hidden"
                            checked={selectedUsers.has(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                          />
                          <label
                            htmlFor={`user-checkbox-${user.id}`}
                            className="size-4 flex-center border border-base-foreground rounded-[2px] peer-checked:bg-base-chart-1 peer-checked:border-base-chart-1 shadow-primary cursor-pointer"
                          >
                            <svg
                              width="12"
                              height="9"
                              viewBox="0 0 12 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.3346 1L4.0013 8.33333L0.667969 5"
                                stroke="#FAFAFA"
                                strokeWidth="1.33"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </label>
                        </div>

                        <div className="space-y-1 text-base-muted-foreground">
                          <p className="leading-none">
                            <span className="font-medium text-base-card-foreground">
                              {user.name}
                            </span>{" "}
                            ·{" "}
                            <a
                              href={`mailto:${user.email}`}
                              className="hover:underline"
                            >
                              {user.email}
                            </a>
                          </p>
                          <p className="text-base-muted-foreground">
                            {user.jobTitle}
                          </p>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="size-9 rounded-md shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="size-full object-cover"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-2 mt-20">
                <Button variant="outline" onClick={onClose}>
                  Отмена
                </Button>
                <Button variant="primary" onClick={handleImport}>
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
