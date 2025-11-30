import type { UserType } from "@/types";

export type TeamMetric = {
  team: "Sales" | "Engineering" | "Executive";
  total_sessions: number;
  avg_score: number;
  avg_confidence: number;
  avg_clarity: number;
  avg_listening: number;
};

export type UserPerformanceMetric = UserType;

export type TeamMetricsResponse = TeamMetric[];
export type UserPerformanceResponse = UserPerformanceMetric[];

export type ScoreTrendDataPoint = {
  date: string;
  avg_score: number;
  count: number;
};

export type ScoreTrendsResponse = ScoreTrendDataPoint[];

export type UseScoreTrendsOptions = {
  days?: number;
};
