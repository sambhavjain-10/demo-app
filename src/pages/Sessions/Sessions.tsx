import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Button, Search } from "@/components";
import { Settings } from "@/icons";
import { useSessions, useUsers, useBulkUpdateSessions } from "@/data-access";
import { useSyncFilters, useLocalStorage } from "@/hooks";
import { useAlerts } from "@/context/AlertsContext";
import SessionsTable from "./components/SessionsTable/SessionsTable";
import SessionsSettingsModal from "./components/SettingsModal/SettingsModal";
import SessionsFiltersPanel from "./components/FiltersPanel/FiltersPanel";
import BulkFeedbackOverlay from "./components/BulkFeedbackOverlay/BulkFeedbackOverlay";
import BulkFeedbackWarningModal from "./components/BulkFeedbackWarningModal/BulkFeedbackWarningModal";
import FailedSessionsModal from "./components/FailedSessionsModal/FailedSessionsModal";
import SessionDetailsModal from "./components/SessionDetailsModal/SessionDetailsModal";
import {
  BASE_COLUMNS,
  DEFAULT_FILTERS,
  TEAM_FILTER_OPTIONS,
  createColumnVisibility,
} from "./constants";
import type {
  SessionColumnVisibility,
  SessionFilters,
  SessionTableRow,
  SessionSort,
} from "./types";
import type { UserType } from "@/types/global";

const COLUMN_VISIBILITY_STORAGE_KEY = "sessions-column-visibility";
const DEFAULT_PAGE_SIZE = 50;
const MAX_BULK_SELECTIONS = 100;

const SessionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // URL sync for pageSize and pageNumber
  const pageSizeFromUrl = searchParams.get("pageSize");
  const pageNumberFromUrl = searchParams.get("pageNumber");
  const [pageSize, setPageSize] = useState(() => {
    const parsed = pageSizeFromUrl ? Number.parseInt(pageSizeFromUrl, 10) : DEFAULT_PAGE_SIZE;
    return Number.isNaN(parsed) || parsed < 10 || parsed > 100 ? DEFAULT_PAGE_SIZE : parsed;
  });
  const [pageNumber] = useState(() => {
    const parsed = pageNumberFromUrl ? Number.parseInt(pageNumberFromUrl, 10) : 1;
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  });

  // URL sync for sorting
  const sortColumnFromUrl = searchParams.get("sortColumn") as SessionSort["column"];
  const sortDirectionFromUrl = searchParams.get("sortDirection") as SessionSort["direction"];
  const [sort, setSort] = useState<SessionSort>(() => ({
    column: sortColumnFromUrl || null,
    direction: sortDirectionFromUrl || null,
  }));

  // Sync pageSize with URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (pageSize === DEFAULT_PAGE_SIZE) {
      next.delete("pageSize");
    } else {
      next.set("pageSize", String(pageSize));
    }
    setSearchParams(next, { replace: true });
  }, [pageSize, searchParams, setSearchParams]);

  // Sync pageNumber with URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (pageNumber === 1) {
      next.delete("pageNumber");
    } else {
      next.set("pageNumber", String(pageNumber));
    }
    setSearchParams(next, { replace: true });
  }, [pageNumber, searchParams, setSearchParams]);

  // Sync sort with URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (!sort.column || !sort.direction) {
      next.delete("sortColumn");
      next.delete("sortDirection");
    } else {
      next.set("sortColumn", sort.column);
      next.set("sortDirection", sort.direction);
    }
    setSearchParams(next, { replace: true });
  }, [sort, searchParams, setSearchParams]);

  const { filters, setFilters: setSyncedFilters } = useSyncFilters<SessionFilters>({
    initialFilters: DEFAULT_FILTERS,
    paramKey: "sessionFilters",
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // LocalStorage for column visibility
  const [columnVisibility, setColumnVisibility] = useLocalStorage<SessionColumnVisibility>({
    key: COLUMN_VISIBILITY_STORAGE_KEY,
    initialValue: createColumnVisibility(),
  });

  // Drag and drop state
  const [sessionOrder, setSessionOrder] = useState<string[]>([]);

  // Bulk feedback state
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
  const [bulkFeedback, setBulkFeedback] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showFailedSessionsModal, setShowFailedSessionsModal] = useState(false);
  const [failedSessionIds, setFailedSessionIds] = useState<string[]>([]);

  // Session details modal state
  const [selectedSession, setSelectedSession] = useState<SessionTableRow | null>(null);

  const bulkUpdateMutation = useBulkUpdateSessions();
  const { showAlert } = useAlerts();

  const {
    sessions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isSessionsError,
    refetch: refetchSessions,
    isLoading,
    isFetching,
  } = useSessions({ pageSize, initialPage: pageNumber });

  const {
    users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useUsers();

  // WebSocket connection
  // const { socketState, lastMessage, isConnected } = useSocket({
  //   url: SOCKET_URL,
  //   onMessage: (event) => {
  //     console.log("WebSocket message received:", event.data);
  //     // Handle incoming messages here
  //   },
  //   onOpen: (event) => {
  //     console.log("WebSocket connection opened:", event);
  //   },
  //   onClose: (event) => {
  //     console.log("WebSocket connection closed:", event);
  //   },
  //   onError: (event) => {
  //     console.error("WebSocket error:", event);
  //   },
  //   reconnect: true,
  //   reconnectAttempts: 5,
  // });

  const usersById = useMemo(() => {
    const map: Record<string, { name?: UserType["first_name"]; team?: UserType["team"] }> = {};
    users.forEach((user) => {
      map[user.id] = { name: user.first_name, team: user.team };
    });
    return map;
  }, [users]);

  const sessionsWithUsers = useMemo<SessionTableRow[]>(
    () =>
      sessions.map((session) => {
        const user = usersById[session.user_id];
        return {
          ...session,
          userName: user?.name ?? `User ${session.user_id.slice(0, 4)}`,
          userTeam: user?.team ?? "Unassigned",
        };
      }),
    [sessions, usersById]
  );

  const filteredSessions = useMemo(
    () => filterSessions(sessionsWithUsers, searchTerm, filters),
    [sessionsWithUsers, searchTerm, filters]
  );

  const sortedSessions = useMemo(() => {
    if (!sort.column || !sort.direction) {
      return filteredSessions;
    }

    const sorted = [...filteredSessions].sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sort.column) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "user":
          aValue = a.userName ?? "";
          bValue = b.userName ?? "";
          break;
        case "score":
          aValue = a.score;
          bValue = b.score;
          break;
        case "createdAt":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numA = Number(aValue);
      const numB = Number(bValue);
      return sort.direction === "asc" ? numA - numB : numB - numA;
    });

    return sorted;
  }, [filteredSessions, sort]);

  const orderedSessions = useMemo(() => {
    if (sessionOrder.length === 0) {
      return sortedSessions;
    }

    const orderMap = new Map(sessionOrder.map((id, index) => [id, index]));
    const ordered = [...sortedSessions].sort((a, b) => {
      const aIndex = orderMap.get(a.id) ?? Infinity;
      const bIndex = orderMap.get(b.id) ?? Infinity;
      return aIndex - bIndex;
    });

    return ordered;
  }, [sortedSessions, sessionOrder]);

  const visibleColumns = useMemo(
    () => BASE_COLUMNS.filter((column) => columnVisibility[column.key]),
    [columnVisibility]
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);
  const isInitialLoading = (isLoading || isUsersLoading) && (!sessions.length || !users.length);

  const handleSettingsApply = (config: {
    pageSize: number;
    columnVisibility: SessionColumnVisibility;
  }) => {
    setPageSize(config.pageSize);
    setColumnVisibility(config.columnVisibility);
  };

  const handleSortChange = (newSort: SessionSort) => {
    setSort(newSort);
  };

  const handleReorder = (sourceIndex: number, targetIndex: number) => {
    const reordered = [...orderedSessions];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setSessionOrder(reordered.map((s) => s.id));
  };

  // Selection handlers
  const handleSelectionChange = (sessionId: string, selected: boolean) => {
    setSelectedSessionIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        if (next.size >= MAX_BULK_SELECTIONS) {
          return next; // Don't allow more than max
        }
        next.add(sessionId);
      } else {
        next.delete(sessionId);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(orderedSessions.slice(0, MAX_BULK_SELECTIONS).map((s) => s.id));
      setSelectedSessionIds(allIds);
    } else {
      setSelectedSessionIds(new Set());
    }
  };

  const isAllSelected = useMemo(() => {
    if (orderedSessions.length === 0) return false;
    const visibleIds = new Set(orderedSessions.slice(0, MAX_BULK_SELECTIONS).map((s) => s.id));
    return visibleIds.size > 0 && Array.from(visibleIds).every((id) => selectedSessionIds.has(id));
  }, [orderedSessions, selectedSessionIds]);

  const isIndeterminate = useMemo(() => {
    if (orderedSessions.length === 0) return false;
    const visibleIds = new Set(orderedSessions.slice(0, MAX_BULK_SELECTIONS).map((s) => s.id));
    const selectedCount = Array.from(visibleIds).filter((id) => selectedSessionIds.has(id)).length;
    return selectedCount > 0 && selectedCount < visibleIds.size;
  }, [orderedSessions, selectedSessionIds]);

  // Bulk feedback handlers
  const handleBulkFeedbackSubmit = () => {
    setShowWarningModal(true);
  };

  const handleConfirmBulkFeedback = async () => {
    setShowWarningModal(false);
    if (selectedSessionIds.size === 0 || !bulkFeedback.trim()) {
      return;
    }

    try {
      const response = await bulkUpdateMutation.mutateAsync({
        session_ids: Array.from(selectedSessionIds),
        feedback: bulkFeedback.trim(),
      });

      // Clear selection and feedback
      setSelectedSessionIds(new Set());
      setBulkFeedback("");

      // Show appropriate alert based on response
      if (response.failed.length === 0) {
        // All sessions updated successfully
        showAlert(
          "success",
          `Successfully updated feedback for ${response.updated} ${response.updated === 1 ? "session" : "sessions"}.`
        );
      } else {
        // Some sessions failed
        setFailedSessionIds(response.failed);
        showAlert(
          "error",
          `Updated ${response.updated} ${response.updated === 1 ? "session" : "sessions"}, but ${response.failed.length} ${response.failed.length === 1 ? "session" : "sessions"} failed to update.`,
          {
            text: "View",
            onClick: () => setShowFailedSessionsModal(true),
          }
        );
      }
    } catch (error) {
      console.error("Failed to submit bulk feedback:", error);
      showAlert("error", "Failed to submit bulk feedback. Please try again.");
    }
  };

  const handleCancelBulkFeedback = () => {
    setSelectedSessionIds(new Set());
    setBulkFeedback("");
  };

  const handleSessionClick = (session: SessionTableRow) => {
    setSelectedSession(session);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sessions</h1>
            <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {isFetching ? "Updating…" : `${orderedSessions.length.toLocaleString()} results`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search sessions"
            className="w-full sm:w-64"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              theme="secondary"
              className={twMerge(
                isFiltersOpen || activeFilterCount > 0
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100"
              )}
              onClick={() => setIsFiltersOpen((prev) => !prev)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <Button type="button" theme="secondary" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <SessionsTable
          sessions={orderedSessions}
          columns={visibleColumns}
          isLoading={isInitialLoading}
          isError={isSessionsError || isUsersError}
          onRetry={() => {
            refetchSessions();
            refetchUsers();
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          sort={sort}
          onSortChange={handleSortChange}
          enableDrag={true}
          onReorder={handleReorder}
          selectedSessionIds={selectedSessionIds}
          onSelectionChange={handleSelectionChange}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
          isIndeterminate={isIndeterminate}
          onRowClick={handleSessionClick}
        />
        {isFiltersOpen && (
          <SessionsFiltersPanel
            isOpen={isFiltersOpen}
            filters={filters}
            onChange={setSyncedFilters}
            onClose={() => setIsFiltersOpen(false)}
            teamOptions={[...TEAM_FILTER_OPTIONS]}
          />
        )}
      </div>

      <SessionsSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pageSize={pageSize}
        columns={BASE_COLUMNS}
        columnVisibility={columnVisibility}
        onApply={handleSettingsApply}
      />

      <BulkFeedbackOverlay
        selectedCount={selectedSessionIds.size}
        feedback={bulkFeedback}
        onFeedbackChange={setBulkFeedback}
        onSubmit={handleBulkFeedbackSubmit}
        onCancel={handleCancelBulkFeedback}
        isSubmitting={bulkUpdateMutation.isPending}
        maxSelections={MAX_BULK_SELECTIONS}
      />

      <BulkFeedbackWarningModal
        isOpen={showWarningModal}
        selectedCount={selectedSessionIds.size}
        onConfirm={handleConfirmBulkFeedback}
        onCancel={() => setShowWarningModal(false)}
      />

      <FailedSessionsModal
        isOpen={showFailedSessionsModal}
        failedSessionIds={failedSessionIds}
        sessions={orderedSessions.map((s) => ({ id: s.id, title: s.title }))}
        onClose={() => setShowFailedSessionsModal(false)}
      />

      <SessionDetailsModal
        isOpen={Boolean(selectedSession)}
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </section>
  );
};

const filterSessions = (sessions: SessionTableRow[], search: string, filters: SessionFilters) => {
  const normalizedSearch = search.trim().toLowerCase();
  const [minScore, maxScore] = filters.scoreRange;
  const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
  const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

  if (startDate) startDate.setHours(0, 0, 0, 0);
  if (endDate) endDate.setHours(23, 59, 59, 999);

  return sessions.filter((session) => {
    // Search in title and userName
    if (normalizedSearch) {
      const matchesTitle = session.title.toLowerCase().includes(normalizedSearch);
      const matchesUserName = session.userName?.toLowerCase().includes(normalizedSearch) ?? false;
      if (!matchesTitle && !matchesUserName) {
        return false;
      }
    }

    if (session.score < minScore || session.score > maxScore) {
      return false;
    }

    const createdAt = new Date(session.created_at);
    if (startDate && createdAt < startDate) return false;
    if (endDate && createdAt > endDate) return false;

    if (filters.teams.length > 0) {
      const team = session.userTeam ?? "Unassigned";
      if (!filters.teams.includes(team)) {
        return false;
      }
    }

    return true;
  });
};

const countActiveFilters = (filters: SessionFilters) => {
  let count = 0;
  if (
    filters.scoreRange[0] !== DEFAULT_FILTERS.scoreRange[0] ||
    filters.scoreRange[1] !== DEFAULT_FILTERS.scoreRange[1]
  ) {
    count += 1;
  }
  if (filters.dateRange.start) count += 1;
  if (filters.dateRange.end) count += 1;
  const teamsMatchDefault =
    filters.teams.length === DEFAULT_FILTERS.teams.length &&
    DEFAULT_FILTERS.teams.every((team) => filters.teams.includes(team));
  if (!teamsMatchDefault) count += 1;
  return count;
};

export default SessionsPage;
