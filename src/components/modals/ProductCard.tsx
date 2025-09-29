import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import { useModalBodyLock } from "../../hooks/useModalBodyLock";

interface ProductCardProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    price: string;
    sku: string;
    description: string;
    image: string;
  };
  onEdit?: (product: {
    id: string;
    name: string;
    price: string;
    sku: string;
    description: string;
    image: string;
  }) => void;
  onDelete?: (product: {
    id: string;
    name: string;
    price: string;
    sku: string;
    description: string;
    image: string;
  }) => void;
}

export default function ProductCard({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  // Lock body scroll when modal is open
  useModalBodyLock(isOpen);

  if (!isOpen || !product) return null;

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
              className="bg-white shadow-lg border border-base-border transform h-full flex flex-col p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Карточка товара</h2>
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
              <div className="flex-1 overflow-y-auto space-y-5 text-sm/5 mt-5">
                <div className="size-18 shrink">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div className="space-y-1">
                    <p>Артикул</p>
                    <span className="text-base-muted-foreground">
                      {product.sku}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p>Цена</p>
                    <span className="text-base-muted-foreground">
                      {String(product.price).replace(/\s/g, "")} ₽
                    </span>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p>Название товара</p>
                    <span className="text-base-muted-foreground">
                      {product.name}
                    </span>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p>Описание</p>
                    <span className="text-base-muted-foreground">
                      {product.description}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-between">
                <Button
                  variant="ghost"
                  className="text-base-destructive font-medium"
                  onClick={() => {
                    if (onDelete && product) {
                      onDelete(product);
                      onClose();
                    }
                  }}
                >
                  Удалить товар
                </Button>
                <div className="flex items-center justify-end gap-3 mt-2 mt-20">
                  <Button variant="outline" onClick={onClose}>
                    Отмена
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (onEdit && product) {
                        onEdit(product);
                        onClose();
                      }
                    }}
                  >
                    Редактировать
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
