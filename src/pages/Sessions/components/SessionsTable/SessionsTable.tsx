import { useEffect, useMemo, useRef, useState, useCallback, type DragEvent } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { twMerge } from "tailwind-merge";
import { SkeletonLoader, Button, Checkbox } from "@/components";
import ErrorState from "@/components/ErrorState/ErrorState";
import { ChevronUp, ChevronDown, SortUnsorted } from "@/icons";
import { usePrefetchSessionDetails } from "@/data-access";
import type { SessionsTableProps } from "./types";
import type { SessionTableRow, SessionColumn } from "../../types";

const ROW_HEIGHT = 88;

const SessionsTable = ({
  sessions,
  columns,
  isLoading,
  isError,
  onRetry,
  onRowClick,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  sort,
  onSortChange,
  enableDrag = false,
  onReorder,
  selectedSessionIds = new Set(),
  onSelectionChange,
  onSelectAll,
  isAllSelected = false,
  isIndeterminate = false,
}: SessionsTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const prefetchSessionDetails = usePrefetchSessionDetails();

  const rowCount = hasNextPage ? sessions.length + 1 : sessions.length;

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });
  const virtualItems = virtualizer.getVirtualItems();

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const lastElement = lastElementRef.current;
    if (!lastElement || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: parentRef.current,
        rootMargin: "100px", // Trigger 100px before the last element comes into view
        threshold: 0.1,
      }
    );

    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const gridTemplate = useMemo(
    () => `60px ${columns.map((column) => `minmax(${column.minWidth ?? 120}px, 1fr)`).join(" ")}`,
    [columns]
  );

  const handleSortClick = useCallback(
    (columnKey: SessionColumn["key"]) => {
      if (!onSortChange) return;

      const isSortable = [
        "title",
        "user",
        "score",
        "confidence",
        "clarity",
        "listening",
        "createdAt",
        "duration",
      ].includes(columnKey);
      if (!isSortable) return;

      const currentColumn = sort?.column;
      const currentDirection = sort?.direction;

      if (currentColumn === columnKey) {
        if (currentDirection === "asc") {
          onSortChange({ column: columnKey, direction: "desc" });
        } else if (currentDirection === "desc") {
          onSortChange({ column: null, direction: null });
        } else {
          onSortChange({ column: columnKey, direction: "asc" });
        }
      } else {
        onSortChange({ column: columnKey, direction: "asc" });
      }
    },
    [sort, onSortChange]
  );

  const getSortIcon = useCallback(
    (columnKey: SessionColumn["key"]) => {
      if (!sort || sort.column !== columnKey) {
        return <SortUnsorted className="ml-1 h-3 w-3 text-gray-400" />;
      }

      if (sort.direction === "asc") {
        return <ChevronUp className="ml-1 h-3 w-3 text-blue-600" />;
      }

      return <ChevronDown className="ml-1 h-3 w-3 text-blue-600" />;
    },
    [sort]
  );

  const headerColumns = useMemo(
    () => [
      <div
        key="select-all"
        className="flex items-center justify-center px-2 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        {onSelectAll && (
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={(e) => onSelectAll(e.target.checked)}
            aria-label="Select all sessions"
          />
        )}
      </div>,
      ...columns.map((column) => {
        const isSortable = ["title", "user", "score", "createdAt"].includes(column.key);
        const isActive = sort?.column === column.key;

        return (
          <div
            key={column.key}
            className={twMerge(
              "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300",
              isSortable
                ? "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-100"
                : undefined,
              isActive ? "text-blue-600 dark:text-blue-400" : undefined
            )}
            onClick={() => isSortable && handleSortClick(column.key)}
            role={isSortable ? "button" : undefined}
            tabIndex={isSortable ? 0 : undefined}
            onKeyDown={(event) => {
              if (isSortable && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                handleSortClick(column.key);
              }
            }}
          >
            <div className="flex items-center">
              {column.label}
              {isSortable && getSortIcon(column.key)}
            </div>
          </div>
        );
      }),
    ],
    [columns, sort, handleSortClick, getSortIcon, onSelectAll, isAllSelected, isIndeterminate]
  );

  const handleDragStart = (index: number) => {
    if (!enableDrag) return;
    dragIndexRef.current = index;
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    if (!enableDrag) return;
    event.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
    if (!enableDrag || !onReorder) return;
    event.preventDefault();
    const sourceIndex = dragIndexRef.current;
    if (sourceIndex === null || sourceIndex === targetIndex) {
      dragIndexRef.current = null;
      setDragOverIndex(null);
      return;
    }
    onReorder(sourceIndex, targetIndex);
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

  if (isError) {
    return (
      <div className="w-full h-[calc(100vh-190px)] flex items-center justify-center rounded-3xl border border-gray-100 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
        <ErrorState
          title="We couldn't load sessions"
          description="Please check your filters or try again."
          actionLabel="Retry"
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (isLoading && sessions.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-190px)] flex rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <SkeletonLoader lines={10} wrapperClassName="w-full" />
      </div>
    );
  }

  if (!isLoading && sessions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">No sessions found</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Adjust your search or filters and try again.
        </p>
        <Button className="mt-4" onClick={onRetry}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-x-auto">
      <div
        ref={headerRef}
        className="sticky top-0 z-10 grid gap-0 border-b border-gray-100 bg-white px-2 py-2 dark:border-gray-800 dark:bg-gray-900 overflow-x-auto"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {headerColumns}
      </div>
      <div ref={parentRef} className="h-[calc(100vh-245px)] overflow-auto">
        <div
          className="relative"
          style={{
            height: virtualizer.getTotalSize(),
          }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > sessions.length - 1;
            const session = sessions[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className={twMerge(
                  "absolute left-0 right-0 border-b border-gray-100 dark:border-gray-800",
                  isLoaderRow ? undefined : "hover:bg-gray-50/70 dark:hover:bg-gray-800/60",
                  dragOverIndex === virtualRow.index ? "translate-y-1 transition-transform" : ""
                )}
                style={{
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <div className="px-4 py-6">
                    {hasNextPage ? <SkeletonLoader lines={1} /> : null}
                  </div>
                ) : (
                  <div
                    className="grid gap-0 px-2 py-4 cursor-pointer focus-within:ring-2 focus-within:ring-blue-400"
                    style={{ gridTemplateColumns: gridTemplate }}
                    role="button"
                    tabIndex={0}
                    onClick={() => onRowClick?.(session)}
                    onMouseEnter={() => prefetchSessionDetails(session.id)}
                    onKeyDown={(event) =>
                      event.key === "Enter" || (event.key === " " && onRowClick?.(session))
                    }
                    draggable={enableDrag}
                    onDragStart={() => handleDragStart(virtualRow.index)}
                    onDragOver={(event) => handleDragOver(event, virtualRow.index)}
                    onDrop={(event) => handleDrop(event, virtualRow.index)}
                    onDragEnd={handleDragEnd}
                    onDragLeave={handleDragLeave}
                  >
                    <div
                      className="flex items-center justify-center px-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onSelectionChange && (
                        <Checkbox
                          checked={selectedSessionIds.has(session.id)}
                          onChange={(e) => onSelectionChange(session.id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select session ${session.title}`}
                        />
                      )}
                    </div>
                    {columns.map((column) => (
                      <div
                        key={`${session.id}-${column.key}`}
                        className="px-4 text-sm text-gray-900 dark:text-gray-100"
                        style={{ minWidth: column.minWidth }}
                      >
                        {renderCell(column, session)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Element for Intersection Observer */}
        {hasNextPage && (
          <div
            ref={lastElementRef}
            className="flex h-20 items-center justify-center border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
            aria-label="Loading more sessions"
          >
            {isFetchingNextPage && <SkeletonLoader lines={1} />}
          </div>
        )}
      </div>
    </div>
  );
};

const renderCell = (column: SessionColumn, session: SessionTableRow) => {
  if (column.render) {
    return column.render(session);
  }
  const value = session[column.key as keyof SessionTableRow];
  if (value === null || value === undefined) {
    return "—";
  }
  return typeof value === "number" ? value.toLocaleString() : String(value);
};

export default SessionsTable;
