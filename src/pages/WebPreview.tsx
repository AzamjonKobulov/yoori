import { useState } from "react";
import { useLocation } from "react-router-dom";

interface NavigationState {
  shareData?: {
    name: string;
    status: string;
    variants: VariantType[];
    introduction: string;
    crmFields: Array<{ id: string; name: string; value: string }>;
  };
}

interface VariantType {
  id: string;
  name: string;
  isRecommended: boolean;
  isHidden: boolean;
  tableRows: Array<{
    id: string;
    name: string;
    amount: string;
    cost: string;
    costAmount: string;
  }>;
  productGroups: Array<{
    id: string;
    name: string;
    products: Array<{
      id: string;
      name: string;
      amount: string;
      cost: string;
      costAmount: string;
    }>;
  }>;
}

export default function WebPreview() {
  const location = useLocation();
  const navigationState: NavigationState = location.state || {};

  // Extract data from navigation state
  const shareData = navigationState.shareData || {
    name: "Коммерческое предложение 133-001",
    status: "Создано",
    variants: [
      {
        id: "variant-1",
        name: "Базовый вариант",
        isRecommended: false,
        isHidden: false,
        tableRows: [
          {
            id: "1",
            name: "Камера Canon XA/Sony PXW",
            amount: "3",
            cost: "20000",
            costAmount: "60000",
          },
          {
            id: "2",
            name: "Камера Sony FS5/Canon c200",
            amount: "2",
            cost: "20000",
            costAmount: "40000",
          },
        ],
        productGroups: [
          {
            id: "group-1",
            name: "Группа 1",
            products: [
              {
                id: "1",
                name: "Камера Canon XA/Sony PXW",
                amount: "3",
                cost: "20000",
                costAmount: "60000",
              },
              {
                id: "2",
                name: "Камера Sony FS5/Canon c200",
                amount: "2",
                cost: "20000",
                costAmount: "40000",
              },
            ],
          },
          {
            id: "group-2",
            name: "Группа услуг",
            products: [
              {
                id: "3",
                name: "Камера BlackMagic STUDIO 4K PRO",
                amount: "1",
                cost: "20000",
                costAmount: "20000",
              },
            ],
          },
        ],
      },
      {
        id: "variant-2",
        name: "Премиум",
        isRecommended: true,
        isHidden: false,
        tableRows: [
          {
            id: "4",
            name: "Камера Canon XA/Sony PXW",
            amount: "3",
            cost: "20000",
            costAmount: "60000",
          },
          {
            id: "5",
            name: "Камера Sony FS5/Canon c200",
            amount: "4",
            cost: "20000",
            costAmount: "80000",
          },
          {
            id: "6",
            name: "Профессиональная камера Sony FX6",
            amount: "1",
            cost: "150000",
            costAmount: "150000",
          },
        ],
        productGroups: [
          {
            id: "group-3",
            name: "Дополнительное оборудование",
            products: [
              {
                id: "7",
                name: "Кабель XLR 3м",
                amount: "8",
                cost: "500",
                costAmount: "4000",
              },
              {
                id: "8",
                name: "Стойка для микрофона",
                amount: "4",
                cost: "1500",
                costAmount: "6000",
              },
              {
                id: "9",
                name: "Профессиональный штатив Manfrotto",
                amount: "2",
                cost: "8000",
                costAmount: "16000",
              },
            ],
          },
          {
            id: "group-4",
            name: "Осветительное оборудование",
            products: [
              {
                id: "10",
                name: "Светодиодная панель Aputure Light Storm",
                amount: "2",
                cost: "25000",
                costAmount: "50000",
              },
              {
                id: "11",
                name: "Софтбокс 60x60",
                amount: "2",
                cost: "3000",
                costAmount: "6000",
              },
            ],
          },
        ],
      },
    ],
    introduction:
      "Добрый день! Благодарю, что Вы обратились в нашу компанию. Я подготовил несколько вариантов наших услуг. В любой момент отвечу на появившиеся вопросы",
    crmFields: [
      { id: "1", name: "Клиент", value: "51 COMMUNICATIONS AGENCY" },
      { id: "2", name: "Контактное лицо", value: "Александр" },
      { id: "3", name: "Адрес площадки", value: "ул. Ефремова 10 с1" },
      { id: "4", name: "Дата монтажа оборудования", value: "12.08.2025" },
      { id: "5", name: "Дата проекта", value: "12.08.2025" },
    ],
  };

  const [activeVariantId, setActiveVariantId] = useState<string>(
    shareData.variants[0]?.id || ""
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const getActiveVariant = () => {
    return shareData.variants.find(
      (variant: VariantType) => variant.id === activeVariantId
    );
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const calculateGroupTotal = (
    products: Array<{ amount: string; cost: string }>
  ) => {
    return products.reduce((sum, product) => {
      const amount = parseFloat(product.amount) || 0;
      const cost = parseFloat(product.cost) || 0;
      return sum + amount * cost;
    }, 0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num);
  };

  const calculateVariantTotal = (variant: VariantType) => {
    const mainTableTotal = variant.tableRows.reduce((sum, row) => {
      const amount = parseFloat(row.amount) || 0;
      const cost = parseFloat(row.cost) || 0;
      return sum + amount * cost;
    }, 0);

    const groupsTotal = variant.productGroups.reduce((sum, group) => {
      return sum + calculateGroupTotal(group.products);
    }, 0);

    return mainTableTotal + groupsTotal;
  };

  const activeVariant = getActiveVariant();

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-5 p-5">
        {/* Cover Image */}
        <div className="h-67.5 rounded-md border border-base-border overflow-hidden">
          <img
            src="/assets/images/invision-cover.png"
            alt="Cover Image"
            className="size-full !object-cover"
          />
        </div>

        {/* Introduction and CRM Fields */}
        <div className="grid grid-cols-2 gap-10 bg-white border border-base-border rounded-md p-5">
          <div className="space-y-5">
            <div className="space-y-2 text-lg/7 font-medium">
              <p>{shareData.introduction}</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm/5">
            {shareData.crmFields.map((field) => (
              <li
                key={field.id}
                className="flex-between bg-base-muted rounded-lg p-2"
              >
                <span className="font-medium">{field.name}</span>
                <span className="text-base-tartiary">{field.value || "—"}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Variants */}
        <div className="bg-white border border-base-border rounded-md p-5">
          <div className="flex-between">
            <h3 className="font-medium text-xl/7">Варианты КП</h3>
          </div>

          {/* Variants Tabs */}
          <div className="border-b border-base-border mt-3 flex">
            {shareData.variants.map((variant: VariantType) => (
              <button
                key={variant.id}
                onClick={() => setActiveVariantId(variant.id)}
                className={`h-10 text-sm/3.5 font-medium border-b transition-colors duration-200 -mb-px px-4 flex items-center gap-2 ${
                  activeVariantId === variant.id
                    ? "text-base-chart-1 border-base-chart-1"
                    : "text-base-muted-foreground border-transparent hover:text-base-foreground"
                }`}
              >
                <span>{variant.name}</span>

                {/* Status indicators */}
                {variant.isHidden && (
                  <span className="text-xs px-2 py-0.5 rounded-full text-orange-400 bg-orange-100">
                    Скрыть
                  </span>
                )}

                {variant.isRecommended && (
                  <span className="text-xs px-2 py-0.5 rounded-full text-teal-500 bg-emerald-100">
                    Рекомендуемый
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeVariant && (
            <div className="flex-between bg-white border border-base-border rounded-md mt-6 p-5">
              <div className="w-full flex-between gap-2">
                <p className="text-xl/7">{activeVariant.name}</p>
                {/* Total Sum */}
                {activeVariant && (
                  <span className="text-base-muted-foreground">
                    Итоговая сумма:{" "}
                    <span className="font-medium text-gray-800">
                      {formatNumber(calculateVariantTotal(activeVariant))} ₽
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}

          {activeVariant && (
            <div className="mt-8">
              <div
                className={`overflow-y-auto overflow-x-visible ${
                  (activeVariant?.tableRows?.length || 0) > 10
                    ? "max-h-[600px]"
                    : ""
                }`}
              >
                <table className="table table-auto w-full text-sm/5 text-left border-y border-base-border">
                  <thead className="text-base-muted-foreground sticky -top-px bg-white z-10">
                    <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                      <th className="min-w-[300px] group font-medium px-3.5">
                        <div className="flex items-center gap-5.5 pl-2">
                          <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                            Наименование
                          </span>
                        </div>
                      </th>
                      <th className="w-[13%] group font-medium px-3.5">
                        <div className="flex-between py-2.5">
                          <span className="flex-between cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                            Кол-во, шт
                          </span>
                        </div>
                      </th>
                      <th className="w-[13%] group font-medium px-3.5">
                        <div className="flex-between py-2.5">
                          <span className="flex-between cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                            Цена, ₽
                          </span>
                        </div>
                      </th>
                      <th className="w-[13%] group font-medium px-3.5">
                        <div className="flex-between py-2.5">
                          <span className="flex-between cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                            Стоимость, ₽
                          </span>
                        </div>
                      </th>
                      <th className="w-1/5 group font-medium px-3.5">
                        {/* Empty column for actions space */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeVariant?.tableRows || []).map((item) => (
                      <tr
                        key={item.id}
                        className="relative border-b border-base-border divide-x divide-base-border"
                      >
                        <td className="flex items-center gap-4 font-medium py-2 pl-2 group hover:bg-base-chart-1/[4%] transition-colors duration-200 relative">
                          <div className="pl-1.5 relative h-8 flex items-center">
                            <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="w-[13%] px-3.5">
                          <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                            {item.amount}
                          </span>
                        </td>
                        <td className="w-[13%] px-3.5">
                          <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                            {item.cost.replace(/\s/g, "")}
                          </span>
                        </td>
                        <td className="w-[13%] px-3.5 text-end">
                          {(() => {
                            const amount =
                              parseFloat(
                                (item.amount || "0").replace(/\s/g, "")
                              ) || 0;
                            const cost =
                              parseFloat(
                                (item.cost || "0").replace(/\s/g, "")
                              ) || 0;
                            return (amount * cost).toFixed(2);
                          })()}
                        </td>
                        <td className="w-1/5 px-3.5">
                          {/* Empty cell for actions space */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Product Groups */}
              {(activeVariant?.productGroups || []).map((group) => (
                <div key={group.id} className="mt-6">
                  <div>
                    <div className="flex-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="flex items-center gap-2 hover:bg-base-muted px-2 py-1 rounded transition-colors"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              expandedGroups.has(group.id) ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <h3 className="font-medium">{group.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            ·{" "}
                            {formatNumber(calculateGroupTotal(group.products))}{" "}
                            ₽
                          </span>
                        </button>
                      </div>
                    </div>

                    {expandedGroups.has(group.id) && (
                      <div className="mt-4">
                        <div className="overflow-x-auto">
                          <table className="table table-auto w-full text-sm/5 text-left border-y border-base-border">
                            <thead className="text-base-muted-foreground sticky -top-px bg-white z-10">
                              <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                                <th className="min-w-[300px] group font-medium px-3.5">
                                  <div className="flex items-center gap-5.5 pl-2">
                                    <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                                      Наименование
                                    </span>
                                  </div>
                                </th>
                                <th className="w-[13%] group font-medium px-3.5">
                                  <div className="flex-between py-2.5">
                                    <span className="flex-between cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                                      Кол-во, шт
                                    </span>
                                  </div>
                                </th>
                                <th className="w-[13%] group font-medium px-3.5">
                                  <div className="flex-between py-2.5">
                                    <span className="flex-between cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                                      Цена, ₽
                                    </span>
                                  </div>
                                </th>
                                <th className="w-[13%] group font-medium px-3.5">
                                  <div className="flex-between py-2.5">
                                    <span className="flex-between cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                                      Стоимость, ₽
                                    </span>
                                  </div>
                                </th>
                                <th className="w-1/5 group font-medium px-3.5">
                                  {/* Empty column for actions space */}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.products.map((product) => (
                                <tr
                                  key={product.id}
                                  className="relative border-b border-base-border divide-x divide-base-border"
                                >
                                  <td className="flex items-center gap-4 font-medium py-2 pl-2 group hover:bg-base-chart-1/[4%] transition-colors duration-200 relative">
                                    <div className="pl-1.5 relative h-8 flex items-center">
                                      <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                                        {product.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="w-[13%] px-3.5">
                                    <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                                      {product.amount}
                                    </span>
                                  </td>
                                  <td className="w-[13%] px-3.5">
                                    <span className="cursor-pointer hover:bg-base-muted px-2 py-1 rounded transition-colors">
                                      {product.cost.replace(/\s/g, "")}
                                    </span>
                                  </td>
                                  <td className="w-[13%] px-3.5 text-end">
                                    {(() => {
                                      const amount =
                                        parseFloat(
                                          (product.amount || "0").replace(
                                            /\s/g,
                                            ""
                                          )
                                        ) || 0;
                                      const cost =
                                        parseFloat(
                                          (product.cost || "0").replace(
                                            /\s/g,
                                            ""
                                          )
                                        ) || 0;
                                      return (amount * cost).toFixed(2);
                                    })()}
                                  </td>
                                  <td className="w-1/5 px-3.5">
                                    {/* Empty cell for actions space */}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
