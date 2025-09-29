export default function SubscriptionExpiredUser() {
  return (
    <div className="h-screen p-5">
      <div className="h-full flex-center bg-white border border-base-border rounded-md">
        <div className="max-w-2xl flex flex-col gap-6 px-3.5">
          <img
            src="/assets/images/subscription-ended-user.svg"
            alt="Image"
            className="w-64 aspect-square mx-auto xl:w-100"
          />
          <div className="space-y-4 text-center px-5">
            <p className="text-lg/6 xl:text-xl/7">
              Ваша подписка окончена обратитесь к администратору — для
              пользователя
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
