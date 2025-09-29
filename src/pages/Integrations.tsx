import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, DeleteConfirmation } from "../components";
import ConfigureIntegration from "../components/modals/ConfigureIntegration";
import AddCrmFields from "../components/modals/AddCrmFields";
import ToastSuccess from "../components/ui/ToastSuccess";

export default function Integrations() {
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [hasIntegration, setHasIntegration] = useState(false);
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCrmFieldsModal, setShowCrmFieldsModal] = useState(false);
  const [integrationData, setIntegrationData] = useState<{
    crm: string;
    url: string;
  } | null>(null);

  // CRM Fields state - can be updated from the modal
  const [crmFields, setCrmFields] = useState([
    "Адрес площадки",
    "Дата окончания проекта",
    "Комментарий",
    "Последняя коммуникация",
    "Дата завершения работ",
    "Дата проекта",
    "Налог",
    "Прибыль",
    "Дата монтажа оборудования",
    "Затраты (Безнал)",
    "Обратная связь",
    "Что нужно",
    "Дата начала разработки проекта",
    "Затраты (Наличные)",
    "Первая коммуникация",
  ]);
  return (
    <div className="p-5">
      {/* Header */}
      {!hasIntegration && (
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Интеграция с CRM</h1>
        </div>
      )}

      {!hasIntegration && (
        <div className="h-[calc(100vh-96px)] overflow-y-auto flex-center bg-white border border-base-border rounded-md mt-5 px-5 pb-5 pt-4">
          <div className="max-w-2xl flex flex-col gap-6 px-3.5">
            <img
              src="/assets/images/integrations.svg"
              alt="Image"
              className="w-100 aspect-square mx-auto"
            />
            <div className="space-y-4 text-center px-5">
              <h2 className="text-xl/7 font-semibold">
                Интеграция с CRM не настроена
              </h2>
              <p className="text-base-muted-foreground text-sm/5">
                Настройте интеграцию с CRM для более продуктивной работы с
                клиентами. Воспользуйтесь{" "}
                <a href="#" className="text-base-chart-1 hover:underline">
                  нашей инструкцией
                </a>
                , которая поможет вам
              </p>
            </div>
            <Button
              variant="primary"
              className="w-fit mx-auto"
              onClick={() => setShowConfigureModal(true)}
            >
              Настроить интеграцию
            </Button>
          </div>
        </div>
      )}

      {/* When integration added */}
      {hasIntegration && (
        <div className="h-[calc(100vh-96px)] overflow-y-auto space-y-5">
          {showSubscriptionWarning && (
            <div className="flex-between gap-4 bg-sky-50 border border-sky-500 rounded-lg py-4 px-5">
              <div className="flex gap-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2150_23717)">
                    <path
                      d="M12.0015 16V12M12.0015 8H12.0115M3.85141 8.6201C3.70545 7.96262 3.72787 7.27894 3.91657 6.63244C4.10527 5.98593 4.45416 5.39754 4.93088 4.92182C5.4076 4.4461 5.99672 4.09844 6.64362 3.91109C7.29052 3.72374 7.97425 3.70276 8.63141 3.8501C8.99312 3.2844 9.49142 2.81886 10.0804 2.49638C10.6693 2.17391 11.33 2.00488 12.0014 2.00488C12.6729 2.00488 13.3335 2.17391 13.9225 2.49638C14.5114 2.81886 15.0097 3.2844 15.3714 3.8501C16.0296 3.70212 16.7145 3.72301 17.3624 3.91081C18.0103 4.09862 18.6002 4.44724 19.0773 4.92425C19.5543 5.40126 19.9029 5.99117 20.0907 6.6391C20.2785 7.28703 20.2994 7.97193 20.1514 8.6301C20.7171 8.99181 21.1827 9.4901 21.5051 10.079C21.8276 10.668 21.9966 11.3286 21.9966 12.0001C21.9966 12.6715 21.8276 13.3322 21.5051 13.9211C21.1827 14.5101 20.7171 15.0084 20.1514 15.3701C20.2987 16.0273 20.2778 16.711 20.0904 17.3579C19.9031 18.0048 19.5554 18.5939 19.0797 19.0706C18.604 19.5473 18.0156 19.8962 17.3691 20.0849C16.7226 20.2736 16.0389 20.2961 15.3814 20.1501C15.0202 20.718 14.5215 21.1855 13.9315 21.5094C13.3416 21.8333 12.6794 22.0032 12.0064 22.0032C11.3334 22.0032 10.6712 21.8333 10.0813 21.5094C9.49133 21.1855 8.99265 20.718 8.63141 20.1501C7.97425 20.2974 7.29052 20.2765 6.64362 20.0891C5.99672 19.9018 5.4076 19.5541 4.93088 19.0784C4.45416 18.6027 4.10527 18.0143 3.91657 17.3678C3.72787 16.7213 3.70545 16.0376 3.85141 15.3801C3.28137 15.0193 2.81183 14.5203 2.48646 13.9293C2.1611 13.3384 1.99048 12.6747 1.99048 12.0001C1.99048 11.3255 2.1611 10.6618 2.48646 10.0709C2.81183 9.47992 3.28137 8.98085 3.85141 8.6201Z"
                      stroke="#0EA5E9"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2150_23717">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0.00146484)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="space-y-1">
                  <p className="font-medium leading-6">
                    Подписка заканчивается через 3 дня
                  </p>
                  <p className="text-sm/5">
                    Оплатите подписку заранее, чтобы не потерять доступ к
                    оплаченным функциям
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline">Оплатить подписку</Button>
                {/* Close button   */}
                <button onClick={() => setShowSubscriptionWarning(false)}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.7">
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="#71717A"
                        stroke-width="1.33"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex-between bg-white border border-base-border rounded-md p-5">
            <div className="flex items-center gap-4">
              <div className="size-16 shrink-0 bg-white border border-base-border rounded-[14px] shadow-primary p-1">
                <div className="size-full flex-center bg-base-blue rounded-xl overflow-hidden ">
                  <img
                    src="/assets/svgs/bitrix-logo.svg"
                    alt="Image"
                    className=""
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-xl/7">
                  Интеграция с {integrationData?.crm || "Битрикс24"}
                </p>
                <span className="text-xs/4 font-semibold bg-teal-500 text-base-primary-foreground rounded-md py-0.5 px-2.5">
                  Активна
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2H14M14 2V6M14 2L6.66667 9.33333M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                    stroke="#18181B"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Перейти на страницу
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-base-destructive hover:text-base-destructive/80"
                onClick={() => setShowDeleteModal(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4.00004H14M12.6667 4.00004V13.3334C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3334V4.00004M5.33333 4.00004V2.66671C5.33333 2.00004 6 1.33337 6.66667 1.33337H9.33333C10 1.33337 10.6667 2.00004 10.6667 2.66671V4.00004M6.66667 7.33337V11.3334M9.33333 7.33337V11.3334"
                    stroke="#DC2626"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Удалить интеграцию
              </Button>
            </div>
          </div>

          <div className="space-y-6 bg-white border border-base-border rounded-md p-5">
            <div className="flex-between">
              <p className="font-medium text-xl/7">Поля сделки</p>
              <Button
                variant="secondary"
                onClick={() => setShowCrmFieldsModal(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2150_23760)">
                    <path
                      d="M9.99992 3.33333L12.6666 6M14.1159 4.54126C14.4683 4.18888 14.6664 3.71091 14.6665 3.2125C14.6665 2.71409 14.4686 2.23607 14.1162 1.8836C13.7638 1.53112 13.2859 1.33307 12.7874 1.33301C12.289 1.33295 11.811 1.53088 11.4585 1.88326L2.56121 10.7826C2.40642 10.9369 2.29195 11.127 2.22788 11.3359L1.34721 14.2373C1.32998 14.2949 1.32868 14.3562 1.34344 14.4145C1.35821 14.4728 1.38849 14.5261 1.43107 14.5686C1.47366 14.6111 1.52696 14.6413 1.58531 14.656C1.64367 14.6707 1.70491 14.6693 1.76254 14.6519L4.66454 13.7719C4.87332 13.7084 5.06332 13.5947 5.21788 13.4406L14.1159 4.54126Z"
                      stroke="#18181B"
                      stroke-width="1.33"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2150_23760">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Настроить поля
              </Button>
            </div>

            <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-5">
              {crmFields.map((field, index) => (
                <div
                  key={index}
                  className="bg-base-muted text-sm/5 font-medium rounded-lg p-2"
                >
                  {field}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configure Integration Modal */}
      <ConfigureIntegration
        isOpen={showConfigureModal}
        onClose={() => setShowConfigureModal(false)}
        onAddIntegration={(crm, integrationUrl) => {
          console.log("CRM:", crm, "URL:", integrationUrl);
          setIntegrationData({ crm, url: integrationUrl });
          setHasIntegration(true);
        }}
      />

      {/* Delete Integration Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmation
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              setHasIntegration(false);
              setIntegrationData(null);
              setShowSubscriptionWarning(true);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            title="Удалить интеграцию?"
            message={`Вы уверены что хотите удалить интеграцию с ${
              integrationData?.crm || "Битрикс24"
            }? Это действие затронет все существующие КП`}
            confirmText="Удалить"
            cancelText="Отмена"
          />
        )}
      </AnimatePresence>

      {/* Add CRM Fields Modal */}
      <AddCrmFields
        offerId=""
        isOpen={showCrmFieldsModal}
        onClose={() => setShowCrmFieldsModal(false)}
        onUpdateFields={(fields) => {
          // Convert the field objects to string array for display
          const fieldNames = fields.map((field) => field.name);
          setCrmFields(fieldNames);
          console.log("Updated CRM fields:", fieldNames);
        }}
      />

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 48, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-2.5 right-2.5 z-[60]"
          >
            <ToastSuccess
              title="Интеграция удалена"
              text="Интеграция успешно удалена!"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
