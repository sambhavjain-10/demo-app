import { DataTable } from "@/components";
import type { UserPerformanceMetric } from "@/data-access";
import type { TopPerformersProps } from "./types";

const trendStyles: Record<UserPerformanceMetric["recent_trend"], string> = {
  improving: "uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  stable: "uppercase bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
  declining: "uppercase bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};

const TopPerformers = ({
  performers,
  loading = false,
  loadingRows = 3,
  onUserClick,
  isError = false,
  onRetry,
}: TopPerformersProps) => (
  <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-4">
      <p className="text-sm uppercase tracking-wide text-gray-400">Leaderboard</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top performers</h2>
    </div>
    <div className="min-w-0 overflow-hidden">
      <DataTable<UserPerformanceMetric>
        columns={[
          {
            key: "first_name",
            label: "Rep",
            render: (row) => (
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{row.first_name}</p>
              </div>
            ),
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
        data={performers}
        loading={loading}
        loadingRows={loadingRows}
        onRowClick={onUserClick}
        getRowKey={(row) => row.user_id}
        emptyMessage="No performers found"
        isError={isError}
        onRetry={onRetry}
        errorMessage="Unable to load top performers."
      />
    </div>
  </div>
);

export default TopPerformers;
