import ActionsDropdown from "./ActionsDropdown";

export interface TableRowActionsProps {
  itemId: string;
  isOpen: boolean;
  onToggle: (itemId: string) => void;
  onClose: () => void;
  onMove: (itemId: string) => void;
  onRename: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

export default function TableRowActions({
  itemId,
  isOpen,
  onToggle,
  onClose,
  onMove,
  onRename,
  onDelete,
}: TableRowActionsProps) {
  return (
    <ActionsDropdown
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        {
          label: "Переместить",
          onClick: () => onMove(itemId),
        },
        {
          label: "Переименовать",
          onClick: () => onRename(itemId),
        },
        {
          label: "Удалить",
          onClick: () => onDelete(itemId),
          variant: "destructive",
        },
      ]}
      trigger={
        <button
          className="absolute right-0 top-0 !h-full w-13 flex-center border-l border-base-border hover:bg-base-muted"
          onClick={() => onToggle(itemId)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00065 8.66663C8.36884 8.66663 8.66732 8.36815 8.66732 7.99996C8.66732 7.63177 8.36884 7.33329 8.00065 7.33329C7.63246 7.33329 7.33398 7.63177 7.33398 7.99996C7.33398 8.36815 7.63246 8.66663 8.00065 8.66663Z"
              stroke="#71717A"
              stroke-width="1.33"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00065 3.99996C8.36884 3.99996 8.66732 3.70148 8.66732 3.33329C8.66732 2.9651 8.36884 2.66663 8.00065 2.66663C7.63246 2.66663 7.33398 2.9651 7.33398 3.33329C7.33398 3.70148 7.63246 3.99996 8.00065 3.99996Z"
              stroke="#71717A"
              stroke-width="1.33"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00065 13.3333C8.36884 13.3333 8.66732 13.0348 8.66732 12.6666C8.66732 12.2984 8.36884 12 8.00065 12C7.63246 12 7.33398 12.2984 7.33398 12.6666C7.33398 13.0348 7.63246 13.3333 8.00065 13.3333Z"
              stroke="#71717A"
              stroke-width="1.33"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      }
    />
  );
}
