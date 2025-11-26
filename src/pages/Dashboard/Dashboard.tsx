import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TabNav } from "@/components";
import { useAnalytics } from "@/data-access";
import { TAB_OPTIONS } from "./constants";
import type { DepartmentKey } from "./types";
import TeamPerformance from "./components/TeamPerformance/TeamPerformance";
import TopPerformers from "./components/TopPerformers/TopPerformers";
import TeamMembers from "./components/TeamMembers/TeamMembers";
import UserInfoModal from "./components/UserInfoModal/UserInfoModal";

const TEAM_NAME_MAP: Record<DepartmentKey, "Sales" | "Executive" | "Engineering"> = {
  sales: "Sales",
  executive: "Executive",
  engineering: "Engineering",
};

const orderMembersByIds = <T extends { user_id: string }>(members: T[], orderedIds?: string[]) => {
  if (!orderedIds?.length) {
    return members;
  }

  const memberMap = new Map(members.map((member) => [member.user_id, member]));
  const orderedMembers = orderedIds
    .map((id) => memberMap.get(id))
    .filter((member): member is T => Boolean(member));
  const remainingMembers = members.filter((member) => !orderedIds.includes(member.user_id));

  return [...orderedMembers, ...remainingMembers];
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DepartmentKey>("sales");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { teamMetrics, userPerformance } = useAnalytics();
  const resolvedTeamMetrics = teamMetrics.data ?? [];
  const resolvedUserPerformance = userPerformance.data ?? [];
  const [teamMemberOrder, setTeamMemberOrder] = useState<Partial<Record<DepartmentKey, string[]>>>(
    {}
  );
  const userIdParam = searchParams.get("userId");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userIdParam);

  useEffect(() => {
    setSelectedUserId(userIdParam);
  }, [userIdParam]);

  const selectedUser = resolvedUserPerformance.find((user) => user.user_id === selectedUserId);
  const isUserPerformanceLoading = userPerformance.isLoading && !userPerformance.data;

  const activeTeamKey = TEAM_NAME_MAP[activeTab];
  const activeTeamMetric = resolvedTeamMetrics.find((metric) => metric.team === activeTeamKey) ?? {
    total_sessions: 0,
    avg_score: 0,
    avg_confidence: 0,
    avg_clarity: 0,
    avg_listening: 0,
  };

  const chartMetricDefinitions = [
    { key: "avg_score", label: "Avg Score" },
    { key: "avg_confidence", label: "Confidence" },
    { key: "avg_clarity", label: "Clarity" },
    { key: "avg_listening", label: "Listening" },
  ] as const;

  const activeTeamChartData = chartMetricDefinitions.map((metric) => ({
    name: metric.label,
    value: Number((activeTeamMetric[metric.key] ?? 0).toFixed(2)),
  }));

  const usersForTab = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const filteredMembers = resolvedUserPerformance.filter(
      (user) =>
        user.team === activeTeamKey && user.first_name.toLowerCase().includes(normalizedSearch)
    );
    return orderMembersByIds(filteredMembers, teamMemberOrder[activeTab]);
  }, [activeTeamKey, resolvedUserPerformance, searchTerm, teamMemberOrder, activeTab]);

  const topPerformers = useMemo(
    () =>
      [...resolvedUserPerformance]
        .filter((user) => user.team === activeTeamKey)
        .sort((a, b) => b.avg_score - a.avg_score)
        .slice(0, 3),
    [activeTeamKey, resolvedUserPerformance]
  );

  const tabsWithCounts = useMemo(
    () =>
      TAB_OPTIONS.map((tab) => ({
        ...tab,
        count: resolvedUserPerformance.filter((user) => user.team === TEAM_NAME_MAP[tab.id]).length,
      })),
    [resolvedUserPerformance]
  );

  const isUserInfoLoading = userPerformance.isLoading && Boolean(selectedUserId) && !selectedUser;
  const teamMetricsError = teamMetrics.isError;
  const userPerformanceError = userPerformance.isError;

  const handleReorderMembers = useCallback(
    (nextMembers: (typeof resolvedUserPerformance)[number][]) => {
      setTeamMemberOrder((prev) => ({
        ...prev,
        [activeTab]: nextMembers.map((member) => member.user_id),
      }));
    },
    [activeTab]
  );

  const handleUserClick = (user: (typeof resolvedUserPerformance)[number]) => {
    const next = new URLSearchParams(searchParams);
    next.set("userId", user.user_id);
    setSearchParams(next, { replace: true });
  };

  const handleCloseUserModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("userId");
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <TabNav
          tabs={tabsWithCounts}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as DepartmentKey)}
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamPerformance
          data={activeTeamChartData}
          totalSessions={activeTeamMetric.total_sessions}
          isRefreshing={teamMetrics.isFetching}
          isError={Boolean(teamMetricsError)}
          onRetry={teamMetrics.refetch}
          errorMessage="Please try loading team metrics again."
        />
        <TopPerformers
          performers={topPerformers}
          loading={isUserPerformanceLoading}
          onUserClick={handleUserClick}
          isError={Boolean(userPerformanceError)}
          onRetry={userPerformance.refetch}
        />
      </div>

      <TeamMembers
        members={usersForTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        loading={isUserPerformanceLoading}
        loadingRows={5}
        onUserClick={handleUserClick}
        isError={Boolean(userPerformanceError)}
        onRetry={userPerformance.refetch}
        onReorder={handleReorderMembers}
      />

      <UserInfoModal
        user={selectedUser}
        isOpen={Boolean(selectedUserId)}
        isLoading={isUserInfoLoading}
        onClose={handleCloseUserModal}
      />
    </section>
  );
};

export default DashboardPage;
