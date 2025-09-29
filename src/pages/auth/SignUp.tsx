import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useEffect, useState } from "react";
import { apiCP, apiID } from "../../http/apis";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCode(location.state?.code);
    console.log(code);
  }, [location.state]);

  async function register(event:any) {
    event.preventDefault();

    try {
      const res = await apiID.post(`/auth/v1/${code}/register/`, {
        first_name: name,
        password,
        phone,
        domain,
        patronymic: "empty",
        last_name: "empty",
      });

      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("refreshToken", res.data.refresh_token);

      const userInfo = await apiCP.get("/user/v1/current/info");
      localStorage.setItem("manager_id", userInfo.data.id);
      apiCP.defaults.baseURL = `https://${userInfo.data.domain}`;

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="fixed inset-0 size-screen z-50 flex-center bg-base-chart-3 bg-auth bg-no-repeat bg-center bg-cover">
      <div className="flex flex-col items-center gap-6">
        <img src="/assets/images/logo.svg" alt="Logo" />
        {/* Form */}
        <div className="w-96 text-sm/3.5 bg-white border border-base-border rounded-lg p-6">
          <form action="#" className="space-y-6">
            <h3 className="text-xl font-semibold text-center ">
              Заполните данные и создайте профиль
            </h3>

            <div className="space-y-2">
              <label htmlFor="name" className="block font-semibold">
                Ваше имя
              </label>

              <input
                id="name"
                type="text"
                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block font-semibold">
                Номер телефона
              </label>

              <input
                id="phone"
                type="text"
                onChange={event => setPhone(event.target.value)}
                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-semibold">
                Пароль
              </label>

              <div className="relative">
                <input
                  id="password"
                  onChange={event => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md pl-3 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-base-muted-foreground"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-base-muted-foreground"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="m10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password-confirm" className="block font-semibold">
                Подтвердите пароль
              </label>

              <div className="relative">
                <input
                  id="password-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md pl-3 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-base-muted-foreground"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-base-muted-foreground"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="m10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name-company" className="block font-semibold">
                Название компании
              </label>

              <div className="relative">
                <input
                  id="name-company"
                  type="text"
                  onChange={event => setDomain(event.target.value)}
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md pl-3 pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-muted-foreground">
                  .yoori.pro
                </span>
              </div>
            </div>

            <Button variant="primary" className="w-full" isLink to="" onClick={event => register(event)}>
              Создать профиль
            </Button>

            <Link
              to=""
              className="block text-center text-base-chart-1 font-medium hover:underline mx-auto"
            >
              Обратиться в техподдержку
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
