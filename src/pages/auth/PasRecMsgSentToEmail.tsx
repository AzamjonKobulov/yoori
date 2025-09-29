import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useEffect, useState } from "react";
import { apiID } from "../../http/apis";

export default function PasRecMsgSentToEmail() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setEmail(location.state?.email);
    }, [location.state]);

    async function recovery(event: any) {
        event.preventDefault();

        try {
          await apiID.post(`/auth/v1/${code}/password/new/`, {
            password
          });

          navigate("/auth/sign-in");
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
                    <form action="#" className="space-y-5">
                        <h3 className="text-xl font-semibold text-center">
                            Восстановление пароля
                        </h3>

                        <div className="space-y-2">
                            <p className="text-center">
                                На почту
                                <span className="font-semibold ml-1">
                                    {email}{" "}
                                </span>
                                было отправлено письмо с кодом. Вставьте код
                                ниже.
                            </p>

                            <input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block font-semibold"
                            >
                                Новый пароль
                            </label>

                            <input
                                id="password"
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                            />
                        </div>

                        <Button variant="primary" className="w-full" isLink onClick={event => recovery(event)}>
                            Обновить
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
