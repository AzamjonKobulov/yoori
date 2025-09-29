import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import React from "react";

interface AddNewUserProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser?: (userData: {
    lastName: string;
    firstName: string;
    middleName: string;
    email: string;
    role: string;
    avatar: string;
    password?: string;
  }) => void;
  initialData?: {
    id: string;
    lastName: string;
    firstName: string;
    middleName: string;
    email: string;
    role: string;
    avatar: string;
    status?: string;
    password?: string;
  };
  isEditing?: boolean;
}

const userRoles = ["Администратор", "Менеджер", "Пользователь", "Гость"];

export default function AddNewUser({
  isOpen,
  onClose,
  onAddUser,
  initialData,
  isEditing = false,
}: AddNewUserProps) {
  const [formData, setFormData] = useState({
    lastName: initialData?.lastName || "",
    firstName: initialData?.firstName || "",
    middleName: initialData?.middleName || "",
    email: initialData?.email || "",
    role: initialData?.role || "",
    avatar: initialData?.avatar || "/assets/images/avatar.png",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialData?.avatar || null
  );

  // Role dropdown state
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Form change detection state
  const [hasFormChanged, setHasFormChanged] = useState(false);

  // Function to check if form has changed from initial data
  const checkFormChanges = useCallback(() => {
    if (!initialData) {
      // For new users, check if any field has content
      const hasContent =
        formData.lastName.trim() !== "" ||
        formData.firstName.trim() !== "" ||
        formData.middleName.trim() !== "" ||
        formData.email.trim() !== "" ||
        formData.role.trim() !== "" ||
        formData.password.trim() !== "" ||
        selectedImage !== null;
      setHasFormChanged(hasContent);
    } else {
      // For editing, check if any field has changed from initial data
      const hasChanged =
        formData.lastName !== initialData.lastName ||
        formData.firstName !== initialData.firstName ||
        formData.middleName !== initialData.middleName ||
        formData.email !== initialData.email ||
        formData.role !== initialData.role ||
        formData.password !== (initialData.password || "") ||
        selectedImage !== initialData.avatar;
      setHasFormChanged(hasChanged);
    }
  }, [formData, selectedImage, initialData]);

  // Close role dropdown on outside click
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (roleRef.current && !roleRef.current.contains(target)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    return () => document.removeEventListener("mousedown", onDocClick, true);
  }, []);

  const toggleRoleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRoleOpen((p) => !p);
  };

  const handleRoleSelect = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));
    setIsRoleOpen(false);
  };

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        lastName: initialData.lastName,
        firstName: initialData.firstName,
        middleName: initialData.middleName,
        email: initialData.email,
        role: initialData.role,
        avatar: initialData.avatar,
        password: initialData.password || "", // Pre-fill password field for editing
      });
      setSelectedImage(initialData.avatar);
    } else {
      // Reset form when adding new user
      setFormData({
        lastName: "",
        firstName: "",
        middleName: "",
        email: "",
        role: "",
        avatar: "/assets/images/avatar.png",
        password: "",
      });
      setSelectedImage(null);
    }
    // Reset form change detection when initialData changes
    setHasFormChanged(false);
  }, [initialData, isEditing]);

  // Check for form changes whenever formData or selectedImage changes
  React.useEffect(() => {
    checkFormChanges();
  }, [checkFormChanges]);

  const handleSubmit = () => {
    if (
      onAddUser &&
      formData.lastName &&
      formData.firstName &&
      formData.email &&
      formData.role
    ) {
      // Use selected image if available, otherwise use default
      const userData = {
        ...formData,
        avatar: selectedImage || formData.avatar,
      };

      onAddUser(userData);
      onClose();

      // Reset form and image
      setFormData({
        lastName: "",
        firstName: "",
        middleName: "",
        email: "",
        role: "",
        avatar: "/assets/images/avatar.png",
        password: "",
      });
      setSelectedImage(null);
      setHasFormChanged(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Пожалуйста, выберите файл формата PNG, JPEG или GIF");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Размер файла не должен превышать 10МБ");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
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
                <div className="flex-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-lg/7 font-semibold">
                      {isEditing
                        ? "Редактировать пользователя"
                        : "Добавить пользователя"}
                    </h2>
                    {isEditing && initialData?.status && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-md shadow ${
                          initialData.status === "Активен"
                            ? "bg-teal-500 text-white"
                            : initialData.status === "Заблокирован"
                            ? "bg-base-destructive text-white"
                            : "bg-base-muted text-base-foreground"
                        }`}
                      >
                        {initialData.status}
                      </span>
                    )}
                  </div>

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

                <div className="space-y-5 mt-5 flex-1">
                  <div className="space-y-4">
                    <p className="font-medium text-base-muted-foreground text-sm/5">
                      Фото пользователя
                    </p>

                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="size-18 shrink bg-black/5 flex-center border border-base-border rounded-md overflow-hidden">
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                              stroke="#B3B3B3"
                              strokeWidth="1.66"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-base-border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            {selectedImage ? (
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
                            ) : (
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
                            )}
                            {selectedImage ? "Заменить" : "Загрузить"}
                          </label>

                          <Button
                            variant="outline"
                            className="flex items-center gap-2 group disabled:pointer-events-none disabled:text-base-muted-foreground"
                            disabled={!selectedImage}
                            onClick={handleRemoveImage}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className=" stroke-black group-disabled:stroke-base-foreground"
                            >
                              <path
                                d="M2 4.00004H14M12.6667 4.00004V13.3334C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3334V4.00004M5.33333 4.00004V2.66671C5.33333 2.00004 6 1.33337 6.66667 1.33337H9.33333C10 1.33337 10.6667 2.00004 10.6667 2.66671V4.00004M6.66667 7.33337V11.3334M9.33333 7.33337V11.3334"
                                strokeWidth="1.33"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Удалить
                          </Button>
                        </div>
                        <p className="text-base-muted-foreground text-xs">
                          Мы поддерживаем PNG, JPEG и GIF файлы размером до
                          10МБ.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm/3.5">
                      Фамилия
                    </label>

                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm/3.5">
                      Имя
                    </label>

                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="middleName" className="block text-sm/3.5">
                      Отчество
                    </label>

                    <input
                      type="text"
                      id="middleName"
                      value={formData.middleName}
                      onChange={(e) =>
                        handleInputChange("middleName", e.target.value)
                      }
                      className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm/3.5">
                      Почта
                    </label>

                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                    />
                  </div>

                  <div
                    className={`space-y-2 pb-5 ${
                      isEditing ? "border-b border-base-border" : ""
                    }`}
                  >
                    <label className="block text-sm/3.5">
                      Роль пользователя
                    </label>

                    <div className="relative text-sm/5" ref={roleRef}>
                      <button
                        className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                          formData.role
                            ? "text-base-foreground"
                            : "text-base-muted-foreground"
                        } ${
                          isEditing ? "border-b-2 border-b-base-chart-1" : ""
                        }`}
                        onClick={toggleRoleDropdown}
                      >
                        {formData.role || "Выберите роль"}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transition-transform duration-200 ${
                            isRoleOpen ? "rotate-180" : ""
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
                        {isRoleOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                          >
                            <ul className="p-1">
                              {userRoles.map((role) => (
                                <li
                                  key={role}
                                  className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                    formData.role === role
                                      ? "bg-base-muted"
                                      : "hover:bg-base-muted"
                                  }`}
                                  onClick={() => handleRoleSelect(role)}
                                >
                                  {role}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <p className="text-base-muted-foreground text-xs">
                      Роль влияет на то, какие действия будут доступны
                      пользователю
                    </p>
                  </div>

                  {/* Password field - only show in editing mode */}
                  {isEditing && (
                    <div className="space-y-2 pb-4">
                      <label className="block text-sm/3.5">Пароль</label>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md pl-3 pr-10"
                          placeholder="Введите новый пароль"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="stroke-base-muted-foreground"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="stroke-base-muted-foreground"
                            >
                              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                              <path d="m10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                              <line x1="2" x2="22" y1="2" y2="22" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-4 mt-20">
                  <Button variant="outline" onClick={onClose}>
                    Отмена
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={
                      !formData.lastName ||
                      !formData.firstName ||
                      !formData.email ||
                      !formData.role ||
                      (isEditing && !hasFormChanged)
                    }
                  >
                    {isEditing
                      ? "Сохранить изменения"
                      : "Добавить пользователя"}
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
