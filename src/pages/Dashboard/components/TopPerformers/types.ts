import type { UserPerformanceMetric } from "@/data-access";

export type TopPerformersProps = {
  performers: UserPerformanceMetric[];
  loading?: boolean;
  loadingRows?: number;
  onUserClick?: (user: UserPerformanceMetric) => void;
  isError?: boolean;
  onRetry?: () => void;
};
