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
