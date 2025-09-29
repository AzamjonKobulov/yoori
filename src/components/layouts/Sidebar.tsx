import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsLinks from "../ui/SettingsLinks";
import { useClickOutside } from "../../hooks/useClickOutside";

// Define the type for each link
type LinkItem = {
  icon: React.FC<{ className?: string }>;
  path: string;
  activePaths?: string[]; // Optional array of paths that should make this link active
};

const links: LinkItem[] = [
  {
    icon: ({ className }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M14 2.00092V6.00092C14 6.53135 14.2107 7.04006 14.5858 7.41513C14.9609 7.7902 15.4696 8.00092 16 8.00092H20M9 13.0009V12.0009H15V13.0009M12 12.0009V18.0009M11 18.0009H13M15 2.00092H6C5.46957 2.00092 4.96086 2.21163 4.58579 2.5867C4.21071 2.96177 4 3.47048 4 4.00092V20.0009C4 20.5313 4.21071 21.0401 4.58579 21.4151C4.96086 21.7902 5.46957 22.0009 6 22.0009H18C18.5304 22.0009 19.0391 21.7902 19.4142 21.4151C19.7893 21.0401 20 20.5313 20 20.0009V7.00092L15 2.00092Z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    path: "/",
    activePaths: ["/", "/details"], // Add active paths for nested routes
  },
  {
    icon: ({ className }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M3.30005 7.00092L12 12.0009M12 12.0009L20.7001 7.00092M12 12.0009L12 22.0009M21 8.00082C20.9996 7.65009 20.9071 7.30563 20.7315 7.00198C20.556 6.69833 20.3037 6.44618 20 6.27082L13 2.27082C12.696 2.09528 12.3511 2.00287 12 2.00287C11.6489 2.00287 11.304 2.09528 11 2.27082L4 6.27082C3.69626 6.44618 3.44398 6.69833 3.26846 7.00198C3.09294 7.30563 3.00036 7.65009 3 8.00082V16.0008C3.00036 16.3515 3.09294 16.696 3.26846 16.9997C3.44398 17.3033 3.69626 17.5555 4 17.7308L11 21.7308C11.304 21.9064 11.6489 21.9988 12 21.9988C12.3511 21.9988 12.696 21.9064 13 21.7308L20 17.7308C20.3037 17.5555 20.556 17.3033 20.7315 16.9997C20.9071 16.696 20.9996 16.3515 21 16.0008V8.00082Z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    path: "/products",
  },

  {
    icon: ({ className }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M16 21.0009V19.0009C16 17.94 15.5786 16.9226 14.8284 16.1725C14.0783 15.4223 13.0609 15.0009 12 15.0009H6C4.93913 15.0009 3.92172 15.4223 3.17157 16.1725C2.42143 16.9226 2 17.94 2 19.0009V21.0009M22 21.0008V19.0008C21.9993 18.1145 21.7044 17.2536 21.1614 16.5531C20.6184 15.8527 19.8581 15.3524 19 15.1308M16 3.1308C16.8604 3.3511 17.623 3.8515 18.1676 4.55311C18.7122 5.25472 19.0078 6.11763 19.0078 7.0058C19.0078 7.89397 18.7122 8.75688 18.1676 9.45849C17.623 10.1601 16.8604 10.6605 16 10.8808M13 7.00092C13 9.21005 11.2091 11.0009 9 11.0009C6.79086 11.0009 5 9.21005 5 7.00092C5 4.79178 6.79086 3.00092 9 3.00092C11.2091 3.00092 13 4.79178 13 7.00092Z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    path: "/clients",
  },
  {
    icon: ({ className }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M21 7.00092H18C17.4696 7.00092 16.9609 6.7902 16.5858 6.41513C16.2107 6.04006 16 5.53135 16 5.00092V2.00092M7 8.00092V16.8009C7 17.1009 7.2 17.4009 7.4 17.6009C7.6 17.8009 7.9 18.0009 8.2 18.0009H15M3 12.0009V20.8009C3 21.1009 3.2 21.4009 3.4 21.6009C3.6 21.8009 3.9 22.0009 4.2 22.0009H11M21 6.00092V12.5009C21 13.3009 20.3 14.0009 19.5 14.0009H12.5C11.7 14.0009 11 13.3009 11 12.5009V3.50092C11 2.70092 11.7 2.00092 12.5 2.00092H17L21 6.00092Z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    path: "/templates",
    activePaths: ["/templates", "/details"], // Add active paths for template details
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  // Get URL search parameters
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");

  // Define settings pages
  const settingsPages = [
    "/users",
    "/currencies",
    "/integrations",
    "/scenarios",
    "/payment",
    "/graphics",
  ];
  const isOnSettingsPage = settingsPages.includes(location.pathname);

  // Use the click outside hook
  const settingsDropdownRef = useClickOutside<HTMLDivElement>({
    callback: () => setShowSettingsDropdown(false),
    enabled: showSettingsDropdown,
  });

  return (
    <aside className="fixed top-0 left-0 z-50 min-h-screen w-14 flex flex-col justify-between bg-white border-r border-base-border p-2.5">
      <div className="space-y-5">
        {/* Logo */}
        <div className="size-9 shrink-0 bg-base-chart-1 rounded-md flex-center">
          <img src="/assets/images/logo-icon.svg" alt="Logo" />
        </div>

        {/* Links */}
        <ul className="space-y-4">
          {links.map((link, idx) => {
            let isActive = false;

            if (link.activePaths) {
              // Special handling for /details path based on type parameter
              if (location.pathname === "/details") {
                if (link.path === "/" && type === "commercial-offer") {
                  isActive = true;
                } else if (link.path === "/templates" && type === "template") {
                  isActive = true;
                } else if (link.path === "/" && !type) {
                  // Default to commercial offer if no type specified
                  isActive = true;
                } else {
                  // For /details path, only activate based on type parameter
                  isActive = false;
                }
              } else {
                // For other paths, use the normal activePaths logic
                isActive = link.activePaths.includes(location.pathname);
              }
            } else {
              isActive = location.pathname === link.path;
            }

            return (
              <li key={idx}>
                <Link
                  to={link.path}
                  className={`size-9 shrink-0 group flex-center rounded-md transition-all duration-200 ${
                    isActive ? "bg-base-chart-1/10" : "hover:bg-base-chart-1/5"
                  }`}
                >
                  <link.icon
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "stroke-base-chart-1"
                        : "stroke-base-muted-foreground group-hover:stroke-base-chart-1"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <hr className="border-base-border" />
        <div className="relative" ref={settingsDropdownRef}>
          <button
            className={`size-9 shrink-0 group flex-center rounded-md transition-all duration-200 ${
              showSettingsDropdown || isOnSettingsPage
                ? "bg-base-chart-1"
                : "bg-base-muted"
            }`}
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            aria-label="Настройки"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.22 2.00098H11.78C11.2496 2.00098 10.7409 2.21169 10.3658 2.58676C9.99072 2.96184 9.78 3.47054 9.78 4.00098V4.18098C9.77964 4.5317 9.68706 4.87617 9.51154 5.17981C9.33602 5.48346 9.08374 5.73561 8.78 5.91098L8.35 6.16098C8.04596 6.33651 7.70108 6.42893 7.35 6.42893C6.99893 6.42893 6.65404 6.33651 6.35 6.16098L6.2 6.08098C5.74107 5.81624 5.19584 5.74442 4.684 5.88128C4.17217 6.01815 3.73555 6.35251 3.47 6.81098L3.25 7.19098C2.98526 7.64991 2.91345 8.19514 3.05031 8.70697C3.18717 9.21881 3.52154 9.65543 3.98 9.92098L4.13 10.021C4.43228 10.1955 4.68362 10.4461 4.85905 10.7478C5.03448 11.0495 5.1279 11.3919 5.13 11.741V12.251C5.1314 12.6034 5.03965 12.9499 4.86405 13.2555C4.68844 13.561 4.43521 13.8148 4.13 13.991L3.98 14.081C3.52154 14.3465 3.18717 14.7831 3.05031 15.295C2.91345 15.8068 2.98526 16.352 3.25 16.811L3.47 17.191C3.73555 17.6494 4.17217 17.9838 4.684 18.1207C5.19584 18.2575 5.74107 18.1857 6.2 17.921L6.35 17.841C6.65404 17.6654 6.99893 17.573 7.35 17.573C7.70108 17.573 8.04596 17.6654 8.35 17.841L8.78 18.091C9.08374 18.2663 9.33602 18.5185 9.51154 18.8221C9.68706 19.1258 9.77964 19.4703 9.78 19.821V20.001C9.78 20.5314 9.99072 21.0401 10.3658 21.4152C10.7409 21.7903 11.2496 22.001 11.78 22.001H12.22C12.7504 22.001 13.2591 21.7903 13.6342 21.4152C14.0093 21.0401 14.22 20.5314 14.22 20.001V19.821C14.2204 19.4703 14.3129 19.1258 14.4885 18.8221C14.664 18.5185 14.9163 18.2663 15.22 18.091L15.65 17.841C15.954 17.6654 16.2989 17.573 16.65 17.573C17.0011 17.573 17.346 17.6654 17.65 17.841L17.8 17.921C18.2589 18.1857 18.8042 18.2575 19.316 18.1207C19.8278 17.9838 20.2645 17.6494 20.53 17.191L20.75 16.801C21.0147 16.342 21.0866 15.7968 20.9497 15.285C20.8128 14.7731 20.4785 14.3365 20.02 14.071L19.87 13.991C19.5648 13.8148 19.3116 13.561 19.136 13.2555C18.9604 12.9499 18.8686 12.6034 18.87 12.251V11.751C18.8686 11.3986 18.9604 11.052 19.136 10.7465C19.3116 10.4409 19.5648 10.1872 19.87 10.011L20.02 9.92098C20.4785 9.65543 20.8128 9.21881 20.9497 8.70697C21.0866 8.19514 21.0147 7.64991 20.75 7.19098L20.53 6.81098C20.2645 6.35251 19.8278 6.01815 19.316 5.88128C18.8042 5.74442 18.2589 5.81624 17.8 6.08098L17.65 6.16098C17.346 6.33651 17.0011 6.42893 16.65 6.42893C16.2989 6.42893 15.954 6.33651 15.65 6.16098L15.22 5.91098C14.9163 5.73561 14.664 5.48346 14.4885 5.17981C14.3129 4.87617 14.2204 4.5317 14.22 4.18098V4.00098C14.22 3.47054 14.0093 2.96184 13.6342 2.58676C13.2591 2.21169 12.7504 2.00098 12.22 2.00098Z"
                stroke={
                  showSettingsDropdown || isOnSettingsPage
                    ? "#FAFAFA"
                    : "#71717A"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15.001C13.6569 15.001 15 13.6578 15 12.001C15 10.3441 13.6569 9.00098 12 9.00098C10.3431 9.00098 9 10.3441 9 12.001C9 13.6578 10.3431 15.001 12 15.001Z"
                stroke={
                  showSettingsDropdown || isOnSettingsPage
                    ? "#FAFAFA"
                    : "#71717A"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Settings Dropdown */}
          <AnimatePresence>
            {showSettingsDropdown && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50"
              >
                <SettingsLinks
                  onLinkClick={() => setShowSettingsDropdown(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Link
        to="/profile"
        className={`size-9 shrink-0 group flex-center rounded-md transition-all duration-200 ${
          location.pathname === "/profile"
            ? "bg-base-chart-1/10"
            : "bg-base-secondary"
        }`}
      >
        <img src="/assets/images/avatar.png" alt="Profile" />
      </Link>
    </aside>
  );
}
