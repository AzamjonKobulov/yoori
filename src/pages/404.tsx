import { Button } from "../components";

export default function NotFound() {
  return (
    <div className="h-screen p-5">
      <div className="h-full flex-center bg-white border border-base-border rounded-md overflow-y-auto">
        <div className="max-w-2xl flex flex-col gap-6 px-3.5">
          <img
            src="/assets/images/scenarios.svg"
            alt="Image"
            className="w-64 aspect-square mx-auto xl:w-100"
          />
          <div className="space-y-4 text-center px-5">
            <h2 className="text-lg/6 font-semibold xl:text-xl/7">
              Страница не найдена
            </h2>
            <p className="text-base-muted-foreground text-xs/4 xl:text-sm/5">
              Попробуйте снова или вернитесь на главную страницу
            </p>
          </div>
          <Button variant="primary" className="w-fit mx-auto" isLink to="/">
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}
