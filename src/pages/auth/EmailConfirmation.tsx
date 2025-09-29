import { useEffect, useState } from "react";
import { Button } from "../../components";
import { useLocation, useNavigate } from "react-router-dom";

export default function EmailConfirmation() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setEmail(location.state?.email);
  }, [location.state]);

  return (
    <div className="fixed inset-0 size-screen z-50 flex-center bg-base-chart-3 bg-auth bg-no-repeat bg-center bg-cover">
      <div className="flex flex-col items-center gap-6">
        <img src="/assets/images/logo.svg" alt="Logo" />
        {/* Form */}
        <div className="w-96 text-sm/3.5 bg-white border border-base-border rounded-lg p-6">
          <form action="#" className="space-y-5">
            <h3 className="text-xl font-semibold text-center">
              Подтвердите почту, чтобы зарегистрироваться
            </h3>

            <p className="text-center">
              На почту <span className="font-semibold">{email}</span> отправлено письмо с кодом. Вставьте код ниже.
            </p>

            <input
                id="code"
                type="code"
                onChange={event => setCode(event.target.value)}
                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
              />

            <Button
              type="button" 
              variant="primary"
              className="w-full"
              isLink
              onClick={() => navigate("/auth/sign-up", {state: {code}})}
            >
              Войти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
