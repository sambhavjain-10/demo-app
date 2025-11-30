import { useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import SkeletonLoader from "@/components/SkeletonLoader/SkeletonLoader";
import ErrorState from "@/components/ErrorState/ErrorState";
import type { DataTableProps } from "./types";

const cellAlignment = (align?: "left" | "center" | "right") => {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
};

/**
 * A feature-rich data table component with loading states, error handling, drag-and-drop reordering, and row click support.
 *
 * @component
 * @template T - The type of data rows (must be an object/record)
 *
 * @example
 * // Basic table
 * <DataTable
 *   columns={[
 *     { key: "name", label: "Name" },
 *     { key: "email", label: "Email" }
 *   ]}
 *   data={users}
 *   getRowKey={(row) => row.id}
 * />
 *
 * @example
 * // Table with custom rendering and click handler
 * <DataTable
 *   columns={[
 *     {
 *       key: "name",
 *       label: "Name",
 *       render: (row) => <strong>{row.name}</strong>
 *     },
 *     { key: "score", label: "Score", align: "right" }
 *   ]}
 *   data={sessions}
 *   getRowKey={(row) => row.id}
 *   onRowClick={(row) => openDetails(row)}
 *   loading={isLoading}
 * />
 *
 * @example
 * // Table with drag-and-drop reordering
 * <DataTable
 *   columns={columns}
 *   data={items}
 *   getRowKey={(row) => row.id}
 *   enableDrag={true}
 *   onReorder={(sourceIndex, targetIndex) => {
 *     // Handle reorder logic
 *   }}
 * />
 *
 * @param {DataTableProps<T>} props - The component props
 * @param {TableColumn<T>[]} props.columns - Column definitions with keys, labels, and optional render functions
 * @param {T[]} props.data - Array of data rows to display
 * @param {(row: T) => string | number} props.getRowKey - Function to extract unique key from each row
 * @param {string} [props.emptyMessage="No data available"] - Message shown when data array is empty
 * @param {string} [props.className] - Additional CSS classes for the table container
 * @param {boolean} [props.loading=false] - Whether the table is in loading state
 * @param {number} [props.loadingRows=3] - Number of skeleton rows to show during loading
 * @param {(row: T) => void} [props.onRowClick] - Callback fired when a row is clicked (makes rows clickable)
 * @param {string} [props.rowClassName=""] - Additional CSS classes for table rows
 * @param {boolean} [props.isError=false] - Whether to show error state
 * @param {() => void} [props.onRetry] - Callback for retry button in error state
 * @param {string} [props.errorMessage="Please try again."] - Error message to display
 * @param {boolean} [props.enableDrag=false] - Enable drag-and-drop reordering of rows
 * @param {(sourceIndex: number, targetIndex: number) => void} [props.onReorder] - Callback fired when rows are reordered
 * @returns {JSX.Element} A styled data table with all features
 */
const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No data available",
  className,
  loading = false,
  loadingRows = 3,
  onRowClick,
  rowClassName = "",
  isError = false,
  onRetry,
  errorMessage = "Please try again.",
  enableDrag = false,
  onReorder,
}: DataTableProps<T>) => {
  const dragIndexRef = useRef<number | null>(null);

  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  };

  const handleDragStart = (index: number) => {
    if (!enableDrag) return;
    dragIndexRef.current = index;
  };

  const handleDragOver = (event: DragEvent<HTMLTableRowElement>, index: number) => {
    if (!enableDrag) return;
    event.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (event: DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    if (!enableDrag) return;
    event.preventDefault();
    const sourceIndex = dragIndexRef.current;
    if (sourceIndex === null || sourceIndex === targetIndex) {
      dragIndexRef.current = null;
      setDragOverIndex(null);
      return;
    }
    onReorder?.(sourceIndex, targetIndex);
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 ${className ?? ""}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  scope="col"
                  className={`px-4 py-3 font-semibold uppercase tracking-wide ${cellAlignment(column.align)}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700 dark:divide-gray-800 dark:text-gray-200">
            {isError && (
              <tr>
                <td className="px-4 py-8" colSpan={columns.length}>
                  <ErrorState
                    title="We couldn't load this table"
                    description={errorMessage}
                    onRetry={onRetry}
                    actionLabel="Retry"
                    className="py-2"
                  />
                </td>
              </tr>
            )}
            {!isError && loading && (
              <tr>
                <td className="px-4 py-6" colSpan={columns.length}>
                  <SkeletonLoader lines={loadingRows} />
                </td>
              </tr>
            )}
            {!isError && !loading && data.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!isError &&
              !loading &&
              data.map((row, index) => {
                const clickable = Boolean(onRowClick);
                return (
                  <tr
                    key={getRowKey(row)}
                    {...(clickable && {
                      role: "button",
                      tabIndex: 0,
                      "aria-label": "View row details",
                    })}
                    className={`hover:bg-gray-50/70 dark:hover:bg-gray-800/60 ${
                      clickable ? "cursor-pointer transition" : ""
                    } ${dragOverIndex === index ? "translate-y-1 transition-transform" : ""} ${rowClassName}`}
                    onClick={clickable ? () => onRowClick?.(row) : undefined}
                    onKeyDown={clickable ? (event) => handleKeyDown(event, row) : undefined}
                    draggable={enableDrag}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(event) => handleDragOver(event, index)}
                    onDrop={(event) => handleDrop(event, index)}
                    onDragEnd={handleDragEnd}
                    onDragLeave={handleDragLeave}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${getRowKey(row)}-${String(column.key)}`}
                        className={`px-4 py-4 ${cellAlignment(column.align)}`}
                      >
                        {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
