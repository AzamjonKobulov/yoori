import { Button } from "../components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCommercialOffer from "../components/modals/CreateCommercialOffer";
import CreateNewClient from "../components/modals/CreateNewClient";
import CreateNewClientData from "../components/modals/CreateNewClientData";
import { AnimatePresence, motion } from "framer-motion";
import ToastSuccess from "../components/ui/ToastSuccess";
import TablePagination from "../components/ui/TablePagination";
import { apiCP } from "../http/apis";

export default function CommercialOffers() {

    useEffect(() => {
        async function config() {
            const userInfo = await apiCP.get("/user/v1/current/info");
            apiCP.defaults.baseURL = `https://${userInfo.data.domain}`;

            await getOffers();
        }
        config();
    }, []);

    async function getOffers() {
        try {
            const res = await apiCP.get("/offer/v1/list");
            const res1 = await apiCP.get("/offer/v1/template/list");
            const templates = res1.data.items.map((item:any) => item.id);
            const offers = res.data.items.map((item: any) => {
                    return {
                        ...item,
                        manager: item.manager_name,
                        client: item.client_name,
                        price: item.option_prices[0],
                    };
                }
            );
            setData(offers.filter((offer:any) => !templates.includes(offer.id)));
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteOffers() {
        try {
            selectedRows.forEach((row:any) => apiCP.delete(`/offer/v1/${row}/`));
        } catch (err) {
            console.log(err);
        }
    }

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCreateClientModal, setShowCreateClientModal] = useState(false);
    const [showCreateClientDataModal, setShowCreateClientDataModal] =
        useState(false);
    const [showToast, setShowToast] = useState(false);
    const selectedCount = selectedRows.size;

    const clearSelection = () => setSelectedRows(new Set());
    const handleDeleteSelected = () => {
        if (selectedRows.size === 0) return;
        deleteOffers();
        setData((prev) => prev.filter((row: any) => !selectedRows.has(row.id)));
        clearSelection();
    };

    // Function to get status color based on status
    const getStatusColor = (status: string): string => {
        switch (status) {
            case "Создано":
                return "bg-neutral-500";
            case "Согласование":
                return "bg-amber-500";
            case "Отправлено":
                return "bg-blue-500";
            case "Отказ":
                return "bg-rose-500";
            case "Продано":
                return "bg-teal-500";
            default:
                return "bg-neutral-500";
        }
    };

    // Filter data based on search term
    const filteredData = data.filter(
        (item: any) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            setSelectedRows(new Set(paginatedData.map((item: any) => item.id)));
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

    // Handle navigation to details page
    const handleNavigateToDetails = async (item:any) => {
        navigate("/details?type=commercial-offer", {
            state: {
                id: item.id,
                templateName: item.name,
                templateStatus: item.status,
                templateVariants: [],
                isNewTemplate: false,
                isTemplateCopy: false,
                isCommercialOffer: true,
            },
        });
    };

    return (
        <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-medium">
                    Коммерческие предложения
                </h1>
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
                                    stroke-width="1.33"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </label>

                        <input
                            type="text"
                            name=""
                            id="search"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page when searching
                            }}
                            placeholder="Поиск по всем КП"
                            className="w-84 h-9 text-sm bg-white border border-base-border rounded-md outline-none shadow-outline focus:ring-2 ring-base-border pl-9"
                        />
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => setShowCreateModal(true)}
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
                                stroke-width="1.33"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        Создать новое КП
                    </Button>
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

                    <table className="table table-auto w-full text-sm/5 text-left border-y border-base-border">
                        <thead className="text-base-muted-foreground ">
                            <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                                <th className="font-medium flex items-center gap-5.5 pl-2 py-2.5">
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
                                                    stroke-width="1.33"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </label>
                                    </div>
                                    Название
                                </th>
                                <th className="w-[14%] font-medium px-3.5">
                                    Статус
                                </th>
                                <th className="w-1/5 font-medium px-3.5">
                                    Клиент
                                </th>
                                <th className="w-[14%] font-medium px-3.5">
                                    Варианты
                                </th>
                                <th className="w-[14%] font-medium px-3.5">
                                    Менеджер
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item: any) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-base-border divide-x divide-base-border"
                                >
                                    <td className="flex items-center gap-5.5 text-base-chart-1 font-medium py-4 pl-2">
                                        <div>
                                            <input
                                                type="checkbox"
                                                id={`check-${item.id}`}
                                                className="peer hidden"
                                                checked={selectedRows.has(
                                                    item.id
                                                )}
                                                onChange={() =>
                                                    handleRowSelect(item.id)
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
                                                        stroke-width="1.33"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                            </label>
                                        </div>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/details?type=commercial-offer",
                                                    {
                                                        state: {
                                                            id:
                                                                item.id,
                                                            templateName:
                                                                item.name,
                                                            templateStatus:
                                                                item.status,
                                                            templateVariants:
                                                                [],
                                                            isNewTemplate:
                                                                false,
                                                            isTemplateCopy:
                                                                false,
                                                            isCommercialOffer:
                                                                true,
                                                        },
                                                    }
                                                )
                                            }
                                            className="text-left hover:underline cursor-pointer"
                                        >
                                            {item.name}
                                        </button>
                                    </td>
                                    <td className="w-[14%] px-3.5">
                                        <span
                                            className={`text-xs/4 font-semibold text-white ${getStatusColor(
                                                item.status
                                            )} rounded-md py-0.5 px-2.5`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="w-[14%] px-3.5">
                                        <p className="line-clamp-1">
                                            {item.client}
                                        </p>
                                    </td>
                                    <td className="w-[14%] px-3.5">
                                        <p className="line-clamp-1">
                                            {item.price}
                                        </p>
                                    </td>
                                    <td className="w-[14%] px-3.5">
                                        <p className="line-clamp-1">
                                            {item.manager}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                Выбрано: {selectedCount} КП
                            </p>

                            <div className="flex items-center gap-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteSelected}
                                >
                                    Удалить выбранные КП
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
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreateModal && (
                    <CreateCommercialOffer
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onOpenCreateClient={() => {
                            setShowCreateModal(false);
                            setShowCreateClientModal(true);
                        }}
                        onNavigateToDetails={handleNavigateToDetails}
                    />
                )}
                {showCreateClientModal && (
                    <CreateNewClient
                        isOpen={showCreateClientModal}
                        onClose={() => setShowCreateClientModal(false)}
                        onBack={() => {
                            setShowCreateClientModal(false);
                            setShowCreateModal(true);
                        }}
                        onContinue={() => {
                            setShowCreateClientModal(false);
                            setShowCreateClientDataModal(true);
                        }}
                    />
                )}
                {showCreateClientDataModal && (
                    <CreateNewClientData
                        isOpen={showCreateClientDataModal}
                        onClose={() => setShowCreateClientDataModal(false)}
                        onBack={() => {
                            setShowCreateClientDataModal(false);
                            setShowCreateClientModal(true);
                        }}
                        onDone={() => {
                            setShowCreateClientDataModal(false);
                            setShowCreateModal(true);
                            setTimeout(() => {
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);
                            }, 300);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ x: 48, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 48, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-2.5 right-2.5 z-[60]"
                    >
                        <ToastSuccess />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
