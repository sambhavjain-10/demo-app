import type { TabNavProps } from "./types";

/**
 * A tab navigation component with support for counts and active state management.
 *
 * @component
 * @example
 * // Basic tabs
 * <TabNav
 *   tabs={[
 *     { id: "all", label: "All" },
 *     { id: "active", label: "Active" }
 *   ]}
 *   activeTab="all"
 *   onChange={setActiveTab}
 * />
 *
 * @example
 * // Tabs with counts
 * <TabNav
 *   tabs={[
 *     { id: "all", label: "All", count: 42 },
 *     { id: "pending", label: "Pending", count: 5 }
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 *
 * @param {TabNavProps} props - The component props
 * @param {TabItem[]} props.tabs - Array of tab items with id, label, and optional count
 * @param {string} props.activeTab - The ID of the currently active tab
 * @param {(tabId: string) => void} props.onChange - Callback fired when a tab is clicked
 * @param {string} [props.className] - Additional CSS classes for the container
 * @returns {JSX.Element} A tab navigation component with active state styling
 */
const TabNav = ({ tabs, activeTab, onChange, className }: TabNavProps) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className ?? ""}`}
      role="tablist"
      aria-label="Data views"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              "btn h-9 rounded-full px-4 text-xs uppercase tracking-wide",
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-gray-300",
            ].join(" ")}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabNav;
