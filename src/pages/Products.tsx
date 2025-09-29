import {
    Button,
    AddNewProduct,
    ExportImportDropdown,
    ImportProducts,
    ProductCard,
    DeleteConfirmation,
} from "../components";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ToastSuccess from "../components/ui/ToastSuccess";
import TablePagination from "../components/ui/TablePagination";
import { apiCP } from "../http/apis";

// Sample data for products - in a real app this would come from an API
export default function Products() {
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
            setData(
                res.data.items.map((item: any) => {
                    return {
                        sku: item.article,
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                    };
                })
            );
            console.log(res.data.items);
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteProducts() {
        try {
            const products = data.filter((row) => selectedRows.has(row.id));
            products.forEach((product) => {
                apiCP.delete(`/product/v1/${product.id}/`);
                console.log(product.id);
            });
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteProduct() {
        try {
            await apiCP.delete(`/product/v1/${productToDelete?.id}/`);
        } catch (err) {
            console.log(err);
        }
    }

    const [data, setData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState("Изменения сохранены");
    const [toastText, setToastText] = useState("КП сохранено!");
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showProductCardModal, setShowProductCardModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<
        | {
              id: string;
              name: string;
              price: string;
              sku: string;
              description: string;
              image: string;
          }
        | undefined
    >(undefined);
    const [selectedProduct, setSelectedProduct] = useState<
        | {
              id: string;
              name: string;
              price: string;
              sku: string;
              description: string;
              image: string;
          }
        | undefined
    >(undefined);
    const [editingProduct, setEditingProduct] = useState<
        | {
              id: string;
              name: string;
              price: string;
              sku: string;
              description: string;
              image: string;
          }
        | undefined
    >(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const selectedCount = selectedRows.size;

    const clearSelection = () => setSelectedRows(new Set());
    const handleDeleteSelected = () => {
        if (selectedRows.size === 0) return;
        deleteProducts();
        setData((prev) => prev.filter((row) => !selectedRows.has(row.id)));
        clearSelection();
        setToastTitle("Товары удалены");
        setToastText("Выбранные товары успешно удалены!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Filter data based on search term
    const filteredData = data.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleAddProduct = (productData: {
        name: string;
        price: string;
        sku: string;
        description: string;
        image: string;
    }) => {
        if (isEditing && editingProduct) {
            // Update existing product
            setData((prev) =>
                prev.map((product) =>
                    product.id === editingProduct.id
                        ? { ...product, ...productData }
                        : product
                )
            );
            setToastTitle("Изменения сохранены");
            setToastText(
                `Изменение товара "${editingProduct.name}" сохранены!`
            );
        } else {
            // Add new product
            const newProduct = {
                id: (data.length + 1).toString(),
                ...productData,
                image: productData.image || "/assets/images/camera.png",
            };
            setData((prev) => [newProduct, ...prev]);
            setToastTitle("Товар добавлен");
            setToastText("Новый товар успешно добавлен!");
        }

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Reset editing state
        setIsEditing(false);
        setEditingProduct(undefined);
    };

    const handleEditProduct = (product: {
        id: string;
        name: string;
        price: string;
        sku: string;
        description: string;
        image: string;
    }) => {
        setEditingProduct(product);
        setIsEditing(true);
        setShowAddProductModal(true);
    };

    const handleDeleteProduct = (product: {
        id: string;
        name: string;
        price: string;
        sku: string;
        description: string;
        image: string;
    }) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        deleteProduct();
        if (productToDelete) {
            setData((prev) =>
                prev.filter((product) => product.id !== productToDelete.id)
            );
        }
        setShowDeleteModal(false);
        setProductToDelete(undefined);
    };

    const handleImportProducts = (file: File) => {
        // Here you would typically parse the file and add products
        // For now, we'll just show a success message
        console.log("Importing file:", file.name);

        // Show success toast with import message
        setToastTitle("Товары импортированы");
        setToastText("5 товаров загружены в систему");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleOpenProductCard = (product: {
        id: string;
        name: string;
        price: string;
        sku: string;
        description: string;
        image: string;
    }) => {
        setSelectedProduct(product);
        setShowProductCardModal(true);
    };

    return (
        <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-medium">Товары</h1>
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
                            name=""
                            id="search"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page when searching
                            }}
                            placeholder="Поиск по товарам"
                            className="w-84 h-9 text-sm bg-white border border-base-border rounded-md outline-none shadow-outline focus:ring-2 ring-base-border pl-9"
                        />
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => {
                            setIsEditing(false);
                            setEditingProduct(undefined);
                            setShowAddProductModal(true);
                        }}
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
                        Добавить товар
                    </Button>

                    {/* Export/Import Dropdown */}
                    <ExportImportDropdown
                        onImport={() => {
                            setShowImportModal(true);
                        }}
                        onExport={() => {
                            console.log("Export products clicked");
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

                    <table className="table table-auto w-full text-sm/5 text-left border-y border-base-border">
                        <thead className="text-base-muted-foreground">
                            <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                                <th className="w-28 font-medium pl-2 py-2.5">
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
                            {paginatedData.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-base-border divide-x divide-base-border"
                                >
                                    <td className="w-[11%] pl-2">
                                        <div className="flex items-center gap-5.5">
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
                                                            strokeWidth="1.33"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </label>
                                            </div>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="size-10 shrink-0"
                                            />
                                        </div>
                                    </td>
                                    <td className="flex items-center gap-4 font-medium py-4 pl-2">
                                        <button
                                            onClick={() =>
                                                handleOpenProductCard(item)
                                            }
                                            className="line-clamp-1 pl-1.5 text-base-chart-1 hover:underline cursor-pointer text-left"
                                        >
                                            {item.name}
                                        </button>
                                    </td>
                                    <td className="w-[10%] text-end px-3.5">
                                        {String(item.price).replace(/\s/g, "")}
                                    </td>
                                    <td className="w-[10%] px-3.5">
                                        {item.sku}
                                    </td>
                                    <td className="w-[41%] px-3.5">
                                        {item.description}
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
                                Выбрано: {selectedCount} товаров
                            </p>

                            <div className="flex items-center gap-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteSelected}
                                >
                                    Удалить выбранные товары
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

            {/* Add Product Modal */}
            <AddNewProduct
                isOpen={showAddProductModal}
                onClose={() => {
                    setShowAddProductModal(false);
                    setIsEditing(false);
                    setEditingProduct(undefined);
                }}
                onAddProduct={handleAddProduct}
                initialData={editingProduct}
                isEditing={isEditing}
            />

            {/* Import Products Modal */}
            <ImportProducts
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImportProducts}
            />

            {/* Product Card Modal */}
            <ProductCard
                isOpen={showProductCardModal}
                onClose={() => setShowProductCardModal(false)}
                product={selectedProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteConfirmation
                        onClose={() => {
                            setShowDeleteModal(false);
                            setProductToDelete(undefined);
                        }}
                        onConfirm={handleConfirmDelete}
                        title="Удалить выбранный товар?"
                        message={`Вы уверены, что хотите удалить «${
                            productToDelete?.name || ""
                        }» из списка товаров?`}
                        confirmText="Удалить"
                        cancelText="Отмена"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
