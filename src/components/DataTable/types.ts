import type { ReactNode } from "react";

export type TableColumn<T extends Record<string, unknown>> = {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
};

export type DataTableProps<T extends Record<string, unknown>> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
  loadingRows?: number;
  onRowClick?: (row: T) => void;
  rowClassName?: string;
  isError?: boolean;
  onRetry?: () => void;
  errorMessage?: string;
  enableDrag?: boolean;
  onReorder?: (sourceIndex: number, targetIndex: number) => void;
};
