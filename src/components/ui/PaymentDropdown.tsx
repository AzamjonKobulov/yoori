import { motion, AnimatePresence } from "framer-motion";

interface PaymentOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PaymentDropdownProps {
  isOpen: boolean;
  onSelect: (option: PaymentOption) => void;
  planName: string;
  className?: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "card",
    label: "Банковская карта",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.33301 6.66671H14.6663M2.66634 3.33337H13.333C14.0694 3.33337 14.6663 3.93033 14.6663 4.66671V11.3334C14.6663 12.0698 14.0694 12.6667 13.333 12.6667H2.66634C1.92996 12.6667 1.33301 12.0698 1.33301 11.3334V4.66671C1.33301 3.93033 1.92996 3.33337 2.66634 3.33337Z"
          stroke="#18181B"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "sbp",
    label: "СБП",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.59961 3.48267L3.53721 6.946V9.05853L1.60188 12.5151L1.59961 3.48267Z"
          fill="#5B57A2"
        />
        <path
          d="M9.04004 5.68585L10.8556 4.57305L14.5714 4.56958L9.04004 7.95811V5.68585Z"
          fill="#D90751"
        />
        <path
          d="M9.02952 3.46226L9.03979 8.04759L7.09766 6.85426V0L9.02965 3.46226H9.02952Z"
          fill="#FAB718"
        />
        <path
          d="M14.5711 4.56946L10.8553 4.57293L9.02952 3.46226L7.09766 0L14.571 4.56946H14.5711Z"
          fill="#ED6F26"
        />
        <path
          d="M9.03979 12.5342V10.3096L7.09766 9.13892L7.09872 16L9.03979 12.5342Z"
          fill="#63B22F"
        />
        <path
          d="M10.8503 11.4316L3.53707 6.946L1.59961 3.48267L14.5627 11.4271L10.8501 11.4316H10.8503Z"
          fill="#1487C9"
        />
        <path
          d="M7.09863 16.0001L9.03943 12.5343L10.8505 11.4317L14.5629 11.4271L7.09863 16.0001Z"
          fill="#017F36"
        />
        <path
          d="M1.60254 12.515L7.1136 9.139L5.2608 8.0022L3.53787 9.05846L1.60254 12.515Z"
          fill="#984995"
        />
      </svg>
    ),
  },
  {
    id: "invoice",
    label: "Выставить счет",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.33366 1.33337V4.00004C9.33366 4.35366 9.47413 4.6928 9.72418 4.94285C9.97423 5.1929 10.3134 5.33337 10.667 5.33337H13.3337M5.33366 8.66671H6.66699M9.33366 8.66671H10.667M5.33366 11.3334H6.66699M9.33366 11.3334H10.667M10.0003 1.33337H4.00033C3.6467 1.33337 3.30756 1.47385 3.05752 1.7239C2.80747 1.97395 2.66699 2.31309 2.66699 2.66671V13.3334C2.66699 13.687 2.80747 14.0261 3.05752 14.2762C3.30756 14.5262 3.6467 14.6667 4.00033 14.6667H12.0003C12.3539 14.6667 12.6931 14.5262 12.9431 14.2762C13.1932 14.0261 13.3337 13.687 13.3337 13.3334V4.66671L10.0003 1.33337Z"
          stroke="#09090B"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function PaymentDropdown({
  isOpen,
  onSelect,
  className = "",
}: PaymentDropdownProps) {
  const handleSelect = (option: PaymentOption) => {
    onSelect(option);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute left-0 top-full mt-1 w-full bg-white border border-base-border rounded-md shadow-md z-20 p-1 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="text-sm/5">
            {paymentOptions.map((option) => (
              <li
                key={option.id}
                className="flex items-center gap-2 tracking-tight hover:bg-base-chart-1/5 px-2 py-1.5 rounded-md cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
              >
                {option.icon}
                {option.label}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
