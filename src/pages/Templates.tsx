import { Button } from "../components";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TablePagination from "../components/ui/TablePagination";
import { AnimatePresence, motion } from "framer-motion";
import ToastSuccess from "../components/ui/ToastSuccess";

interface TemplateRow {
  id: string;
  name: string;
  status: string;
  variants?: Array<{
    id: string;
    name: string;
    isRecommended: boolean;
    isHidden: boolean;
    tableRows: Array<{
      id: string;
      name: string;
      amount: string;
      cost: string;
      costAmount: string;
    }>;
    productGroups: Array<{
      id: string;
      name: string;
      products: Array<{
        id: string;
        name: string;
        amount: string;
        cost: string;
        costAmount: string;
      }>;
    }>;
  }>;
}

// Sample template data
const initialTableData: TemplateRow[] = [
  {
    id: "1",
    name: "Шаблон КП",
    status: "Черновик",
    variants: [
      {
        id: "variant-1",
        name: "Базовый вариант",
        isRecommended: false,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Основные услуги",
            amount: "1",
            cost: "50000",
            costAmount: "50000",
          },
          {
            id: "row-2",
            name: "Дополнительные услуги",
            amount: "2",
            cost: "15000",
            costAmount: "30000",
          },
        ],
        productGroups: [],
      },
    ],
  },
  {
    id: "2",
    name: "Уютный Уголок",
    status: "Черновик",
    variants: [
      {
        id: "variant-1",
        name: "Стандартный пакет",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Дизайн интерьера",
            amount: "1",
            cost: "80000",
            costAmount: "80000",
          },
          {
            id: "row-2",
            name: "Консультация",
            amount: "3",
            cost: "5000",
            costAmount: "15000",
          },
        ],
        productGroups: [
          {
            id: "group-1",
            name: "Мебель",
            products: [
              {
                id: "product-1",
                name: "Диван",
                amount: "1",
                cost: "45000",
                costAmount: "45000",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Яркий Путь",
    status: "Создан",
    variants: [
      {
        id: "variant-1",
        name: "Премиум решение",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Комплексное решение",
            amount: "1",
            cost: "120000",
            costAmount: "120000",
          },
        ],
        productGroups: [
          {
            id: "group-1",
            name: "Основные услуги",
            products: [
              {
                id: "product-1",
                name: "Проектирование",
                amount: "1",
                cost: "60000",
                costAmount: "60000",
              },
              {
                id: "product-2",
                name: "Реализация",
                amount: "1",
                cost: "60000",
                costAmount: "60000",
              },
            ],
          },
        ],
      },
      {
        id: "variant-2",
        name: "Эконом вариант",
        isRecommended: false,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Базовые услуги",
            amount: "1",
            cost: "60000",
            costAmount: "60000",
          },
        ],
        productGroups: [],
      },
    ],
  },
  {
    id: "4",
    name: "Экологическая Идея",
    status: "Создан",
    variants: [
      {
        id: "variant-1",
        name: "Эко-решение",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Экологический аудит",
            amount: "1",
            cost: "40000",
            costAmount: "40000",
          },
          {
            id: "row-2",
            name: "Рекомендации",
            amount: "1",
            cost: "20000",
            costAmount: "20000",
          },
        ],
        productGroups: [],
      },
    ],
  },
  {
    id: "5",
    name: "Инновации Завтрашнего Дня",
    status: "Создан",
    variants: [
      {
        id: "variant-1",
        name: "Технологическое решение",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Исследование",
            amount: "1",
            cost: "100000",
            costAmount: "100000",
          },
          {
            id: "row-2",
            name: "Разработка",
            amount: "1",
            cost: "150000",
            costAmount: "150000",
          },
        ],
        productGroups: [
          {
            id: "group-1",
            name: "Технологии",
            products: [
              {
                id: "product-1",
                name: "AI интеграция",
                amount: "1",
                cost: "80000",
                costAmount: "80000",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "Простор для Жизни",
    status: "Создан",
    variants: [
      {
        id: "variant-1",
        name: "Жилой комплекс",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Планировка",
            amount: "1",
            cost: "70000",
            costAmount: "70000",
          },
        ],
        productGroups: [],
      },
    ],
  },
  {
    id: "7",
    name: "Разумный Выбор",
    status: "Создан",
    variants: [
      {
        id: "variant-1",
        name: "Оптимальное решение",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Анализ потребностей",
            amount: "1",
            cost: "30000",
            costAmount: "30000",
          },
          {
            id: "row-2",
            name: "Подбор решения",
            amount: "1",
            cost: "50000",
            costAmount: "50000",
          },
        ],
        productGroups: [],
      },
    ],
  },
  {
    id: "8",
    name: "Идеи для Творчества",
    status: "Создан",
    variants: [
      {
        id: "variant-1",
        name: "Креативный пакет",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Концепция",
            amount: "1",
            cost: "40000",
            costAmount: "40000",
          },
          {
            id: "row-2",
            name: "Реализация",
            amount: "1",
            cost: "80000",
            costAmount: "80000",
          },
        ],
        productGroups: [
          {
            id: "group-1",
            name: "Креативные услуги",
            products: [
              {
                id: "product-1",
                name: "Дизайн",
                amount: "1",
                cost: "60000",
                costAmount: "60000",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "9",
    name: "Эпоха Перемен",
    status: "Создан",
    variants: [
      {
        id: "variant-1",
        name: "Трансформация",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "row-1",
            name: "Анализ текущего состояния",
            amount: "1",
            cost: "25000",
            costAmount: "25000",
          },
          {
            id: "row-2",
            name: "План изменений",
            amount: "1",
            cost: "35000",
            costAmount: "35000",
          },
          {
            id: "row-3",
            name: "Реализация",
            amount: "1",
            cost: "90000",
            costAmount: "90000",
          },
        ],
        productGroups: [],
      },
    ],
  },
];

export default function Templates() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(initialTableData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("Изменения сохранены");
  const [toastText, setToastText] = useState("Шаблон обновлен!");
  const selectedCount = selectedRows.size;
  const processedTemplatesRef = useRef<Set<string>>(new Set());

  // Handle adding new template when returning from details page
  useEffect(() => {
    const newTemplate = location.state?.newTemplate;
    const isNewTemplate = location.state?.isNewTemplate;
    const isTemplateCopy = location.state?.isTemplateCopy;

    if (newTemplate && !processedTemplatesRef.current.has(newTemplate.id)) {
      // Mark this template as processed
      processedTemplatesRef.current.add(newTemplate.id);

      setData((prev) => [newTemplate, ...prev]);

      // Show appropriate toast based on template type
      if (isNewTemplate) {
        setToastTitle("Шаблон создан");
        setToastText("Новый шаблон успешно создан!");
      } else if (isTemplateCopy) {
        setToastTitle("Копия шаблона создана");
        setToastText("Копия шаблона успешно создана!");
      }

      setShowToast(true);

      // Auto-hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);

      // Clear the state to prevent re-adding
      navigate("/templates", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const clearSelection = () => setSelectedRows(new Set());
  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) return;
    setData((prev) => prev.filter((row) => !selectedRows.has(row.id)));
    clearSelection();
    setToastTitle("Шаблоны удалены");
    setToastText("Выбранные шаблоны успешно удалены!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Function to get status color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Создан":
        return "bg-teal-500";
      case "Черновик":
        return "bg-neutral-500";
      default:
        return "bg-neutral-500";
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Handle navigation to template details
  const handleNavigateToDetails = (template: TemplateRow) => {
    navigate("/details?type=template", {
      state: {
        templateName: template.name,
        templateStatus: template.status,
        templateVariants: template.variants || [],
      },
    });
  };

  // Handle creating new template
  const handleCreateNewTemplate = () => {
    navigate("/details?type=template", {
      state: {
        templateName: "Шаблон Коммерческого предложения 1",
        templateStatus: "Черновик",
        templateVariants: [
          {
            id: "variant-1",
            name: "Вариант 1",
            isRecommended: false,
            isHidden: false,
            tableRows: [],
            productGroups: [],
          },
        ],
        isNewTemplate: true,
      },
    });
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Шаблоны КП</h1>
        <div className="w-max flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative max-w-84 w-full">
            <label htmlFor="search" className="absolute left-3 top-2.5">
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
              placeholder="Поиск по названию"
              className="w-84 h-9 text-sm bg-white border border-base-border rounded-md outline-none shadow-outline focus:ring-2 ring-base-border pl-9"
            />
          </div>

          <Button variant="primary" onClick={() => handleCreateNewTemplate()}>
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
            Создать шаблон
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
            <thead className="text-base-muted-foreground">
              <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                <th className="w-105 font-medium flex items-center gap-5.5 pl-2 py-2.5">
                  <div>
                    <input
                      type="checkbox"
                      id="check-all"
                      className="peer hidden"
                      checked={
                        selectedRows.size === paginatedData.length &&
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
                  Название шаблона
                </th>
                <th className="w-full font-medium px-3.5">Статус</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-base-border divide-x divide-base-border relative"
                >
                  <td className="w-105 flex items-center gap-5.5 text-base-chart-1 font-medium py-4 pl-2">
                    <div>
                      <input
                        type="checkbox"
                        id={`check-${item.id}`}
                        className="peer hidden"
                        checked={selectedRows.has(item.id)}
                        onChange={() => handleRowSelect(item.id)}
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
                      onClick={() => handleNavigateToDetails(item)}
                      className="font-medium text-base-chart-1 line-clamp-1 hover:underline cursor-pointer text-left"
                    >
                      {item.name}
                    </button>
                  </td>
                  <td className="w-full px-3.5">
                    <span
                      className={`text-xs/4 font-semibold text-white ${getStatusColor(
                        item.status
                      )} rounded-md py-0.5 px-2.5`}
                    >
                      {item.status}
                    </span>
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
                Выбрано: {selectedCount} шаблонов
              </p>

              <div className="flex items-center gap-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  Удалить выбранные шаблоны
                </Button>
                <button onClick={clearSelection} aria-label="Очистить выбор">
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
    </div>
  );
}
