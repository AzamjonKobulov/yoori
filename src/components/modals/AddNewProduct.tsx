import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import React from "react";
import { apiCP } from "../../http/apis";

interface AddNewProductProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct?: (productData: {
        name: string;
        price: string;
        sku: string;
        description: string;
        image: string;
    }) => void;
    initialData?: {
        id: string;
        name: string;
        price: string;
        sku: string;
        description: string;
        image: string;
    };
    isEditing?: boolean;
}

export default function AddNewProduct({
    isOpen,
    onClose,
    onAddProduct,
    initialData,
    isEditing = false,
}: AddNewProductProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        price: initialData?.price || "",
        sku: initialData?.sku || "",
        description: initialData?.description || "",
        image: initialData?.image || "/assets/images/camera.png",
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(
        initialData?.image || null
    );
    const [image, setImage] = useState<File|null>(null);

    async function createProduct() {
        try {
            const newFormData = new FormData();
            newFormData.append("name", formData.name);
            newFormData.append("price", formData.price);
            newFormData.append("description", formData.description);
            newFormData.append("article", formData.sku);
            if (image)
              newFormData.append("image", image);
            await apiCP.post("/product/v1/create/", newFormData);
        } catch (err) {
            console.log(err);
        }
    }
    async function editProduct() {
        try {
            const newFormData = new FormData();
            newFormData.append("name", formData.name);
            newFormData.append("price", formData.price);
            newFormData.append("description", formData.description);
            newFormData.append("article", formData.sku);
            if (image)
              newFormData.append("image", image);
            await apiCP.patch(`/product/v1/${initialData?.id}/`, newFormData);
        } catch (err) {
            console.log(err);
        }
    }

    // Update form data when initialData changes (for editing)
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: initialData.price,
                sku: initialData.sku,
                description: initialData.description,
                image: initialData.image,
            });
            setSelectedImage(initialData.image);
        } else {
            // Reset form when adding new product
            setFormData({
                name: "",
                price: "",
                sku: "",
                description: "",
                image: "/assets/images/camera.png",
            });
            setSelectedImage(null);
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if (onAddProduct && formData.name && formData.price) {
            isEditing ? await editProduct() : await createProduct();
            const products = await apiCP.get("/product/v1/list");
            console.log(products);
            const newProduct = products.data.items.filter((item:any) => item.name == formData.name)[0];
            console.log(newProduct);
            // Use selected image if available, otherwise use default
            const productData = {
                ...formData,
                id: newProduct.id,
                image: selectedImage || formData.image,
            };

            onAddProduct(productData);
            onClose();


            // Reset form and image
            setFormData({
                name: "",
                price: "",
                sku: "",
                description: "",
                image: "/assets/images/camera.png",
            });
            setSelectedImage(null);
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
        
        if (file)
          setImage(file);

        if (file) {
            // Validate file type
            const validTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
            ];
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
                            <div className="p-5 space-y-5 h-full flex flex-col overflow-y-auto">
                                <div className="flex-between">
                                    <h2 className="text-lg/7 font-semibold">
                                        {isEditing
                                            ? "Редактировать товар"
                                            : "Добавить новый товар"}
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
                                            Фото товара
                                        </p>

                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="size-18 shrink bg-black/5 flex-center border border-base-border rounded-md overflow-hidden">
                                                {selectedImage ? (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Product"
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
                                                            d="M15 8H15.01M12.5 21H6C5.20435 21 4.44129 20.6839 3.87868 20.1213C3.31607 19.5587 3 18.7956 3 18V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V12.5M3 16L8 11C8.928 10.107 10.072 10.107 11 11L14.5 14.5M14 14L15 13C15.679 12.347 16.473 12.171 17.214 12.474M19 22V16M19 16L22 19M19 16L16 19"
                                                            stroke="#B3B3B3"
                                                            stroke-width="1.66"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
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
                                                        onChange={
                                                            handleImageUpload
                                                        }
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
                                                                    stroke-width="1.33"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
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
                                                                    stroke-width="1.33"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                        {selectedImage
                                                            ? "Заменить"
                                                            : "Загрузить"}
                                                    </label>

                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2 group disabled:pointer-events-none disabled:text-base-muted-foreground"
                                                        disabled={
                                                            !selectedImage
                                                        }
                                                        onClick={
                                                            handleRemoveImage
                                                        }
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
                                                                stroke-width="1.33"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                        Удалить
                                                    </Button>
                                                </div>
                                                <p className="text-base-muted-foreground text-xs">
                                                    Мы поддерживаем PNG, JPEG и
                                                    GIF файлы размером до 10МБ.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm/3.5"
                                        >
                                            Название товара
                                        </label>

                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="sku"
                                            className="block text-sm/3.5"
                                        >
                                            Артикул
                                        </label>

                                        <input
                                            id="sku"
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "sku",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="price"
                                            className="block text-sm/3.5"
                                        >
                                            Цена
                                        </label>

                                        <input
                                            id="price"
                                            type="text"
                                            value={String(formData.price).replace(
                                                /\s/g,
                                                ""
                                            )}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                                        />
                                    </div>

                                    <div className="space-y-2 text-sm/5">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm/3.5"
                                        >
                                            Описание
                                        </label>

                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-26.5 resize-none border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 py-2"
                                            placeholder="Введите описание"
                                        />
                                    </div>
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
                                            !formData.name || !formData.price
                                        }
                                    >
                                        {isEditing
                                            ? "Сохранить изменения"
                                            : "Добавить товар"}
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
