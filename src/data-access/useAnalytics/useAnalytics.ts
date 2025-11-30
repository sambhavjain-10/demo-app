import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type {
  TeamMetricsResponse,
  UserPerformanceResponse,
  ScoreTrendsResponse,
  UseScoreTrendsOptions,
} from "./types";

export const TEAM_METRICS_QUERY_KEY = ["analytics", "team-metrics"];

export const useTeamMetrics = () => {
  return useQuery({
    queryKey: TEAM_METRICS_QUERY_KEY,
    queryFn: async (): Promise<TeamMetricsResponse> => {
      const { data } = await api.get<TeamMetricsResponse>("/analytics/team-metrics");
      return data;
    },
  });
};

export const USER_PERFORMANCE_QUERY_KEY = ["analytics", "user-performance"];

export const useUserPerformance = () => {
  return useQuery({
    queryKey: USER_PERFORMANCE_QUERY_KEY,
    queryFn: async (): Promise<UserPerformanceResponse> => {
      const { data } = await api.get<UserPerformanceResponse>("/analytics/user-performance");
      return data;
    },
  });
};

export const SCORE_TRENDS_QUERY_KEY = ["analytics", "score-trends"];

export const useScoreTrends = ({ days = 30 }: UseScoreTrendsOptions = {}) => {
  return useQuery({
    queryKey: [SCORE_TRENDS_QUERY_KEY, days],
    queryFn: async (): Promise<ScoreTrendsResponse> => {
      const { data } = await api.get<ScoreTrendsResponse>("/analytics/score-trends", {
        params: { days },
      });
      return data;
    },
  });
};
