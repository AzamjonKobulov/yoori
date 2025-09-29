import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components";
import PaymentDropdown from "../components/ui/PaymentDropdown";
import SuccessSubscription from "../components/modals/SuccessSubscription";
import IssueInvoice from "../components/modals/IssueInvoice";
import WaitingForPayment from "../components/modals/WaitingForPayment";
import RequestSent from "../components/modals/RequestSent";

export default function Plans() {
  const [isYearly, setIsYearly] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [showRequestSentModal, setShowRequestSentModal] = useState(false);
  const [selectedBusinessPayment, setSelectedBusinessPayment] = useState<{
    id: string;
    label: string;
    icon: React.ReactNode;
  } | null>(null);
  const [selectedProfiPayment, setSelectedProfiPayment] = useState<{
    id: string;
    label: string;
    icon: React.ReactNode;
  } | null>(null);
  const businessDropdownRef = useRef<HTMLDivElement>(null);
  const profiDropdownRef = useRef<HTMLDivElement>(null);

  const handleInvoiceSubmit = () => {
    setShowInvoiceModal(false);
    setShowWaitingModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isBusinessClick = businessDropdownRef.current?.contains(target);
      const isProfiClick = profiDropdownRef.current?.contains(target);

      if (!isBusinessClick && !isProfiClick) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Pricing data
  const pricingPlans = {
    business: {
      monthly: 1290,
      yearly: Math.round(1290 * 12 * 0.8), // 20% discount on annual price: 1290 * 12 * 0.8 = 12384
    },
    profi: {
      monthly: 5590,
      yearly: Math.round(5590 * 12 * 0.8), // 20% discount on annual price: 5590 * 12 * 0.8 = 53664
    },
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ru-RU");
  };

  // Debug: Log selected payments and modal states
  console.log("Selected Business Payment:", selectedBusinessPayment);
  console.log("Selected Profi Payment:", selectedProfiPayment);
  console.log("Modal states:", {
    showSuccessModal,
    showInvoiceModal,
    showWaitingModal,
  });

  return (
    <div className="space-y-5 p-5">
      <div className="relative bg-gradient-to-r from-white to-base-chart-1/10 border border-base-border rounded-md p-5">
        <h2 className="text-xl/7 font-medium">Текущий тариф — "Старт"</h2>
        <ul className="space-y-3 mt-3 text-xs/4 font-medium">
          <li className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2231_10021)">
                <path
                  d="M10.6683 14V12.6667C10.6683 11.9594 10.3873 11.2811 9.88725 10.781C9.38715 10.281 8.70887 10 8.00163 10H4.00163C3.29438 10 2.61611 10.281 2.11601 10.781C1.61591 11.2811 1.33496 11.9594 1.33496 12.6667V14M14.6683 13.9999V12.6666C14.6679 12.0757 14.4712 11.5018 14.1092 11.0348C13.7472 10.5678 13.2404 10.2343 12.6683 10.0866M10.6683 2.08659C11.2419 2.23346 11.7503 2.56706 12.1134 3.0348C12.4765 3.50254 12.6735 4.07781 12.6735 4.66992C12.6735 5.26204 12.4765 5.83731 12.1134 6.30505C11.7503 6.77279 11.2419 7.10639 10.6683 7.25326M8.66829 4.66667C8.66829 6.13943 7.47439 7.33333 6.00163 7.33333C4.52887 7.33333 3.33496 6.13943 3.33496 4.66667C3.33496 3.19391 4.52887 2 6.00163 2C7.47439 2 8.66829 3.19391 8.66829 4.66667Z"
                  stroke="#71717A"
                  stroke-width="1.33"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2231_10021">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0.00146484)"
                  />
                </clipPath>
              </defs>
            </svg>

            <div className="flex items-center gap-1">
              Активных пользователей —{" "}
              <span className="bg-base-chart-1/10  rounded-md px-1">
                4 <span className="text-base-muted-foreground">из 5</span>
              </span>
            </div>
          </li>
          <li className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.33464 1.33333V3.99999C9.33464 4.35362 9.47511 4.69276 9.72516 4.9428C9.97521 5.19285 10.3143 5.33333 10.668 5.33333H13.3346M5.33464 8.66666H6.66797M9.33464 8.66666H10.668M5.33464 11.3333H6.66797M9.33464 11.3333H10.668M10.0013 1.33333H4.0013C3.64768 1.33333 3.30854 1.4738 3.05849 1.72385C2.80844 1.9739 2.66797 2.31304 2.66797 2.66666V13.3333C2.66797 13.687 2.80844 14.0261 3.05849 14.2761C3.30854 14.5262 3.64768 14.6667 4.0013 14.6667H12.0013C12.3549 14.6667 12.6941 14.5262 12.9441 14.2761C13.1942 14.0261 13.3346 13.687 13.3346 13.3333V4.66666L10.0013 1.33333Z"
                stroke="#71717A"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div className="flex items-center gap-1">
              Активных КП —{" "}
              <span className="bg-base-chart-1/10  rounded-md px-1">
                3 <span className="text-base-muted-foreground">из 5</span>
              </span>
            </div>
          </li>
          <li className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.3348 1.33333V3.99999M10.6681 1.33333V3.99999M2.00146 6.66666H14.0015M3.3348 2.66666H12.6681C13.4045 2.66666 14.0015 3.26362 14.0015 3.99999V13.3333C14.0015 14.0697 13.4045 14.6667 12.6681 14.6667H3.3348C2.59842 14.6667 2.00146 14.0697 2.00146 13.3333V3.99999C2.00146 3.26362 2.59842 2.66666 3.3348 2.66666Z"
                stroke="#71717A"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <p>Подписка кончается 02.06.2025</p>
          </li>
        </ul>

        <img
          src="/assets/images/hand-heart.svg"
          alt="Hand heart"
          className="absolute bottom-0 right-0"
        />
      </div>

      {/* Plans */}
      <div className="relative bg-white border border-base-border rounded-md p-5">
        <div className="flex-between">
          <h2 className="text-xl/7 font-medium">Управление тарифом</h2>
          {/* Tabs */}
          <div className="flex items-center bg-base-muted text-sm/5 font-medium rounded-lg p-1">
            <button
              className={`rounded-md px-3 py-1 transition-all duration-200 ${
                !isYearly ? "bg-white shadow-sm" : "hover:bg-white/50"
              }`}
              onClick={() => setIsYearly(false)}
            >
              Ежемесячно
            </button>
            <button
              className={`flex items-center gap-1.5 font-medium rounded-md px-3 py-1 transition-all duration-200 ${
                isYearly ? "bg-white shadow-sm" : "hover:bg-white/50"
              }`}
              onClick={() => setIsYearly(true)}
            >
              Ежегодно{" "}
              <span className="font-semibold text-xs/4 bg-emerald-100 text-emerald-700 rounded-md py-0.5 px-1.5">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-start mt-5">
          {/* Start */}
          <div
            className="space-y-5 border border-base-border rounded-md p-5 cursor-pointer hover:border-base-chart-1 transition-colors"
            onClick={() => setShowInvoiceModal(true)}
          >
            <div className="size-11 shrink-0 flex-center border border-base-border rounded-md">
              <img src="/assets/images/plan-start.svg" alt="Plan start" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl/7 font-medium">Старт</h3>
              <p className="text-sm/5 text-base-muted-foreground">
                Идеален для фрилансеров и тестирования возможностей.
              </p>
            </div>

            <h2 className="text-4xl/10">Бесплатно</h2>

            <Button
              variant="outline"
              className="w-full text-base-muted-foreground disabled:opacity-100 disabled:hover:bg-white disabled:cursor-allowed"
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              Текущий план
            </Button>

            <hr className="border-base-border" />

            <ul className="space-y-3 font-medium text-xs/4">
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>1 Пользователь</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>До 5 активных КП</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>2 шаблона</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Доступ к смете по ссылке</p>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div
            className="space-y-5 border-2 border-base-chart-1 rounded-md p-5 cursor-pointer hover:border-base-chart-1/80 transition-colors"
            onClick={() => setShowInvoiceModal(true)}
          >
            <div className="flex-between items-start">
              <div className="size-11 shrink-0 flex-center border border-base-border rounded-md">
                <img
                  src="/assets/images/plan-bussiness.svg"
                  alt="Plan bussiness"
                />
              </div>
              <span className="text-xs/4 font-semibold bg-teal-500 text-white rounded-md shadow py-0.5 px-2.5">
                Рекомендуем!
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl/7 font-medium">Бизнес</h3>
              <p className="text-sm/5 text-base-muted-foreground">
                Для небольших команд и стабильного документооборота
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl/10">
                {formatPrice(
                  isYearly
                    ? pricingPlans.business.yearly
                    : pricingPlans.business.monthly
                )}{" "}
                ₽
                <span className="text-sm/5 text-base-muted-foreground">
                  / {isYearly ? "год" : "мес."}
                </span>
              </h2>
              {isYearly && (
                <p className="text-sm text-emerald-600 font-medium">
                  Экономия{" "}
                  {formatPrice(
                    pricingPlans.business.monthly * 12 -
                      pricingPlans.business.yearly
                  )}{" "}
                  ₽ в год
                </p>
              )}
            </div>

            <div className="relative" ref={businessDropdownRef}>
              <Button
                variant="primary"
                className="w-full flex items-center gap-2 hover:bg-base-chart-1/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(
                    openDropdown === "business" ? null : "business"
                  );
                }}
              >
                Обновить план
                <motion.svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: openDropdown === "business" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    d="M4.50098 6L8.50098 10L12.501 6"
                    stroke="white"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </Button>
              <PaymentDropdown
                isOpen={openDropdown === "business"}
                onSelect={(option) => {
                  console.log("Business dropdown selected:", option);
                  setSelectedBusinessPayment(option);
                  setOpenDropdown(null);
                  console.log("Opening Success modal");
                  setShowSuccessModal(true);
                }}
                planName="Business"
              />
            </div>

            <hr className="border-base-border" />

            <ul className="space-y-3 font-medium text-xs/4">
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>До 5 пользователей</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>5 шаблонов</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>До 30 активных КП</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Экспорт сметы в PDF</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Доступ к смете по ссылке</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Интеграция с CRM</p>
              </li>
            </ul>
          </div>

          {/* Profi */}
          <div
            className="space-y-5 border border-base-border rounded-md p-5 cursor-pointer hover:border-base-chart-1 transition-colors"
            onClick={() => setShowInvoiceModal(true)}
          >
            <div className="size-11 shrink-0 flex-center border border-base-border rounded-md">
              <img src="/assets/images/plan-profi.svg" alt="Plan profi" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl/7 font-medium">Профи</h3>
              <p className="text-sm/5 text-base-muted-foreground">
                Для агентств, отделов продаж и активных команд
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl/10">
                {formatPrice(
                  isYearly
                    ? pricingPlans.profi.yearly
                    : pricingPlans.profi.monthly
                )}{" "}
                ₽
                <span className="text-sm/5 text-base-muted-foreground">
                  / {isYearly ? "год" : "мес."}
                </span>
              </h2>
              {isYearly && (
                <p className="text-sm text-emerald-600 font-medium">
                  Экономия{" "}
                  {formatPrice(
                    pricingPlans.profi.monthly * 12 - pricingPlans.profi.yearly
                  )}{" "}
                  ₽ в год
                </p>
              )}
            </div>

            <div className="relative" ref={profiDropdownRef}>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 hover:bg-base-chart-1/5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === "profi" ? null : "profi");
                }}
              >
                Обновить план
                <motion.svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: openDropdown === "profi" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    d="M4.5 6L8.5 10L12.5 6"
                    stroke="#18181B"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </Button>
              <PaymentDropdown
                isOpen={openDropdown === "profi"}
                onSelect={(option) => {
                  console.log("Profi dropdown selected:", option);
                  setSelectedProfiPayment(option);
                  setOpenDropdown(null);
                  console.log("Opening Success modal");
                  setShowSuccessModal(true);
                }}
                planName="Profi"
              />
            </div>

            <hr className="border-base-border" />

            <ul className="space-y-3 font-medium text-xs/4">
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Без ограничений по пользователям</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Без ограничений по количеству КП</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Без ограничений по шаблонам</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Экспорт сметы в PDF и Excel</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Доступ к смете по ссылке</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Интеграция с CRM</p>
              </li>
            </ul>
          </div>

          {/* Corporate */}
          <div
            className="space-y-5 border border-base-border rounded-md p-5 cursor-pointer hover:border-base-chart-1 transition-colors"
            onClick={() => setShowInvoiceModal(true)}
          >
            <div className="size-11 shrink-0 flex-center border border-base-border rounded-md">
              <img
                src="/assets/images/plan-corporation.svg"
                alt="Plan corporate"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl/7 font-medium">Корпорация</h3>
              <p className="text-sm/5 text-base-muted-foreground">
                Индивидуальный подход для крупных компаний
              </p>
            </div>

            <h2 className="text-4xl/10">По запросу</h2>

            <Button
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowRequestSentModal(true);
              }}
            >
              Оставить заявку
            </Button>

            <hr className="border-base-border" />

            <ul className="space-y-3 font-medium text-xs/4">
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Доработки под ваш функционал</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Пользователи и шаблоны без ограничений</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Безлимитное количество КП</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Полная интеграция с CRM и другими системами</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Гибкий экспорт данных</p>
              </li>
              <li className="flex items-center gap-2 tracking-tight">
                <img src="/assets/images/circle-check.svg" alt="Check circle" />
                <p>Техническая поддержка 7/7</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="relative bg-white border border-base-border rounded-md p-5">
        <h2 className="text-xl/7 font-medium">История платежей</h2>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessSubscription
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <IssueInvoice
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            onSubmit={handleInvoiceSubmit}
          />
        )}
      </AnimatePresence>

      {/* Waiting for Payment Modal */}
      <AnimatePresence>
        {showWaitingModal && (
          <WaitingForPayment onClose={() => setShowWaitingModal(false)} />
        )}
      </AnimatePresence>

      {/* Request Sent Modal */}
      <AnimatePresence>
        {showRequestSentModal && (
          <RequestSent onClose={() => setShowRequestSentModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
