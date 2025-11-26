export type UserType = {
  user_id: string;
  first_name: string;
  team: string;
  total_sessions: number;
  avg_score: number;
  avg_confidence: number;
  avg_clarity: number;
  avg_listening: number;
  best_session_score: number;
  recent_trend: "stable" | "improving" | "declining";
};
