import { useState } from "react";
import { Button } from "../../components";
import { apiCP, apiID } from "../../http/apis";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  async function emailVerify(event:any) {
    event.preventDefault();

    try {
      await apiID.post("/auth/v1/email/verify/", {
        email
      });
      navigate("/auth/email-confirmation", {state: {email}});
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 422) {
          console.log("422");
          setUserExists(true);
        }
      }
    }
  }

  async function login(event:any) {
    event.preventDefault();

    try {
      const res = await apiID.post("/auth/v1/login/", {
        email,
        password
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
            <h3 className="text-xl font-semibold text-center">
              Войти в аккаунт
            </h3>
            <div className="space-y-2">
              <label htmlFor="email" className="block font-semibold">
                Почта
              </label>

              <input
                id="email"
                type="email"
                onChange={event => setEmail(event.target.value)}
                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
              />
            </div>

            {userExists && <div><div className="space-y-2">
              <div className="flex-between">
                <label htmlFor="password" className="block font-semibold">
                  Пароль
                </label>
                <Link
                  to="/auth/recovery-password"
                  state={{email}}
                  className="text-base-chart-1 font-medium hover:underline"
                >
                  Забыли пароль?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                onChange={event => setPassword(event.target.value)}
                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
              />
            </div></div>}

            <Button
              variant="primary"
              className="w-full"
              isLink
              onClick={event => password ? login(event) : emailVerify(event)}
              // to="/email-confirmation"
            >
              Войти
            </Button>
          </form>
        </div>{" "}
      </div>
    </div>
  );
}
