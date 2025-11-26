import type { UserPerformanceMetric } from "@/data-access";

export type TeamMembersProps = {
  members: UserPerformanceMetric[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
  loadingRows?: number;
  onUserClick?: (user: UserPerformanceMetric) => void;
  isError?: boolean;
  onRetry?: () => void;
  onReorder?: (nextMembers: UserPerformanceMetric[]) => void;
};
