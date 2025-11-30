import { useCallback, useMemo } from "react";
import { Button } from "@/components";
import { Close } from "@/icons";
import type { SessionsFiltersPanelProps } from "./types";
import { DEFAULT_FILTERS } from "../../constants";

const SessionsFiltersPanel = ({
  isOpen,
  filters,
  onChange,
  onClose,
  teamOptions,
}: SessionsFiltersPanelProps) => {
  const hasActiveFilters = useMemo(() => {
    const scoreRangeChanged =
      filters.scoreRange[0] !== DEFAULT_FILTERS.scoreRange[0] ||
      filters.scoreRange[1] !== DEFAULT_FILTERS.scoreRange[1];
    const dateRangeChanged = Boolean(filters.dateRange.start) || Boolean(filters.dateRange.end);
    const teamsChanged = filters.teams.length > 0;
    return scoreRangeChanged || dateRangeChanged || teamsChanged;
  }, [filters]);

  const updateScore = useCallback(
    (key: "min" | "max", rawValue: number) => {
      const value = Math.max(0, Math.min(10, rawValue));
      const [min, max] = filters.scoreRange;
      const nextRange: [number, number] =
        key === "min" ? [Math.min(value, max), Math.max(value, max)] : [min, Math.max(value, min)];
      onChange({ ...filters, scoreRange: nextRange });
    },
    [filters, onChange]
  );

  const updateDate = useCallback(
    (key: "start" | "end", value: string) => {
      onChange({
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [key]: value,
        },
      });
    },
    [filters, onChange]
  );

  const toggleTeam = useCallback(
    (team: string) => {
      const isSelected = filters.teams.includes(team);
      const nextTeams = isSelected
        ? filters.teams.filter((current) => current !== team)
        : [...filters.teams, team];
      onChange({ ...filters, teams: nextTeams });
    },
    [filters, onChange]
  );

  const resetFilters = () => onChange(DEFAULT_FILTERS);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Filters Panel */}
      <aside className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:z-auto lg:max-h-none lg:w-full lg:max-w-sm lg:rounded-3xl lg:border lg:shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button type="button" theme="secondary" onClick={resetFilters}>
                Reset All
              </Button>
            )}
            <Button
              type="button"
              theme="icon"
              aria-label="Close filters panel"
              onClick={onClose}
              className="h-8 w-8 text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Close className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Teams</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {teamOptions.map((team) => {
                const active = filters.teams.includes(team);
                return (
                  <button
                    key={team}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleTeam(team)}
                    className={`cursor-pointer rounded-full border px-4 py-1 text-sm font-medium transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {team}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Score range</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase text-gray-500 dark:text-gray-400">Min</label>
                <input
                  type="number"
                  min={0}
                  max={filters.scoreRange[1]}
                  value={filters.scoreRange[0]}
                  onChange={(event) => updateScore("min", Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent p-2 text-sm text-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-gray-500 dark:text-gray-400">Max</label>
                <input
                  type="number"
                  min={filters.scoreRange[0]}
                  max={10}
                  value={filters.scoreRange[1]}
                  onChange={(event) => updateScore("max", Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent p-2 text-sm text-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-white">Date range</h3>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs uppercase text-gray-500 dark:text-gray-400">From</label>
                <input
                  type="date"
                  value={filters.dateRange.start ?? ""}
                  onChange={(event) => updateDate("start", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent p-2 text-sm text-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-gray-500 dark:text-gray-400">To</label>
                <input
                  type="date"
                  value={filters.dateRange.end ?? ""}
                  onChange={(event) => updateDate("end", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent p-2 text-sm text-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SessionsFiltersPanel;
