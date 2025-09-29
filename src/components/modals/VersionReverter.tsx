import Button from "../ui/Button";

interface VersionReverterProps {
  versionDate: string;
  onRestore: () => void;
  onDismiss: () => void;
}

export default function VersionReverter({
  versionDate,
  onRestore,
  onDismiss,
}: VersionReverterProps) {
  return (
    <div className="flex-between bg-blue-600 border border-base-border rounded-lg py-3 px-4">
      <div className="flex items-center gap-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.00098 8C2.00098 9.18669 2.35287 10.3467 3.01216 11.3334C3.67145 12.3201 4.60852 13.0892 5.70488 13.5433C6.80123 13.9974 8.00763 14.1162 9.17152 13.8847C10.3354 13.6532 11.4045 13.0818 12.2436 12.2426C13.0827 11.4035 13.6542 10.3344 13.8857 9.17054C14.1172 8.00666 13.9984 6.80026 13.5443 5.7039C13.0901 4.60754 12.3211 3.67047 11.3344 3.01118C10.3477 2.35189 9.18766 2 8.00098 2C6.32361 2.00631 4.71362 2.66082 3.50764 3.82667L2.00098 5.33333M2.00098 5.33333V2M2.00098 5.33333H5.33431M8.00098 4.66667V8L10.6676 9.33333"
            stroke="white"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="space-y-1 text-sm text-white">
          <p className="font-medium leading-none">Версия КП от {versionDate}</p>
          <p className="text-sm/5">
            Это архивная версия КП. Если ее восстановить — текущая версия КП
            будет изменена
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onDismiss}>
          Отмена
        </Button>
        <Button variant="outline" onClick={onRestore}>
          Восстановить эту версию
        </Button>
      </div>
    </div>
  );
}
