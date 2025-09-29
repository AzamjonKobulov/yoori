import { Link } from "react-router-dom";

interface SettingsLinksProps {
  onLinkClick: () => void;
}

export default function SettingsLinks({ onLinkClick }: SettingsLinksProps) {
  return (
    <div className="min-w-max absolute left-full top-1/2 -translate-y-1/2 ml-2 flex flex-col bg-white border border-base-border rounded-md shadow-md p-1">
      <ul className="text-sm/5">
        <li>
          <Link
            to="/users"
            onClick={onLinkClick}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-base-chart-1/5 transition-all duration-200 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6667 14V12.6667C10.6667 11.9594 10.3858 11.2811 9.88566 10.781C9.38556 10.281 8.70728 10 8.00004 10H4.00004C3.2928 10 2.61452 10.281 2.11442 10.781C1.61433 11.2811 1.33337 11.9594 1.33337 12.6667V14M14.6667 13.9999V12.6666C14.6663 12.0757 14.4696 11.5018 14.1076 11.0348C13.7456 10.5678 13.2388 10.2343 12.6667 10.0866M10.6667 2.08659C11.2403 2.23346 11.7487 2.56706 12.1118 3.0348C12.4749 3.50254 12.6719 4.07781 12.6719 4.66992C12.6719 5.26204 12.4749 5.83731 12.1118 6.30505C11.7487 6.77279 11.2403 7.10639 10.6667 7.25326M8.66671 4.66667C8.66671 6.13943 7.4728 7.33333 6.00004 7.33333C4.52728 7.33333 3.33337 6.13943 3.33337 4.66667C3.33337 3.19391 4.52728 2 6.00004 2C7.4728 2 8.66671 3.19391 8.66671 4.66667Z"
                stroke="#09090B"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Список пользователей
          </Link>
        </li>
        <li>
          <Link
            to="/currencies"
            onClick={onLinkClick}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-base-chart-1/5 transition-all duration-200 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2147_12402)">
                <path
                  d="M12.0599 6.91345C12.6901 7.1484 13.2509 7.53847 13.6904 8.04758C14.1299 8.5567 14.434 9.16841 14.5744 9.82616C14.7149 10.4839 14.6872 11.1665 14.494 11.8107C14.3007 12.4549 13.9482 13.04 13.4689 13.5119C12.9896 13.9837 12.3991 14.3271 11.7519 14.5103C11.1048 14.6934 10.4219 14.7105 9.76639 14.5598C9.11091 14.4091 8.50401 14.0955 8.00182 13.6481C7.49963 13.2007 7.11836 12.6339 6.89327 12.0001M4.66671 4.00004H5.33337V6.66671M11.1399 9.2533L11.6066 9.72663L9.7266 11.6066M9.33337 5.33337C9.33337 7.54251 7.54251 9.33337 5.33337 9.33337C3.12424 9.33337 1.33337 7.54251 1.33337 5.33337C1.33337 3.12424 3.12424 1.33337 5.33337 1.33337C7.54251 1.33337 9.33337 3.12424 9.33337 5.33337Z"
                  stroke="#09090B"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2147_12402">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Валюты
          </Link>
        </li>
        <li>
          <Link
            to="/integrations"
            onClick={onLinkClick}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-base-chart-1/5 transition-all duration-200 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2147_12407)">
                <path
                  d="M4.66671 9.33337V10C4.66671 10.3537 4.80718 10.6928 5.05723 10.9428C5.30728 11.1929 5.64642 11.3334 6.00004 11.3334H6.66671M9.33337 4.66671H10C10.3537 4.66671 10.6928 4.80718 10.9428 5.05723C11.1929 5.30728 11.3334 5.64642 11.3334 6.00004V6.66671M10.6667 9.33337H13.3334C14.0698 9.33337 14.6667 9.93033 14.6667 10.6667V13.3334C14.6667 14.0698 14.0698 14.6667 13.3334 14.6667H10.6667C9.93033 14.6667 9.33337 14.0698 9.33337 13.3334V10.6667C9.33337 9.93033 9.93033 9.33337 10.6667 9.33337ZM2.66671 1.33337H5.33337C6.06975 1.33337 6.66671 1.93033 6.66671 2.66671V5.33337C6.66671 6.06975 6.06975 6.66671 5.33337 6.66671H2.66671C1.93033 6.66671 1.33337 6.06975 1.33337 5.33337V2.66671C1.33337 1.93033 1.93033 1.33337 2.66671 1.33337Z"
                  stroke="#09090B"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2147_12407">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Интеграции
          </Link>
        </li>
        <li>
          <Link
            to="/scenarios"
            onClick={onLinkClick}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-base-chart-1/5 transition-all duration-200 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2.66671V1.33337M10 10.6667V9.33337M5.33333 6.00004H6.66667M13.3333 6.00004H14.6667M11.8665 7.86674L12.6665 8.66674M10 6.00004H10.0067M11.8665 4.13337L12.6665 3.33337M2 14L8 8.00004M8.13333 4.13337L7.33333 3.33337"
                stroke="#09090B"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Сценарии
          </Link>
        </li>
        <li>
          <Link
            to="/plans"
            onClick={onLinkClick}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-base-chart-1/5 transition-all duration-200 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33337 6.66671H14.6667M2.66671 3.33337H13.3334C14.0698 3.33337 14.6667 3.93033 14.6667 4.66671V11.3334C14.6667 12.0698 14.0698 12.6667 13.3334 12.6667H2.66671C1.93033 12.6667 1.33337 12.0698 1.33337 11.3334V4.66671C1.33337 3.93033 1.93033 3.33337 2.66671 3.33337Z"
                stroke="#09090B"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Оплата
          </Link>
        </li>
        <li>
          <Link
            to="/graphics"
            onClick={onLinkClick}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-base-chart-1/5 transition-all duration-200 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 9.99996L11.9427 7.94263C11.6926 7.69267 11.3536 7.55225 11 7.55225C10.6464 7.55225 10.3074 7.69267 10.0573 7.94263L4 14M3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V12.6667C14 13.403 13.403 14 12.6667 14H3.33333C2.59695 14 2 13.403 2 12.6667V3.33333C2 2.59695 2.59695 2 3.33333 2ZM7.33333 6C7.33333 6.73638 6.73638 7.33333 6 7.33333C5.26362 7.33333 4.66667 6.73638 4.66667 6C4.66667 5.26362 5.26362 4.66667 6 4.66667C6.73638 4.66667 7.33333 5.26362 7.33333 6Z"
                stroke="#09090B"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Настройка графики
          </Link>
        </li>
      </ul>
    </div>
  );
}
