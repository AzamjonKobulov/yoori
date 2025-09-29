import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useEffect, useState } from "react";
import { apiID } from "../../http/apis";

export default function RecoveryPassword() {
  const [email, setEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.state);
    setEmail(location.state?.email);
  }, [location.state]);

  async function sendEmail(event:any) {
    event.preventDefault();

    try {
      await apiID.post("/auth/v1/password/reset/", {
        email
      });

      navigate("/auth/pas-rec-msg-sent-to-email", {state: {email}});
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
            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-semibold ">Восстановление пароля</h3>
              <p className="text-base-muted-foreground">
                Введите почту, которая используется для входа в аккаунт
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="sku" className="block font-semibold">
                Почта
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
              />
            </div>

            <Button
              type="button"
              variant="primary"
              className="w-full"
              isLink
              onClick={event => sendEmail(event)}
            >
              Продолжить
            </Button>

            <Link
              to="/auth/sign-in"
              className="block text-center text-base-chart-1 font-medium hover:underline mx-auto"
            >
              Вернуться назад
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
