import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Select, SkeletonLoader, ErrorState } from "@/components";
import { useScoreTrends } from "@/data-access";
import type { ScoreTrendDataPoint } from "@/data-access";

type DateRangeOption = {
  value: number;
  label: string;
};

const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];

const DEFAULT_DAYS = 30;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const fillMissingDates = (data: ScoreTrendDataPoint[], days: number): ScoreTrendDataPoint[] => {
  if (data.length === 0) return [];

  const dataMap = new Map<string, ScoreTrendDataPoint>();
  data.forEach((point) => {
    dataMap.set(point.date, point);
  });

  const result: ScoreTrendDataPoint[] = [];
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const existing = dataMap.get(dateStr);
    if (existing) {
      result.push(existing);
    } else {
      // Fill missing dates with zero values (will be converted to null in chartData)
      result.push({
        date: dateStr,
        avg_score: 0,
        count: 0,
      });
    }
  }

  return result;
};

const ScoreTrendsPage = () => {
  const [selectedDays, setSelectedDays] = useState<number>(DEFAULT_DAYS);

  const { data: scoreTrends, isLoading, isError, refetch } = useScoreTrends({ days: selectedDays });

  const chartData = useMemo(() => {
    if (!scoreTrends) return [];

    const filledData = fillMissingDates(scoreTrends, selectedDays);
    return filledData.map((point) => ({
      date: formatDate(point.date),
      dateValue: point.date,
      avgScore: point.count > 0 ? point.avg_score : null,
      count: point.count,
      hasData: point.count > 0,
    }));
  }, [scoreTrends, selectedDays]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Score Trends</h1>
        <div className="flex items-center gap-3">
          <Select<number>
            options={DATE_RANGE_OPTIONS}
            value={selectedDays}
            onChange={(value) => setSelectedDays(value)}
            className="w-32"
          />
        </div>
      </header>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {isLoading ? (
          <div className="h-96">
            <SkeletonLoader lines={8} />
          </div>
        ) : isError ? (
          <div className="flex h-96 items-center justify-center">
            <ErrorState
              title="We couldn't load score trends"
              description="Please check your connection and try again."
              onRetry={() => refetch()}
              actionLabel="Retry"
            />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No data available
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-sm uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Average Session Score
              </p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Score Trend Over Time
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                <YAxis
                  domain={[0, 10]}
                  className="text-xs text-gray-600 dark:text-white"
                  label={{
                    value: "Average Score",
                    angle: -90,
                    position: "insideLeft",
                    className: "text-xs text-gray-600 dark:text-white",
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload as (typeof chartData)[0];
                    if (!data.hasData) {
                      return (
                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-900">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                          <p className="text-gray-500 dark:text-gray-400">No data available</p>
                        </div>
                      );
                    }
                    return (
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-900">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Average Score:{" "}
                          <span className="font-semibold">
                            {data.avgScore?.toFixed(2) ?? "N/A"}
                          </span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Sessions: <span className="font-semibold">{data.count}</span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={(props) => {
                    const { payload } = props;
                    if (!payload?.hasData) return null;
                    return <circle cx={props.cx} cy={props.cy} r={4} fill="#3b82f6" />;
                  }}
                  activeDot={{ r: 6 }}
                  name="Average Score"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScoreTrendsPage;
