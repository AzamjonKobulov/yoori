import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import DeleteConfirmation from "./DeleteConfirmation";
import { apiCP } from "../../http/apis";

interface AddCrmFieldsProps {
    offerId: string;
    isOpen: boolean;
    onClose: () => void;
    onUpdateFields?: (fields: Array<{ id: string; name: string }>) => void;
}

interface CrmField {
    id: string;
    name: string;
}

export default function AddCrmFields({
    offerId,
    isOpen,
    onClose,
    onUpdateFields,
}: AddCrmFieldsProps) {
    // const defaultFields = [
    //   { id: "1", name: "Адрес площадки" },
    //   { id: "2", name: "Дата окончания проекта" },
    //   { id: "3", name: "Комментарий" },
    //   { id: "4", name: "Дата проекта" },
    //   { id: "5", name: "Налог" },
    //   { id: "6", name: "Обратная связь" },
    //   { id: "7", name: "Первая коммуникация" },
    // ];

    // const initialFields = defaultFields;
    useEffect(() => {
        getCrmFields();
    }, []);

    async function getCrmFields() {
        try {
            const res = await apiCP.get(`/offer/field/v1/${offerId}/list`);
            setCrmFields(
                res.data.items.map((item: any) => {
                    return {
                        id: item.id,
                        name: item.name,
                        value: item.value,
                    };
                })
            );
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteCrmField(id: any) {
        try {
            await apiCP.delete(`/offer/field/v1/${id}/`);
            getCrmFields();
        } catch (err) {
            console.log(err);
        }
    }

    const [crmFields, setCrmFields] = useState<CrmField[]>([]);
    const [originalFields, setOriginalFields] = useState<CrmField[]>([]);

    const [showDropdown, setShowDropdown] = useState(false);
    const [newFieldName, setNewFieldName] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState<CrmField | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleDeleteField = (fieldId: string) => {
        const field = crmFields.find((f) => f.id === fieldId);
        if (field) {
            setFieldToDelete(field);
            setShowDeleteConfirmation(true);
        }
    };

    const confirmDeleteField = async () => {
        if (fieldToDelete) {
            setCrmFields(crmFields.filter((field:any) => field.id !== fieldToDelete.id));
            await deleteCrmField(fieldToDelete.id);
            setFieldToDelete(null);
        }
    };

    const handleAddField = () => {
        if (newFieldName.trim()) {
            const newField: CrmField = {
                id: Date.now().toString(),
                name: newFieldName.trim(),
            };
            setCrmFields((prev) => [...prev, newField]);
            setNewFieldName("");
            setShowDropdown(false);
        }
    };

    const handleSaveFields = () => {
        // Save the current state as the new original state
        setOriginalFields([...crmFields]);
        // Call the parent's update function if provided
        if (onUpdateFields) {
            onUpdateFields(crmFields);
        }
        onClose();
    };

    const handleClose = () => {
        // Reset to original state if there are unsaved changes
        if (hasChanges) {
            setCrmFields([...originalFields]);
        }
        setShowDropdown(false);
        setNewFieldName("");
        onClose();
    };

    const availableFields = [
        "Адрес площадки",
        "Дата окончания проекта",
        "Комментарий",
        "Дата проекта",
        "Налог",
        "Обратная связь",
        "Первая коммуникация",
        "Бюджет проекта",
        "Контактное лицо",
        "Источник лида",
        "Статус сделки",
        "Приоритет",
        "Тип проекта",
        "Длительность проекта",
        "Команда проекта",
    ].filter((field) => !crmFields.some((existing) => existing.name === field));

    // Check if fields have been modified
    const hasChanges =
        JSON.stringify(crmFields) !== JSON.stringify(originalFields);

    if (!isOpen) return null;

    return (
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
                    className="bg-white shadow-lg border border-base-border transform h-full "
                >
                    <div className="p-5 space-y-5 h-full flex flex-col overflow-y-auto">
                        <div className="flex-between">
                            <h2 className="text-lg/7 font-semibold">
                                Добавить поля в CRM
                            </h2>

                            <button
                                className="size-8 shrink-0 flex-center hover:bg-base-border/50 rounded-md"
                                onClick={handleClose}
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
                                            stroke-width="1.33"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </g>
                                </svg>
                            </button>
                        </div>

                        {/* Content placeholder */}
                        <div className="flex-1 space-y-5">
                            <p className="font-medium">Поля сделки</p>
                            <ul className="space-y-2 text-sm/5 font-medium">
                                {crmFields.map((field) => (
                                    <li
                                        key={field.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-1 bg-base-muted rounded-lg p-2">
                                            {field.name}
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="!size-9 flex-center !p-0"
                                            onClick={() =>
                                                handleDeleteField(field.id)
                                            }
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M2 4.00001H14M12.6667 4.00001V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4.00001M5.33333 4.00001V2.66668C5.33333 2.00001 6 1.33334 6.66667 1.33334H9.33333C10 1.33334 10.6667 2.00001 10.6667 2.66668V4.00001M6.66667 7.33334V11.3333M9.33333 7.33334V11.3333"
                                                    stroke="#DC2626"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </Button>
                                    </li>
                                ))}
                            </ul>

                            {/* Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setShowDropdown(!showDropdown)
                                    }
                                >
                                    Добавить поле{" "}
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transition-transform duration-200 ${
                                            showDropdown ? "rotate-180" : ""
                                        }`}
                                    >
                                        <path
                                            d="M4 6L8 10L12 6"
                                            stroke="#18181B"
                                            stroke-width="1.33"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </Button>

                                {showDropdown && (
                                    <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md z-10 border border-base-border mt-1 p-2">
                                        <div className="max-h-36 overflow-y-auto mb-2">
                                            {availableFields.map((field) => (
                                                <button
                                                    key={field}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-base-muted rounded-md transition-colors"
                                                    onClick={() => {
                                                        const newField: CrmField =
                                                            {
                                                                id: Date.now().toString(),
                                                                name: field,
                                                            };
                                                        setCrmFields((prev) => [
                                                            ...prev,
                                                            newField,
                                                        ]);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    {field}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-t border-base-border pt-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newFieldName}
                                                    onChange={(e) =>
                                                        setNewFieldName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Введите название поля"
                                                    className="flex-1 px-3 py-2 text-sm border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-border"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleAddField();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="primary"
                                                    className="px-3 py-1.5 text-sm"
                                                    onClick={handleAddField}
                                                    disabled={
                                                        !newFieldName.trim()
                                                    }
                                                >
                                                    Добавить
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-4 mt-20">
                            <Button variant="outline" onClick={handleClose}>
                                Отмена
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSaveFields}
                            >
                                {hasChanges
                                    ? "Сохранить поля"
                                    : "Добавить поля"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirmation && fieldToDelete && (
                    <DeleteConfirmation
                        onClose={() => {
                            setShowDeleteConfirmation(false);
                            setFieldToDelete(null);
                        }}
                        onConfirm={confirmDeleteField}
                        title="Удалить поле"
                        message={`Вы уверены, что хотите удалить поле «${fieldToDelete.name}»? Это действие нельзя отменить.`}
                        confirmText="Удалить"
                        cancelText="Отмена"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
