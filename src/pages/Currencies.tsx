import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ToastSuccess from "../components/ui/ToastSuccess";
import TablePagination from "../components/ui/TablePagination";
import { apiCP } from "../http/apis";

interface CurrencyRow {
  id: string;
  name: string;
  code: string;
  rate: number;
  isBase: boolean;
}

export default function Currencies() {
  useEffect(() => {
    async function start() {
      const res = await apiCP.get("/currency/v1/list");
      console.log(res.data.items);
      setData(res.data.items);
    }

    start();
  }, []);

  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("Изменения сохранены");
  const [toastText, setToastText] = useState("Валюта обновлена!");

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

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

  // Handle base currency toggle
  const handleBaseCurrencyToggle = (currencyId: string) => {
    setData((prev) =>
      prev.map((currency) => ({
        ...currency,
        isBase: currency.id === currencyId ? !currency.isBase : false, // Only one can be base
      }))
    );

    // Show success toast
    setToastTitle("Базовая валюта изменена");
    setToastText("Базовая валюта успешно обновлена!");
    setShowToast(true);

    // Auto-hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Список валют</h1>
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
              placeholder="Поиск валюты"
              className="w-84 h-9 text-sm bg-white border border-base-border rounded-md outline-none shadow-outline focus:ring-2 ring-base-border pl-9"
            />
          </div>
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
                <th className="w-1/3 font-medium px-3.5">Валюта</th>
                <th className="w-1/4 font-medium px-3.5">Код валюты</th>
                <th className="w-1/4 font-medium px-3.5">Курс</th>
                <th className="w-1/4 font-medium px-3.5">Базовая валюта</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-base-border divide-x divide-base-border"
                >
                  <td className="w-1/3 px-3.5 py-4 font-medium">{item.name}</td>
                  <td className="w-1/4 px-3.5 py-4">{item.code}</td>
                  <td className="w-1/4 px-3.5 py-4">{item.rate}</td>
                  <td className="w-1/4 px-3.5 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isBase}
                        onChange={() => handleBaseCurrencyToggle(item.id)}
                      />
                      <div className="w-9 h-5 bg-base-border rounded-full peer peer-checked:bg-base-chart-1 transition-colors duration-300"></div>
                      <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-full shadow-toggle-track"></div>
                    </label>
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
      </div>

      {/* Toast */}
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
