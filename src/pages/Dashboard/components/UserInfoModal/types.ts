import type { UserPerformanceMetric } from "@/data-access";

export type UserInfoModalProps = {
  user?: UserPerformanceMetric | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
};
