import type { TabNavProps } from "./types";

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
