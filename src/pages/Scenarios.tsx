import { useState } from "react";
import { Button, useToast } from "../components";
import CreateScenario from "../components/modals/CreateScenario";

interface Scenario {
  id: string;
  name: string;
  condition: string;
  scheme: string;
  status: string;
  action: string;
  isActive: boolean;
}

export default function Scenarios() {
  const [isCreateScenarioModalOpen, setIsCreateScenarioModalOpen] =
    useState(false);

  const { showToast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const handleCreateScenario = (scenarioData: {
    name: string;
    condition: string;
    scheme: string;
    status: string;
    action: string;
  }) => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      ...scenarioData,
      isActive: true,
    };

    setScenarios((prev) => [newScenario, ...prev]);

    // Show success toast
    showToast("Сценарий создан", "Сценарий успешно добавлен в список!");

    console.log("Creating scenario:", newScenario);
  };

  return (
    <div className="p-5">
      {/* Header */}

      <div className="flex-between">
        <h1 className="text-xl font-medium">Список сценариев</h1>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setIsCreateScenarioModalOpen(true)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33472 8.00001H12.6681M8.00138 3.33334V12.6667"
              stroke="#FAFAFA"
              stroke-width="1.33"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Создать сценарий
        </Button>
      </div>

      <div
        className={`h-[calc(100vh-96px)] overflow-y-auto ${
          scenarios.length === 0 ? "flex-center" : ""
        }`}
      >
        {/* When There are no scenarios */}
        {scenarios.length === 0 && (
          <div className="max-w-2xl flex flex-col gap-6 px-3.5">
            <img
              src="/assets/images/scenarios.svg"
              alt="Image"
              className="w-100 aspect-square mx-auto"
            />
            <div className="space-y-4 text-center px-5">
              <h2 className="text-xl/7 font-semibold">Сценарии отсутствуют</h2>
              <p className="text-base-muted-foreground text-sm/5">
                Создайте сценарии, чтобы упростить работу с входящими заявками
              </p>
            </div>
          </div>
        )}

        {/* When There are scenarios */}
        {scenarios.length > 0 && (
          <div className="space-y-5 mt-5">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.id}
                className="space-y-5 bg-white border border-base-border rounded-md shadow-sm p-5"
              >
                <div className="flex-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 shrink-0 flex-center text-sm/5 font-medium text-base-muted-foreground bg-slate-50 rounded-md">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-xl/7 text-base-foreground">
                      {scenario.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Toggle */}
                    <div className="flex items-center gap-2 text-sm/3.5">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={scenario.isActive}
                          onChange={(e) => {
                            setScenarios((prev) =>
                              prev.map((s) =>
                                s.id === scenario.id
                                  ? { ...s, isActive: e.target.checked }
                                  : s
                              )
                            );
                          }}
                        />
                        <div className="w-9 h-5 bg-base-border rounded-full peer peer-checked:bg-base-chart-1 transition-colors duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-full shadow-toggle-track"></div>
                      </label>
                      Сценарий активен
                    </div>

                    {/* Delete and Edit Buttons */}
                    <div className="flex items-center gap-3">
                      {/* Edit Button */}
                      <Button
                        variant="outline"
                        className="size-9 shrink-0 flex-center !p-0"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log("Edit scenario:", scenario.id);
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2223_5609)">
                            <path
                              d="M10.0002 3.33333L12.6668 6M14.1161 4.54126C14.4686 4.18888 14.6666 3.71091 14.6667 3.2125C14.6668 2.71409 14.4688 2.23607 14.1165 1.8836C13.7641 1.53112 13.2861 1.33307 12.7877 1.33301C12.2893 1.33295 11.8113 1.53088 11.4588 1.88326L2.56145 10.7826C2.40667 10.9369 2.29219 11.127 2.22812 11.3359L1.34745 14.2373C1.33022 14.2949 1.32892 14.3562 1.34369 14.4145C1.35845 14.4728 1.38873 14.5261 1.43132 14.5686C1.4739 14.6111 1.5272 14.6413 1.58556 14.656C1.64392 14.6707 1.70516 14.6693 1.76279 14.6519L4.66479 13.7719C4.87357 13.7084 5.06357 13.5947 5.21812 13.4406L14.1161 4.54126Z"
                              stroke="#18181B"
                              stroke-width="1.33"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2223_5609">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </Button>
                      {/* Delete Button */}
                      <Button
                        variant="outline"
                        className="size-9 shrink-0 flex-center !p-0"
                        onClick={() => {
                          setScenarios((prev) =>
                            prev.filter((s) => s.id !== scenario.id)
                          );
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 3.99999H14M12.6667 3.99999V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V3.99999M5.33333 3.99999V2.66666C5.33333 1.99999 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 1.99999 10.6667 2.66666V3.99999M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333"
                            stroke="#DC2626"
                            stroke-width="1.33"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm/5">
                  <div className="space-y-0.5 ">
                    <p className="text-base-muted-foreground">Условие</p>
                    <p className="text-base-foreground">
                      {scenario.condition}{" "}
                      <span className="font-semibold">
                        по схеме «{scenario.scheme}» на статус «
                        {scenario.status}»
                      </span>
                    </p>
                  </div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.00098 12H19.001M19.001 12L12.001 5M19.001 12L12.001 19"
                      stroke="#71717A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div className="space-y-0.5 ">
                    <p className="text-base-muted-foreground">Действие</p>
                    <p className="text-base-foreground">{scenario.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Scenario Modal */}
      <CreateScenario
        isOpen={isCreateScenarioModalOpen}
        onClose={() => setIsCreateScenarioModalOpen(false)}
        onCreateScenario={handleCreateScenario}
      />
    </div>
  );
}
