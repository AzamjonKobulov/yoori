import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useDropdownPosition, useModalBodyLock } from "../../hooks";
import { apiCP } from "../../http/apis";

interface CreateCommercialOfferProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenCreateClient: () => void;
    onNavigateToDetails: (item:any) => void;
}

export default function CreateCommercialOffer({
    isOpen,
    onClose,
    onOpenCreateClient,
    onNavigateToDetails,
}: CreateCommercialOfferProps) {
    const [templates, setTemplates] = useState<any>([]);
    const [managers, setManagers] = useState<any>([]);
    const [clients, setClients] = useState<any>([]);

    const [template, setTemplate] = useState<any>();
    const [manager, setManager] = useState<any>();
    const [client, setClient] = useState<any>();
    const [name, setName] = useState<any>();

    useEffect(() => {
        async function start() {
            if (apiCP.defaults.baseURL === "https://api-dev.yoori.pro") {
                const userInfo = await apiCP.get("/user/v1/current/info");
                console.log(userInfo.data.domain);
                apiCP.defaults.baseURL = `https://${userInfo.data.domain}`;
            }

            getTemplates();
            getClients();
        }

        start();
    }, []);

    useEffect(() => {
      console.log(client);
    }, [client])

    async function createOffer(name:any) {
        try {
            if (template?.id) {
                const res = (await apiCP.post(`/offer/v1/${template.id}/copy/`)).data;
                await apiCP.patch(`/offer/v1/${res.id}/`, {
                    name,
                    status: "created",
                    // template_id: template.id,
                    client_id: client.id,
                    is_template: false,
                    is_draft: false,
                });
            } else {
                await apiCP.post("/offer/v1/create/", {
                  name,
                  client_id: client.id,
                  manager: manager?.id,
                  template: template?.id,
                  description: ""
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    // async function createClient(event:any) {
    //   event.preventDefault();

    //   try {

    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    // async function getTemplates() {
    //   try {
    //     const res = await apiCP.get("/offer/v1/template/list");

    //     setTemplates(res.data.items);
    //     setTemplateOptions(templates.map((item:any) => item.name));
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    // async function getUsers(event:any) {
    //   event.preventDefault();

    //   try {

    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    async function getClients() {
        try {
            const res = await apiCP.get("client/v1/list");
            setClients(res.data.items);
            setClientOptions(res.data.items.map((item: any) => item.name));
        } catch (err) {
            console.log(err);
        }
    }

    async function getTemplates() {
        try {
            const res = await apiCP.get(`/offer/v1/template/list`);
            setTemplates(res.data.items);
            setTemplateOptions(res.data.items.map((item:any) => item.name));
        } catch (err) {
            console.log(err);
        }
    }
    // Lock body scroll when modal is open
    useModalBodyLock(isOpen);

    const [isTemplateOpen, setIsTemplateOpen] = useState(false);
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isClientOpen, setIsClientOpen] = useState(false);

    // Refs for dropdown positioning
    const templateRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<HTMLDivElement>(null);

    // Dropdown positioning
    const { shouldOpenUp: templateShouldOpenUp } = useDropdownPosition(
        isTemplateOpen,
        templateRef
    );

    // Selected values state
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [selectedManager, setSelectedManager] = useState("");
    const [selectedClient, setSelectedClient] = useState("");

    // Search states
    const [templateSearchTerm, setTemplateSearchTerm] = useState("");
    const [managerSearchTerm, setManagerSearchTerm] = useState("");
    const [clientSearchTerm, setClientSearchTerm] = useState("");

    // Data arrays for dropdowns
    const [templateOptions, setTemplateOptions] = useState([]);

    const managerOptions = [
        "Кулешов Кирилл",
        "Петров Александр",
        "Иванова Мария",
        "Смирнов Денис",
        "Козлова Анна",
        "Волков Сергей",
        "Новикова Елена",
        "Лебедев Дмитрий",
        "Соколова Ольга",
        "Морозов Игорь",
        "Зайцева Татьяна",
        "Комаров Андрей",
    ];

    const [clientOptions, setClientOptions] = useState([]);

    // Filtered options based on search
    const filteredTemplateOptions = templateOptions.filter((template: any) =>
        template.toLowerCase().includes(templateSearchTerm.toLowerCase())
    );

    const filteredManagerOptions = managerOptions.filter((manager: any) =>
        manager.toLowerCase().includes(managerSearchTerm.toLowerCase())
    );

    const filteredClientOptions = clientOptions.filter((client: any) =>
        client.toLowerCase().includes(clientSearchTerm.toLowerCase())
    );

    // Click outside handlers with improved logic
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Template dropdown
            if (templateRef.current && !templateRef.current.contains(target)) {
                setIsTemplateOpen(false);
                setTemplateSearchTerm(""); // Clear search when closing
            }

            // Manager dropdown
            if (managerRef.current && !managerRef.current.contains(target)) {
                setIsManagerOpen(false);
                setManagerSearchTerm(""); // Clear search when closing
            }

            // Client dropdown
            if (clientRef.current && !clientRef.current.contains(target)) {
                setIsClientOpen(false);
                setClientSearchTerm(""); // Clear search when closing
            }
        };

        // Use capture phase to ensure we catch the event early
        document.addEventListener("mousedown", handleClickOutside, true);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside, true);
    }, []);

    // Handle template selection
    const handleTemplateSelect = (template: string) => {
        console.log(template);
        setSelectedTemplate(template);
        setTemplate(templates.filter((item:any) => item.name == template)[0]);
        setIsTemplateOpen(false);
        setTemplateSearchTerm(""); // Clear search when selecting
    };

    // Handle manager selection
    const handleManagerSelect = (manager: string) => {
        setSelectedManager(manager);
        setIsManagerOpen(false);
        setManagerSearchTerm(""); // Clear search when selecting
    };

    // Handle client selection
    const handleClientSelect = (client: string) => {
        setSelectedClient(client);
        setClient(clients.filter((item: any) => item.name == client)[0]);
        setIsClientOpen(false);
        setClientSearchTerm(""); // Clear search when selecting
        console.log(client);
    };

    // Handle create client
    const handleCreateClient = () => {
        setIsClientOpen(false);
        setClientSearchTerm("");
        // Close this modal at the page level and open the CreateNewClient modal
        onOpenCreateClient();
    };

    // Handle create commercial offer
    const handleCreateOffer = async () => {
        // Close this modal and navigate to details page
        await createOffer(name);
        onClose();

        const res = await apiCP.get("/offer/v1/list");
        console.log(res);
        const resItem = res.data.items.filter((item:any) => item.name == name)[0];
        console.log(resItem);
        const item = {
            id: resItem.id,
            name,
            status: "created"
        }
        onNavigateToDetails(item);
    };

    // Toggle handlers with proper state management
    const toggleTemplateDropdown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsTemplateOpen((prev) => !prev);
        // Close other dropdowns
        setIsManagerOpen(false);
        setIsClientOpen(false);
    };

    const toggleManagerDropdown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsManagerOpen((prev) => !prev);
        // Close other dropdowns
        setIsTemplateOpen(false);
        setIsClientOpen(false);
    };

    const toggleClientDropdown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsClientOpen((prev) => !prev);
        // Close other dropdowns
        setIsTemplateOpen(false);
        setIsManagerOpen(false);
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
                                    <h2 className="text-lg/7 font-semibold">
                                        Создать новое КП
                                    </h2>

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
                                                    stroke-width="1.33"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </g>
                                        </svg>
                                    </button>
                                </div>

                                {/* Name */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm/3.5"
                                    >
                                        Название КП
                                    </label>

                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={event => setName(event.target.value)}
                                        className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                                        placeholder="Коммерческое предложение 133-001"
                                    />
                                </div>

                                {/* Template Dropdown */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="template"
                                        className="block text-sm/3.5"
                                    >
                                        Шаблон КП
                                    </label>

                                    <div className="relative" ref={templateRef}>
                                        <button
                                            className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                                                selectedTemplate
                                                    ? "text-base-foreground"
                                                    : "text-base-muted-foreground"
                                            }`}
                                            onClick={toggleTemplateDropdown}
                                        >
                                            {selectedTemplate ||
                                                "Выберите шаблон"}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`transition-transform duration-200 ${
                                                    isTemplateOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="#71717A"
                                                    stroke-width="1.33"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>

                                        <AnimatePresence>
                                            {isTemplateOpen && (
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
                                                    className={`absolute w-full border border-base-border divide-y divide-base-border rounded-md py-1 bg-white shadow-lg z-10 ${
                                                        templateShouldOpenUp
                                                            ? "bottom-full mb-1"
                                                            : "top-full mt-1"
                                                    }`}
                                                >
                                                    <div className="relative h-10">
                                                        <label
                                                            htmlFor="searchTemplate"
                                                            className="absolute left-3 top-1/2 -translate-y-1/2"
                                                        >
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 16 16"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g opacity="0.5">
                                                                    <path
                                                                        d="M14.0001 14L11.1335 11.1333M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                                                                        stroke="#09090B"
                                                                        stroke-width="1.33"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </g>
                                                            </svg>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="size-full outline-none placeholder:text-base-muted-foreground pl-9 pr-3"
                                                            placeholder="Поиск шаблона"
                                                            id="searchTemplate"
                                                            value={
                                                                templateSearchTerm
                                                            }
                                                            onChange={(e) => {
                                                                setTemplateSearchTerm(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-between text-base-foreground py-2.5 px-3.5">
                                                        Только шаблоны{" "}
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-9 h-5 bg-base-border rounded-full peer peer-checked:bg-base-chart-1 transition-colors duration-300"></div>
                                                            <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-full shadow-toggle-track"></div>
                                                        </label>
                                                    </div>
                                                    <ul className="p-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-base-border scrollbar-track-transparent">
                                                        {filteredTemplateOptions.length >
                                                        0 ? (
                                                            filteredTemplateOptions.map(
                                                                (template) => (
                                                                    <li
                                                                        key={
                                                                            template
                                                                        }
                                                                        className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                                                            selectedTemplate ===
                                                                            template
                                                                                ? "bg-base-muted"
                                                                                : "hover:bg-base-muted"
                                                                        }`}
                                                                        onClick={() =>
                                                                            handleTemplateSelect(
                                                                                template
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            template
                                                                        }
                                                                    </li>
                                                                )
                                                            )
                                                        ) : (
                                                            <li className="px-3 py-1.5 text-base-muted-foreground text-sm">
                                                                Шаблон не найден
                                                            </li>
                                                        )}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Manager Dropdown */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="manager"
                                        className="block text-sm/3.5"
                                    >
                                        Менеджер
                                    </label>

                                    <div className="relative" ref={managerRef}>
                                        <button
                                            className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                                                selectedManager
                                                    ? "text-base-foreground"
                                                    : "text-base-muted-foreground"
                                            }`}
                                            onClick={toggleManagerDropdown}
                                        >
                                            {selectedManager ||
                                                "Выберите менеджера"}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`transition-transform duration-200 ${
                                                    isManagerOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="#71717A"
                                                    stroke-width="1.33"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>

                                        <AnimatePresence>
                                            {isManagerOpen && (
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
                                                    className="absolute w-full border border-base-border divide-y divide-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                                                >
                                                    <div className="relative h-10">
                                                        <label
                                                            htmlFor="searchManager"
                                                            className="absolute left-3 top-1/2 -translate-y-1/2"
                                                        >
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 16 16"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g opacity="0.5">
                                                                    <path
                                                                        d="M14.0001 14L11.1335 11.1333M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                                                                        stroke="#09090B"
                                                                        stroke-width="1.33"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </g>
                                                            </svg>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="size-full outline-none placeholder:text-base-muted-foreground pl-9 pr-3"
                                                            placeholder="Поиск менеджера"
                                                            id="searchManager"
                                                            value={
                                                                managerSearchTerm
                                                            }
                                                            onChange={(e) => {
                                                                setManagerSearchTerm(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <ul className="p-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-base-border scrollbar-track-transparent">
                                                        {filteredManagerOptions.length >
                                                        0 ? (
                                                            filteredManagerOptions.map(
                                                                (manager) => (
                                                                    <li
                                                                        key={
                                                                            manager
                                                                        }
                                                                        className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                                                            selectedManager ===
                                                                            manager
                                                                                ? "bg-base-muted"
                                                                                : "hover:bg-base-muted"
                                                                        }`}
                                                                        onClick={() =>
                                                                            handleManagerSelect(
                                                                                manager
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            manager
                                                                        }
                                                                    </li>
                                                                )
                                                            )
                                                        ) : (
                                                            <li className="px-3 py-1.5 text-base-muted-foreground text-sm">
                                                                Менеджер не
                                                                найден
                                                            </li>
                                                        )}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Client Dropdown */}
                                <div className="space-y-2 text-sm/5">
                                    <label
                                        htmlFor="client"
                                        className="block text-sm/3.5"
                                    >
                                        Клиент
                                    </label>

                                    <div className="relative" ref={clientRef}>
                                        <button
                                            className={`w-full h-9 flex-between border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 ${
                                                selectedClient
                                                    ? "text-base-foreground"
                                                    : "text-base-muted-foreground"
                                            }`}
                                            onClick={toggleClientDropdown}
                                        >
                                            {selectedClient ||
                                                "Выберите клиента"}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`transition-transform duration-200 ${
                                                    isClientOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="#71717A"
                                                    stroke-width="1.33"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>

                                        <AnimatePresence>
                                            {isClientOpen && (
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
                                                    className="absolute w-full border border-base-border divide-y divide-base-border rounded-md mt-1 py-1 bg-white shadow-lg z-10"
                                                >
                                                    <div className="relative h-10">
                                                        <label
                                                            htmlFor="searchClient"
                                                            className="absolute left-3 top-1/2 -translate-y-1/2"
                                                        >
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 16 16"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g opacity="0.5">
                                                                    <path
                                                                        d="M14.0001 14L11.1335 11.1333M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                                                                        stroke="#09090B"
                                                                        stroke-width="1.33"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </g>
                                                            </svg>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="size-full outline-none placeholder:text-base-muted-foreground pl-9 pr-3"
                                                            placeholder="Поиск клиента"
                                                            id="searchClient"
                                                            value={
                                                                clientSearchTerm
                                                            }
                                                            onChange={(e) => {
                                                                setClientSearchTerm(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <ul className="p-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-base-border scrollbar-track-transparent">
                                                        {filteredClientOptions.length >
                                                        0 ? (
                                                            filteredClientOptions.map(
                                                                (client) => (
                                                                    <li
                                                                        key={
                                                                            client
                                                                        }
                                                                        className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                                                            selectedClient ===
                                                                            client
                                                                                ? "bg-base-muted"
                                                                                : "hover:bg-base-muted"
                                                                        }`}
                                                                        onClick={() =>
                                                                            handleClientSelect(
                                                                                client
                                                                            )
                                                                        }
                                                                    >
                                                                        {client}
                                                                    </li>
                                                                )
                                                            )
                                                        ) : (
                                                            <li className="px-3 py-1.5 text-base-muted-foreground text-sm">
                                                                Клиент не найден
                                                            </li>
                                                        )}
                                                    </ul>

                                                    <div className="p-3">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="!text-xs/4"
                                                            onClick={
                                                                handleCreateClient
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
                                                                    d="M10.6663 14V12.6667C10.6663 11.9594 10.3854 11.2811 9.88529 10.781C9.3852 10.281 8.70692 10 7.99967 10H3.99967C3.29243 10 2.61415 10.281 2.11406 10.781C1.61396 11.2811 1.33301 11.9594 1.33301 12.6667V14M12.6663 5.33333V9.33333M14.6663 7.33333H10.6663M8.66634 4.66667C8.66634 6.13943 7.47243 7.33333 5.99967 7.33333C4.52692 7.33333 3.33301 6.13943 3.33301 4.66667C3.33301 3.19391 4.52692 2 5.99967 2C7.47243 2 8.66634 3.19391 8.66634 4.66667Z"
                                                                    stroke="#18181B"
                                                                    stroke-width="1.33"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                />
                                                            </svg>
                                                            Создать клиента
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="relative z-10 flex items-center justify-end gap-4 mt-20">
                                    <Button variant="outline" onClick={onClose}>
                                        Отмена
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleCreateOffer}
                                    >
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
