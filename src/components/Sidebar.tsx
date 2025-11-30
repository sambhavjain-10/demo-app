import { NavLink } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Sessions as SessionsIcon,
  ScoreTrends as ScoreTrendsIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
} from "@/icons";
import { useTheme } from "@/hooks";
import { Button } from "@/components";

const links = [
  { to: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { to: "/sessions", label: "Sessions", Icon: SessionsIcon },
  { to: "/score-trends", label: "Score Trends", Icon: ScoreTrendsIcon },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
    isActive
      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
      : "text-gray-500 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700",
  ].join(" ");

/**
 * A sidebar navigation component with icon-based links and theme toggle.
 *
 * @component
 * @description
 * Displays a vertical sidebar with navigation links to different pages
 * and a theme toggle button at the bottom. Navigation links are highlighted
 * when active, and the component uses React Router's NavLink for routing.
 *
 * @example
 * // Typically used in the main app layout
 * <Sidebar />
 *
 * @returns {JSX.Element} A sidebar navigation component with theme toggle
 */
const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className="h-full flex w-20 flex-col items-center rounded-3xl bg-white/80 py-6 shadow-lg shadow-blue-500/10 backdrop-blur dark:bg-gray-800/80">
      <nav className="flex flex-1 flex-col items-center gap-4">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={linkClasses}
            aria-label={label}
            title={label}
            end={to === "/dashboard"}
          >
            <Icon size="28px" />
            <span className="sr-only">{label}</span>
          </NavLink>
        ))}
      </nav>
      <Button
        type="button"
        theme="icon"
        className={`${isDark ? "hover:text-yellow-300" : "hover:text-blue-600"}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`${isDark ? "Light" : "Dark"} mode`}
        data-pressed={isDark}
      >
        {isDark ? <SunIcon size="22px" /> : <MoonIcon size="22px" />}
      </Button>
    </aside>
  );
};

export default Sidebar;
