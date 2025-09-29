import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import TablePagination from "../ui/TablePagination";
import { useModalBodyLock } from "../../hooks";
import { apiCP } from "../../http/apis";

interface AddProductProps {
    groupId: string;
    isOpen: boolean;
    onClose?: () => void;
    onAddProducts?: (
        groupId: string,
        selectedProducts: Array<{
            id: string;
            name: string;
            price: string;
            sku: string;
            description: string;
            image: string;
        }>
    ) => void;
}

export default function AddProduct({
    groupId,
    isOpen,
    onClose,
    onAddProducts,
}: AddProductProps) {
    // Lock body scroll when modal is open
    useModalBodyLock(isOpen);

    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
        new Set()
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    if (!isOpen) return null;

    // Sample data for the table
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        async function start() {
            if (apiCP.defaults.baseURL === "https://api-dev.yoori.pro") {
                const userInfo = await apiCP.get("/user/v1/current/info");
                console.log(userInfo.data.domain);
                apiCP.defaults.baseURL = `https://${userInfo.data.domain}`;
            }

            getProducts();
        }

        start();
    }, []);

    async function getProducts() {
        try {
            const res = await apiCP.get("/product/v1/list");
            setProducts(
                res.data.items.map((item: any) => {
                    return {
                        sku: item.article,
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: String(item.price),
                        image: item.image,
                    };
                })
            );
            console.log(res.data.items);
        } catch (err) {
            console.log(err);
        }
    }

    // Pagination logic
    const totalPages = Math.ceil(products.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    // Checkbox handlers
    const handleSelectAll = () => {
        if (selectedProducts.size === currentProducts.length) {
            setSelectedProducts(new Set());
        } else {
            const newSelected = new Set(selectedProducts);
            currentProducts.forEach((product) => newSelected.add(product.id));
            setSelectedProducts(newSelected);
        }
    };

    const handleProductSelect = (productId: string) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedProducts(newSelected);
    };

    const handleRowsPerPageChange = (newValue: number) => {
        setRowsPerPage(newValue);
        setCurrentPage(1);
    };

    const handleAddSelectedProducts = () => {
        if (onAddProducts && selectedProducts.size > 0) {
            const selectedProductsData = products.filter((product) =>
                selectedProducts.has(product.id)
            );
            onAddProducts(groupId, selectedProductsData);
        }
        onClose?.();
    };

    const isAllSelected =
        currentProducts.length > 0 &&
        currentProducts.every((product) => selectedProducts.has(product.id));

    return (
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
            <div className="relative w-full max-w-5xl h-full">
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white shadow-lg border border-base-border transform h-full flex flex-col justify-between p-5"
                >
                    <div className="space-y-5">
                        <h2 className="text-lg/7 font-semibold">
                            Добавить товар
                        </h2>
                        <button
                            className="size-8 absolute right-5 top-5 shrink-0 flex-center hover:bg-base-border/50 rounded-md"
                            aria-label="Закрыть"
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

                        <div className="flex-between">
                            <Button variant="outline" className="border-dashed">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_1698_30249)">
                                        <path
                                            d="M5.33398 7.99998H10.6673M8.00065 5.33331V10.6666M14.6673 7.99998C14.6673 11.6819 11.6826 14.6666 8.00065 14.6666C4.31875 14.6666 1.33398 11.6819 1.33398 7.99998C1.33398 4.31808 4.31875 1.33331 8.00065 1.33331C11.6826 1.33331 14.6673 4.31808 14.6673 7.99998Z"
                                            stroke="#18181B"
                                            strokeWidth="1.33"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1698_30249">
                                            <rect
                                                width="16"
                                                height="16"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Создать товар
                            </Button>

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
                                    name=""
                                    id="search"
                                    placeholder="Поиск по названию или описанию"
                                    className="w-84 h-9 text-sm bg-white border border-base-border rounded-md outline-none shadow-outline focus:ring-2 ring-base-border pl-9"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 flex flex-col">
                            <table className="table table-auto w-full text-sm/5 text-left border-y border-base-border">
                                <thead className="text-base-muted-foreground">
                                    <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                                        <th className="w-[11%] font-medium pl-2 py-2.5">
                                            <div className="flex items-center gap-5.5">
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        id="check-all-add-product"
                                                        className="peer hidden"
                                                        checked={isAllSelected}
                                                        onChange={
                                                            handleSelectAll
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="check-all-add-product"
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
                                                <div>Фото</div>
                                            </div>
                                        </th>
                                        <th className="w-1/4 font-medium px-3.5">
                                            Название
                                        </th>
                                        <th className="w-[10%] font-medium px-3.5">
                                            Цена, ₽
                                        </th>
                                        <th className="w-[10%] font-medium px-3.5">
                                            Артикул
                                        </th>
                                        <th className="w-[41%] font-medium px-3.5">
                                            Описание
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className={`border-b border-base-border divide-x divide-base-border ${
                                                selectedProducts.has(product.id)
                                                    ? "bg-base-chart-1/10"
                                                    : ""
                                            }`}
                                        >
                                            <td className="w-[11%] pl-2">
                                                <div className="flex items-center gap-5.5">
                                                    <div>
                                                        <input
                                                            type="checkbox"
                                                            id={`check-${product.id}`}
                                                            className="peer hidden"
                                                            checked={selectedProducts.has(
                                                                product.id
                                                            )}
                                                            onChange={() =>
                                                                handleProductSelect(
                                                                    product.id
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`check-${product.id}`}
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
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="size-10 shrink-0"
                                                    />
                                                </div>
                                            </td>
                                            <td className="flex items-center gap-4 font-medium py-4 pl-2">
                                                <div className="line-clamp-1 pl-1.5">
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td className="w-[10%] text-end px-3.5">
                                                {product.price.replace(
                                                    /\s/g,
                                                    ""
                                                )}
                                            </td>
                                            <td className="w-[10%] px-3.5">
                                                {product.sku}
                                            </td>
                                            <td className="w-[41%]  px-3.5">
                                                {product.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Table Pagination */}
                            <div className="relative overflow-visible mt-4">
                                <TablePagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={
                                        handleRowsPerPageChange
                                    }
                                    className="px-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-end gap-4 mt-20">
                        <Button variant="outline" onClick={onClose}>
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddSelectedProducts}
                        >
                            Добавить выбранные товары ({selectedProducts.size})
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
