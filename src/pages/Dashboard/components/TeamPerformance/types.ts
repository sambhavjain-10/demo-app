export type TeamPerformanceDatum = {
  name: string;
  value: number;
};

export type TeamPerformanceProps = {
  data: TeamPerformanceDatum[];
  totalSessions: number;
  isRefreshing?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  errorMessage?: string;
};
