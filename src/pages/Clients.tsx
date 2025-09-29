import { useEffect, useState } from "react";
import TablePagination from "../components/ui/TablePagination";
import Button from "../components/ui/Button";
import ToastSuccess from "../components/ui/ToastSuccess";
import CreateNewClientData from "../components/modals/CreateNewClientData";
import ClientActionsDropdown from "../components/ui/ClientActionsDropdown";
import { AnimatePresence, motion } from "framer-motion";
import { apiCP } from "../http/apis";

interface ClientRow {
    id: string;
    name?: string;
    type?: string;
    manager?: string;
    phone?: string;
    email?: string;
    contact?: string;
    description?: string;
}

export default function Clients() {
    const [clients, setClients] = useState<Object[]>([]);

    useEffect(() => {
        async function start() {
            if (apiCP.defaults.baseURL === "https://api-dev.yoori.pro") {
                const userInfo = await apiCP.get("/user/v1/current/info");

                console.log(userInfo.data.domain);
                apiCP.defaults.baseURL = `https://${userInfo.data.domain}`;
            }

            getClients();
        }

        start();
    }, []);

    useEffect(() => {
        console.log("clients обновились:", clients);
    }, [clients]);

    async function getClients() {
        try {
            const res = await apiCP.get("/client/v1/list");
            setData(res.data.items.map((item: any) => {return {
              id: item.id,
              name: item.name,
              type: item.type,
              manager: item.manager_name,
              phone: item.phone[0],
              email: item.email[0],
              contact: item.contact_person,
            }}));
            setClients(res.data.items);
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteClients() {
        try {
            const clients = data.filter((row) => selectedRows.has(row.id))
            clients.forEach(client => {
                apiCP.delete(`/client/v1/${client.id}/`);
                console.log(client.id);
            })
        } catch (err) {
            console.log(err);
        }
    }

    const [data, setData] = useState<ClientRow[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState("Изменения сохранены");
    const [toastText, setToastText] = useState("Клиенты обновлены!");
    const [showCreateClientModal, setShowCreateClientModal] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientRow | null>(null);
    const selectedCount = selectedRows.size;

    const clearSelection = () => setSelectedRows(new Set());
    const handleDeleteSelected = () => {
        if (selectedRows.size === 0) return;
        deleteClients();
        setData((prev) => prev.filter((row) => !selectedRows.has(row.id)));
        clearSelection();
        setToastTitle("Клиенты удалены");
        setToastText("Выбранные клиенты успешно удалены!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Helper to render value or dash
    const valueOrDash = (value?: string) =>
        value && value.trim() ? value : "—";

    // Handler for adding new client
    const handleCreateClient = (clientData: {
        id?: string;
        name: string;
        type: string;
        manager: string;
        phone: string;
        email: string;
        contact: string;
        description: string;
    }) => {
        if (editingClient) {
            // Update existing client
            setData((prev) =>
                prev.map((client) =>
                    client.id === editingClient.id
                        ? {
                              ...client,
                              name: clientData.name || undefined,
                              type: clientData.type || undefined,
                              manager: clientData.manager || undefined,
                              phone: clientData.phone || undefined,
                              email: clientData.email || undefined,
                              contact: clientData.contact || undefined,
                              description: clientData.description || undefined,
                          }
                        : client
                )
            );
            setToastTitle("Клиент обновлен");
            setToastText("Изменения клиента успешно сохранены!");
            setEditingClient(null);
        } else {
            // Create new client
            const newClient: ClientRow = {
                id: clientData.id || (data.length + 1).toString(),
                name: clientData.name || undefined,
                type: clientData.type || undefined,
                manager: clientData.manager || undefined,
                phone: clientData.phone || undefined,
                email: clientData.email || undefined,
                contact: clientData.contact || undefined,
                description: clientData.description || undefined,
            };

            setData((prev) => [newClient, ...prev]);
            setToastTitle("Клиент создан");
            setToastText("Новый клиент успешно добавлен!");
        }

        setShowCreateClientModal(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Handler for editing client
    const handleEditClient = (client: ClientRow) => {
        setEditingClient(client);
        setShowCreateClientModal(true);
    };

    // Handler for deleting client
    const handleDeleteClient = (clientId: string) => {
        setData((prev) => prev.filter((client) => client.id !== clientId));
        setShowCreateClientModal(false);
        setEditingClient(null);
        setToastTitle("Клиент удален");
        setToastText("Клиент успешно удален!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Filter data based on search term
    const filteredData = data.filter((item) => {
        const q = searchTerm.toLowerCase();
        return (
            (item.name || "").toLowerCase().includes(q) ||
            (item.type || "").toLowerCase().includes(q) ||
            (item.manager || "").toLowerCase().includes(q) ||
            (item.phone || "").toLowerCase().includes(q) ||
            (item.email || "").toLowerCase().includes(q) ||
            (item.contact || "").toLowerCase().includes(q) ||
            (item.description || "").toLowerCase().includes(q)
        );
    });

    // Calculate pagination values
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Handle row selection
    const handleRowSelect = (rowId: string) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }
        setSelectedRows(newSelected);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedRows.size === paginatedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedData.map((item) => item.id)));
        }
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (newValue: number) => {
        setRowsPerPage(newValue);
        setCurrentPage(1); // Reset to first page when changing rows per page
    };

    // Handle page navigation
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-medium">Клиенты</h1>
                <div className="w-max flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative max-w-84 w-full">
                        <label
                            htmlFor="search"
                            className="absolute left-3 top-2.5"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M14.0001 14L11.1335 11.1333M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                                    stroke="#71717A"
                                    strokeWidth="1.33"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page when searching
                            }}
                            placeholder="Поиск по клиентам"
                            className="w-84 h-9 text-sm bg-white border border-base-border rounded-md outline-none shadow-outline focus:ring-2 ring-base-border pl-9"
                        />
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setShowCreateClientModal(true)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3.33301 7.99998H12.6663M7.99967 3.33331V12.6666"
                                stroke="#FAFAFA"
                                strokeWidth="1.33"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Добавить клиента
                    </Button>

                    <ClientActionsDropdown
                        onImport={() => {
                            // TODO: Implement client import functionality
                            console.log("Import clients clicked");
                        }}
                        onExport={() => {
                            // TODO: Implement client export functionality
                            console.log("Export clients clicked");
                        }}
                    />
                </div>
            </div>

            <div className="h-[calc(100vh-96px)] overflow-y-auto relative flex flex-col justify-between space-y-4 bg-white border border-base-border rounded-md mt-5 px-5 pb-5 pt-4">
                <div className="space-y-4">
                    <div className="text-sm font-medium">
                        Всего:{" "}
                        <span className="text-base-muted-foreground">
                            {filteredData.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                        <table className="table table-auto w-full min-w-[1280px] text-sm/5 text-left border-y border-base-border">
                            <thead className="text-base-muted-foreground">
                                <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                                    <th className="w-85 font-medium pl-2 py-2.5">
                                        <div className="flex items-center gap-5.5">
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="check-all"
                                                    className="peer hidden"
                                                    checked={
                                                        selectedRows.size ===
                                                            paginatedData.length &&
                                                        paginatedData.length > 0
                                                    }
                                                    onChange={handleSelectAll}
                                                />
                                                <label
                                                    htmlFor="check-all"
                                                    className="size-4 flex-center border border-base-foreground rounded-[2px] peer-checked:bg-base-chart-1 peer-checked:border-base-chart-1 shadow-primary"
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
                                            <div>ФИО / Название</div>
                                        </div>
                                    </th>
                                    <th className="w-37.5 font-medium px-3.5">
                                        Тип
                                    </th>
                                    <th className="w-55 font-medium px-3.5">
                                        Ответственный
                                    </th>
                                    <th className="w-42.5 font-medium px-3.5">
                                        Телефон
                                    </th>
                                    <th className="w-50 font-medium px-3.5">
                                        Почта
                                    </th>
                                    <th className="w-55 font-medium px-3.5">
                                        Контактное лицо
                                    </th>
                                    <th className="font-medium px-3.5">
                                        Описание
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-base-border divide-x divide-base-border"
                                    >
                                        <td className="pl-2">
                                            <div className="flex items-center gap-5.5 py-4 pr-3.5">
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        id={`check-${item.id}`}
                                                        className="peer hidden"
                                                        checked={selectedRows.has(
                                                            item.id
                                                        )}
                                                        onChange={() =>
                                                            handleRowSelect(
                                                                item.id
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`check-${item.id}`}
                                                        className="size-4 flex-center border border-base-foreground rounded-[2px] peer-checked:bg-base-chart-1 peer-checked:border-base-chart-1 shadow-primary"
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
                                                <button
                                                    onClick={() =>
                                                        handleEditClient(item)
                                                    }
                                                    className="font-medium text-base-chart-1 line-clamp-1 hover:underline cursor-pointer text-left"
                                                >
                                                    {valueOrDash(item.name)}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-3.5">
                                            <span className="line-clamp-1">
                                                {valueOrDash(item.type == "client" ? "Физическое лицо" : "Юридическое лицо")}
                                            </span>
                                        </td>
                                        <td className="px-3.5">
                                            <span className="line-clamp-1">
                                                {valueOrDash(item.manager)}
                                            </span>
                                        </td>
                                        <td className="px-3.5">
                                            <span className="line-clamp-1">
                                                {valueOrDash(item.phone)}
                                            </span>
                                        </td>
                                        <td className="px-3.5">
                                            <span className="line-clamp-1">
                                                {valueOrDash(item.email)}
                                            </span>
                                        </td>
                                        <td className="px-3.5">
                                            <span className="line-clamp-1">
                                                {valueOrDash(item.contact)}
                                            </span>
                                        </td>
                                        <td className="px-3.5">
                                            <span className="line-clamp-1">
                                                {valueOrDash(item.description)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Table Pagination */}
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    className="mt-4"
                />

                {/* Selected rows */}
                {selectedCount > 0 && (
                    <div className="absolute bottom-0 left-0 w-full p-1">
                        <div className="flex-between bg-gray-700 rounded py-4 px-5">
                            <p className="text-sm/5 text-white">
                                Выбрано: {selectedCount} клиентов
                            </p>
                            <div className="flex items-center gap-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteSelected}
                                >
                                    Удалить выбранные
                                </Button>
                                <button
                                    onClick={clearSelection}
                                    aria-label="Очистить выбор"
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M18.001 6L6.00098 18M6.00098 6L18.001 18"
                                            stroke="#E4E4E7"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ x: 48, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 48, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-2.5 right-2.5 z-[60]"
                    >
                        <ToastSuccess title={toastTitle} text={toastText} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Client Modal */}
            <CreateNewClientData
                isOpen={showCreateClientModal}
                onClose={() => {
                    setShowCreateClientModal(false);
                    setEditingClient(null);
                }}
                onDone={(clientData) => {
                    if (clientData) {
                        handleCreateClient(clientData);
                    }
                }}
                {...(editingClient && { editingClient })}
                {...(editingClient && {
                    onDelete: () => handleDeleteClient(editingClient.id),
                })}
            />
        </div>
    );
}
