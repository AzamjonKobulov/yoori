import Button from "./Button";
import RowsPerPageDropdown from "./RowsPerPageDropdown";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  className?: string;
}

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  className = "",
}: TablePaginationProps) {
  // Handle first page
  const handleFirstPage = () => onPageChange(1);

  // Handle previous page
  const handlePreviousPage = () => onPageChange(currentPage - 1);

  // Handle next page
  const handleNextPage = () => onPageChange(currentPage + 1);

  // Handle last page
  const handleLastPage = () => onPageChange(totalPages);

  return (
    <div
      className={`flex items-center justify-end gap-8 text-sm/5 ${className}`}
    >
      <RowsPerPageDropdown
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />

      <div className="flex items-center gap-8">
        <p>
          Страница {currentPage} из {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="size-9 shrink-0 group flex-center !p-0"
            onClick={handleFirstPage}
            disabled={currentPage === 1}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                currentPage === 1
                  ? "stroke-base-muted-foreground"
                  : "stroke-base-muted-foreground group-hover:stroke-base-muted-foreground"
              }`}
            >
              <path
                d="M7.33333 11.3333L4 7.99996L7.33333 4.66663M12 11.3333L8.66667 7.99996L12 4.66663"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="size-9 shrink-0 group flex-center !p-0"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                currentPage === 1
                  ? "stroke-base-muted-foreground"
                  : "stroke-base-muted-foreground group-hover:stroke-base-muted-foreground"
              }`}
            >
              <path
                d="M10 12L6 8L10 4"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="size-9 shrink-0 group flex-center !p-0"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                currentPage === totalPages
                  ? "stroke-base-muted-foreground"
                  : "stroke-base-foreground group-hover:stroke-base-muted-foreground"
              }`}
            >
              <path
                d="M6 12L10 8L6 4"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="size-9 shrink-0 group flex-center !p-0"
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                currentPage === totalPages
                  ? "stroke-base-muted-foreground"
                  : "stroke-base-foreground group-hover:stroke-base-muted-foreground"
              }`}
            >
              <path
                d="M4 11.3333L7.33333 7.99996L4 4.66663M8.66667 11.3333L12 7.99996L8.66667 4.66663"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
