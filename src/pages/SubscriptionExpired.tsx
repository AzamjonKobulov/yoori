import { Button } from "../components";

export default function SubscriptionExpired() {
  return (
    <div className="h-screen p-5">
      <div className="h-full flex-center bg-white border border-base-border rounded-md">
        <div className="max-w-2xl flex flex-col gap-6 px-3.5">
          <img
            src="/assets/images/subscription-ended.svg"
            alt="Image"
            className="w-64 aspect-square mx-auto xl:w-100"
          />
          <div className="space-y-4 text-center px-5">
            <h2 className="text-lg/6 font-semibold xl:text-xl/7">
              Ваша подписка окончена
            </h2>
            <p className="text-base-muted-foreground text-xs/4 xl:text-sm/5">
              Обновите подписку, чтобы продолжить использование всех функций
            </p>
          </div>
          <Button
            variant="primary"
            className="w-fit mx-auto"
            isLink
            to="/plans"
          >
            Управлять тарифом
          </Button>
        </div>
      </div>
    </div>
  );
}
