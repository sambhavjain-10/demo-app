import { useId } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import ErrorState from "@/components/ErrorState/ErrorState";
import type { TeamPerformanceProps } from "./types";

type SimpleTooltipProps = {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string | number;
};

const CustomTooltip = ({ active, payload, label }: SimpleTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
      <p className="text-gray-600 dark:text-gray-300">{payload[0]?.value?.toFixed?.(2)}</p>
    </div>
  );
};

const TeamPerformance = ({
  data,
  totalSessions,
  isRefreshing,
  isError = false,
  onRetry,
  errorMessage = "Unable to fetch the latest team metrics.",
}: TeamPerformanceProps) => {
  const gradientId = useId();

  return (
    <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-400">Team Metrics</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sentiment overview
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total sessions</p>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-300">
            {totalSessions.toLocaleString()}
          </p>
          {isRefreshing && <p className="text-xs text-gray-400">Refreshing…</p>}
        </div>
      </div>
      {isError ? (
        <div className="flex h-72 items-center justify-center">
          <ErrorState
            title="Team metrics unavailable"
            description={errorMessage}
            onRetry={onRetry}
            actionLabel="Retry"
          />
        </div>
      ) : (
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 6]} tickFormatter={(value) => value.toFixed(1)} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} fill={`url(#${gradientId})`} />
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.75" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TeamPerformance;
