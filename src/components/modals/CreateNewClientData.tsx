import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks";
import { apiCP } from "../../http/apis";

interface CreateNewClientProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
    onDone?:
        | ((clientData: {
              name: string;
              type: string;
              manager: string;
              phone: string;
              email: string;
              contact: string;
              description: string;
          }) => void)
        | (() => void);
    editingClient?: {
        id: string;
        name?: string;
        type?: string;
        manager?: string;
        phone?: string;
        email?: string;
        contact?: string;
        description?: string;
    } | null;
    onDelete?: () => void;
}

export default function CreateNewClientData({
    isOpen,
    onClose,
    onBack,
    onDone,
    editingClient,
    onDelete,
}: CreateNewClientProps) {
    // Lock body scroll when modal is open
    useModalBodyLock(isOpen);

    // Тип клиента select
    const [isClientTypeOpen, setIsClientTypeOpen] = useState(false);
    const [selectedClientType, setSelectedClientType] = useState("");
    const clientTypeOptions = ["Физическое лицо", "Юридическое лицо"];
    const clientTypeRef = useRef<HTMLDivElement>(null);

    async function getCurrentManagerName() {
        try {
            const res = await apiCP.get(
                `/user/v1/${localStorage.getItem("manager_id")}`
            );
            return res.data.name;
        } catch (err) {
            console.log(err);
        }
    }

    async function createClient() {
        try {
            await apiCP.post("/client/v1/create/", {
                type:
                    selectedClientType == "Физическое лицо"
                        ? "client"
                        : "company",
                email: emails,
                manager_id: localStorage.getItem("manager_id"),
                name,
                phone: phones,
                contact_person: contactPerson,
            });
        } catch (err) {
            console.log(err);
        }
    }
    async function editClient() {
        try {
            await apiCP.patch(`/client/v1/${editingClient?.id}/`, {
                type:
                    selectedClientType == "Физическое лицо"
                        ? "client"
                        : "company",
                email: emails,
                manager_id: localStorage.getItem("manager_id"),
                name,
                phone: phones,
                contact_person: contactPerson,
            });
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteClient() {
        try {
            await apiCP.delete(`/client/v1/${editingClient?.id}/`);
        } catch (err) {
            console.log(err);
        }
    }

    // Ответственный select
    const [isResponsibleOpen, setIsResponsibleOpen] = useState(false);
    const [selectedResponsible, setSelectedResponsible] = useState("");
    const responsibleOptions = [
        "Кулешов Кирилл",
        "Петров Александр",
        "Иванова Мария",
        "Смирнов Денис",
    ];
    const responsibleRef = useRef<HTMLDivElement>(null);

    // Form fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    // Dynamic contact fields
    const [phones, setPhones] = useState<string[]>([""]);
    const [emails, setEmails] = useState<string[]>([""]);

    // Populate form with editing client data
    useEffect(() => {
        if (editingClient && isOpen) {
            setName(editingClient.name || "");
            setDescription(editingClient.description || "");
            setContactPerson(editingClient.contact || "");
            setSelectedClientType(editingClient.type || "");
            setSelectedResponsible(editingClient.manager || "");

            // Handle multiple phones/emails
            const phoneList = editingClient.phone
                ? editingClient.phone.split(", ").filter((p) => p.trim())
                : [""];
            const emailList = editingClient.email
                ? editingClient.email.split(", ").filter((e) => e.trim())
                : [""];

            setPhones(phoneList.length > 0 ? phoneList : [""]);
            setEmails(emailList.length > 0 ? emailList : [""]);
            setHasChanges(false);
        } else if (!editingClient && isOpen) {
            // Reset for new client creation
            clearForm();
            setHasChanges(false);
        }
    }, [editingClient, isOpen]);

    // Close dropdowns on outside click
    useEffect(() => {
        const onDocClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                clientTypeRef.current &&
                !clientTypeRef.current.contains(target)
            ) {
                setIsClientTypeOpen(false);
            }
            if (
                responsibleRef.current &&
                !responsibleRef.current.contains(target)
            ) {
                setIsResponsibleOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick, true);
        return () =>
            document.removeEventListener("mousedown", onDocClick, true);
    }, []);

    const onDeleteClient = () => {
        deleteClient();
        if (onDelete) onDelete();
    };

    const toggleClientTypeDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsClientTypeOpen((p) => !p);
    };

    const handleClientTypeSelect = (type: string) => {
        setSelectedClientType(type);
        setIsClientTypeOpen(false);
        setHasChanges(true);
    };

    const toggleResponsibleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResponsibleOpen((p) => !p);
    };

    const handleResponsibleSelect = (value: string) => {
        setSelectedResponsible(value);
        setIsResponsibleOpen(false);
        setHasChanges(true);
    };

    const handlePhoneChange = (index: number, value: string) => {
        setPhones((prev) => prev.map((p, i) => (i === index ? value : p)));
        setHasChanges(true);
    };

    const handleAddPhone = () =>
        setPhones((prev) => (prev.length < 3 ? [...prev, ""] : prev));

    const handleRemovePhone = (index: number) => {
        if (phones.length > 1) {
            setPhones((prev) => prev.filter((_, i) => i !== index));
            setHasChanges(true);
        }
    };

    const handleEmailChange = (index: number, value: string) => {
        setEmails((prev) => prev.map((e, i) => (i === index ? value : e)));
        setHasChanges(true);
    };

    const handleAddEmail = () =>
        setEmails((prev) => (prev.length < 3 ? [...prev, ""] : prev));

    const handleRemoveEmail = (index: number) => {
        if (emails.length > 1) {
            setEmails((prev) => prev.filter((_, i) => i !== index));
            setHasChanges(true);
        }
    };

    // Clear all form inputs
    const clearForm = () => {
        setName("");
        setDescription("");
        setContactPerson("");
        setSelectedClientType("");
        setSelectedResponsible("");
        setPhones([""]);
        setEmails([""]);
        setHasChanges(false);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!onDone) {
            onClose();
            return;
        }

        editingClient ? await editClient() : await createClient();
        const clients = await apiCP.get("/client/v1/list");
        console.log(clients);
        const newClient = clients.data.items.filter(
            (item: any) => item.name == name
        )[0];
        console.log(newClient);

        const clientData = {
            id: newClient.id,
            name,
            type: selectedClientType || "Компания",
            manager: selectedResponsible || (await getCurrentManagerName()),
            phone: phones.filter((p) => p.trim()).join(", "),
            email: emails.filter((e) => e.trim()).join(", "),
            contact: contactPerson,
            description,
        };


        // Check if onDone expects parameters or not
        if (onDone.length === 0) {
            // Legacy callback with no parameters
            (onDone as () => void)();
        } else {
            // New callback with client data
            (
                onDone as (clientData: {
                    name: string;
                    type: string;
                    manager: string;
                    phone: string;
                    email: string;
                    contact: string;
                    description: string;
                }) => void
            )(clientData);
        }

        // Clear form after successful submission
        clearForm();
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
                                            {editingClient
                                                ? "Редактировать клиента"
                                                : "Создать нового клиента"}
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

                                {/* Type Client */}
                                <div className="space-y-2 text-sm/5">
                                    <label className="block text-sm/3.5">
                                        Тип клиента
                                    </label>
                                    <div
                                        className="relative"
                                        ref={clientTypeRef}
                                    >
                                        <button
                                            className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                                                selectedClientType
                                                    ? "text-base-foreground"
                                                    : "text-base-muted-foreground"
                                            }`}
                                            onClick={toggleClientTypeDropdown}
                                        >
                                            {selectedClientType || "Компания"}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`transition-transform duration-200 ${
                                                    isClientTypeOpen
                                                        ? "rotate-180"
                                                        : ""
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
                                            {isClientTypeOpen && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    transition={{
                                                        duration: 0.15,
                                                    }}
                                                    className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                                                >
                                                    <ul className="p-1">
                                                        {clientTypeOptions.map(
                                                            (type) => (
                                                                <li
                                                                    key={type}
                                                                    className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                                                        selectedClientType ===
                                                                        type
                                                                            ? "bg-base-muted"
                                                                            : "hover:bg-base-muted"
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleClientTypeSelect(
                                                                            type
                                                                        )
                                                                    }
                                                                >
                                                                    {type}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Name */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm/3.5"
                                    >
                                        Название
                                    </label>

                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setHasChanges(true);
                                        }}
                                        className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm/3.5"
                                    >
                                        Описание
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            setHasChanges(true);
                                        }}
                                        className="w-full h-26.5 resize-none border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 py-2"
                                        placeholder="Введите описание"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm/3.5"
                                    >
                                        Телефон
                                    </label>
                                    <div className="space-y-2">
                                        {phones.map((phone, index) => (
                                            <div
                                                className="relative"
                                                key={index}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                                >
                                                    <g clipPath="url(#clip0_1698_31475)">
                                                        <path
                                                            d="M14.6669 11.28V13.28C14.6677 13.4657 14.6297 13.6495 14.5553 13.8196C14.4809 13.9897 14.3718 14.1424 14.235 14.2679C14.0982 14.3934 13.9367 14.489 13.7608 14.5485C13.5849 14.608 13.3985 14.6301 13.2136 14.6133C11.1622 14.3904 9.19161 13.6894 7.46028 12.5667C5.8495 11.5431 4.48384 10.1775 3.46028 8.56668C2.3336 6.82748 1.63244 4.84734 1.41361 2.78668C1.39695 2.60233 1.41886 2.41652 1.47795 2.2411C1.53703 2.06567 1.63199 1.90447 1.75679 1.76776C1.88159 1.63105 2.03348 1.52182 2.20281 1.44703C2.37213 1.37224 2.55517 1.33352 2.74028 1.33335H4.74028C5.06382 1.33016 5.37748 1.44473 5.62279 1.6557C5.8681 1.86667 6.02833 2.15964 6.07361 2.48001C6.15803 3.12006 6.31458 3.7485 6.54028 4.35335C6.62998 4.59196 6.64939 4.85129 6.59622 5.1006C6.54305 5.34991 6.41952 5.57875 6.24028 5.76001L5.39361 6.60668C6.34265 8.27571 7.72458 9.65764 9.39361 10.6067L10.2403 9.76001C10.4215 9.58077 10.6504 9.45725 10.8997 9.40408C11.149 9.35091 11.4083 9.37032 11.6469 9.46001C12.2518 9.68571 12.8802 9.84227 13.5203 9.92668C13.8441 9.97237 14.1399 10.1355 14.3513 10.385C14.5627 10.6345 14.6751 10.9531 14.6669 11.28Z"
                                                            stroke="#71717A"
                                                            strokeWidth="1.33"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1698_31475">
                                                            <rect
                                                                width="16"
                                                                height="16"
                                                                fill="white"
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <input
                                                    type="tel"
                                                    id={`phone-${index}`}
                                                    value={phone}
                                                    onChange={(e) =>
                                                        handlePhoneChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md pl-9 ${
                                                        index > 0
                                                            ? "pr-9"
                                                            : "pr-3"
                                                    }`}
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemovePhone(
                                                                index
                                                            )
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex-center hover:bg-base-border/50 rounded"
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
                                                                stroke="#71717A"
                                                                strokeWidth="1.33"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={handleAddPhone}
                                        className="flex items-center gap-2 text-base-chart-1 hover:bg-base-muted transition-colors duration-200 rounded-md px-3 py-2"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.33398 8.00001H12.6673M8.00065 3.33334V12.6667"
                                                stroke="#8942FE"
                                                strokeWidth="1.33"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Добавить еще
                                    </Button>
                                </div>

                                {/* Email */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm/3.5"
                                    >
                                        Почта
                                    </label>
                                    <div className="space-y-2">
                                        {emails.map((email, index) => (
                                            <div
                                                className="relative"
                                                key={index}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                                >
                                                    <path
                                                        d="M14.6673 4.66667L8.68732 8.46667C8.4815 8.59562 8.24353 8.66401 8.00065 8.66401C7.75777 8.66401 7.5198 8.59562 7.31398 8.46667L1.33398 4.66667M2.66732 2.66667H13.334C14.0704 2.66667 14.6673 3.26363 14.6673 4.00001V12C14.6673 12.7364 14.0704 13.3333 13.334 13.3333H2.66732C1.93094 13.3333 1.33398 12.7364 1.33398 12V4.00001C1.33398 3.26363 1.93094 2.66667 2.66732 2.66667Z"
                                                        stroke="#71717A"
                                                        strokeWidth="1.33"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <input
                                                    type="email"
                                                    id={`email-${index}`}
                                                    value={email}
                                                    onChange={(e) =>
                                                        handleEmailChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md pl-9 ${
                                                        index > 0
                                                            ? "pr-9"
                                                            : "pr-3"
                                                    }`}
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveEmail(
                                                                index
                                                            )
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex-center hover:bg-base-border/50 rounded"
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
                                                                stroke="#71717A"
                                                                strokeWidth="1.33"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={handleAddEmail}
                                        className="flex items-center gap-2 text-base-chart-1 hover:bg-base-muted transition-colors duration-200 rounded-md px-3 py-2"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.33398 8.00001H12.6673M8.00065 3.33334V12.6667"
                                                stroke="#8942FE"
                                                strokeWidth="1.33"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Добавить еще
                                    </Button>
                                </div>

                                {/* Type Client */}
                                <div className="space-y-2 text-sm/5">
                                    <label className="block text-sm/3.5">
                                        Ответственный
                                    </label>
                                    <div
                                        className="relative"
                                        ref={responsibleRef}
                                    >
                                        <button
                                            className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                                                selectedResponsible
                                                    ? "text-base-foreground"
                                                    : "text-base-muted-foreground"
                                            }`}
                                            onClick={toggleResponsibleDropdown}
                                        >
                                            {selectedResponsible ||
                                                "Выберите ответственного"}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`transition-transform duration-200 ${
                                                    isResponsibleOpen
                                                        ? "rotate-180"
                                                        : ""
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
                                            {isResponsibleOpen && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    transition={{
                                                        duration: 0.15,
                                                    }}
                                                    className="absolute w-full border border-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                                                >
                                                    <ul className="p-1">
                                                        {responsibleOptions.map(
                                                            (name) => (
                                                                <li
                                                                    key={name}
                                                                    className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                                                        selectedResponsible ===
                                                                        name
                                                                            ? "bg-base-muted"
                                                                            : "hover:bg-base-muted"
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleResponsibleSelect(
                                                                            name
                                                                        )
                                                                    }
                                                                >
                                                                    {name}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Contact person */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="contactPerson"
                                        className="block text-sm/3.5"
                                    >
                                        Контактное лицо
                                    </label>

                                    <input
                                        type="text"
                                        id="contactPerson"
                                        value={contactPerson}
                                        onChange={(e) => {
                                            setContactPerson(e.target.value);
                                            setHasChanges(true);
                                        }}
                                        className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                                    />
                                </div>

                                <div className="relative z-10 flex items-center justify-between gap-4 mt-auto pt-20">
                                    {editingClient && onDelete && (
                                        <Button
                                            variant="ghost"
                                            className="text-base-destructive font-medium"
                                            onClick={onDeleteClient}
                                        >
                                            Удалить клиента
                                        </Button>
                                    )}

                                    <div className="flex items-center gap-4 ml-auto">
                                        <Button
                                            variant="outline"
                                            onClick={onClose}
                                        >
                                            Отмена
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={handleSubmit}
                                            disabled={
                                                !!(editingClient && !hasChanges)
                                            }
                                        >
                                            {editingClient
                                                ? "Сохранить изменения"
                                                : "Создать"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
