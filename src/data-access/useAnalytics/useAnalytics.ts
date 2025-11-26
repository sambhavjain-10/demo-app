import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { TeamMetricsResponse, UserPerformanceResponse } from "./types";

const fetchTeamMetrics = async (): Promise<TeamMetricsResponse> => {
  const { data } = await api.get<TeamMetricsResponse>("/analytics/team-metrics");
  return data;
};

const fetchUserPerformance = async (): Promise<UserPerformanceResponse> => {
  const { data } = await api.get<UserPerformanceResponse>("/analytics/user-performance");
  return data;
};

export const TEAM_METRICS_QUERY_KEY = ["analytics", "team-metrics"];
export const USER_PERFORMANCE_QUERY_KEY = ["analytics", "user-performance"];

export const useAnalytics = () => {
  const teamMetrics = useQuery({
    queryKey: TEAM_METRICS_QUERY_KEY,
    queryFn: fetchTeamMetrics,
  });

  const userPerformance = useQuery({
    queryKey: USER_PERFORMANCE_QUERY_KEY,
    queryFn: fetchUserPerformance,
  });

  return {
    teamMetrics,
    userPerformance,
  };
};
