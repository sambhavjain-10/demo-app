import { DataTable, Search } from "@/components";
import type { UserPerformanceMetric } from "@/data-access";
import type { TeamMembersProps } from "./types";

const trendStyles: Record<UserPerformanceMetric["recent_trend"], string> = {
  improving: "uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  stable: "uppercase bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
  declining: "uppercase bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};

const TeamMembers = ({
  members,
  searchTerm,
  onSearchChange,
  loading = false,
  loadingRows = 5,
  onUserClick,
  isError = false,
  onRetry,
  onReorder,
}: TeamMembersProps) => {
  const handleReorder = (sourceIndex: number, targetIndex: number) => {
    if (!onReorder) return;
    const next = [...members];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next);
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-end gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Team</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Active opportunities
            </h2>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
            {members.length} reps
          </span>
        </div>
        <Search
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search reps"
          className="min-w-[240px]"
        />
      </div>

      <DataTable<UserPerformanceMetric>
        columns={[
          {
            key: "first_name",
            label: "Rep",
            render: (row) => (
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{row.first_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{row.team}</p>
              </div>
            ),
          },
          {
            key: "total_sessions",
            label: "Sessions",
            align: "center",
          },
          {
            key: "avg_score",
            label: "Avg Score",
            align: "right",
            render: (row) => row.avg_score.toFixed(2),
          },
          {
            key: "avg_confidence",
            label: "Confidence",
            align: "right",
            render: (row) => row.avg_confidence.toFixed(2),
          },
          {
            key: "avg_clarity",
            label: "Clarity",
            align: "right",
            render: (row) => row.avg_clarity.toFixed(2),
          },
          {
            key: "avg_listening",
            label: "Listening",
            align: "right",
            render: (row) => row.avg_listening.toFixed(2),
          },
          {
            key: "recent_trend",
            label: "Trend",
            align: "right",
            render: (row) => (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${trendStyles[row.recent_trend]}`}
              >
                {row.recent_trend}
              </span>
            ),
          },
        ]}
        data={members}
        loading={loading}
        loadingRows={loadingRows}
        onRowClick={onUserClick}
        getRowKey={(row) => row.user_id}
        emptyMessage="No reps match your filters"
        isError={isError}
        onRetry={onRetry}
        errorMessage="Unable to load team members."
        enableDrag={!loading && !isError}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default TeamMembers;
