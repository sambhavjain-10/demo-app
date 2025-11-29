export type SessionMetrics = {
  confidence: number;
  clarity: number;
  listening: number;
};

export type Session = {
  id: string;
  user_id: string;
  title: string;
  score: number;
  metrics: SessionMetrics;
  created_at: string;
  duration: number;
};

export type SessionsApiResponse = {
  page: number;
  pageSize: number;
  sessions: Session[];
  total: number;
};

export type SessionsPage = {
  sessions: Session[];
  nextPage?: number;
};

export type UseSessionsOptions = {
  pageSize?: number;
  initialPage?: number;
};

export type BulkUpdatePayload = {
  session_ids: string[];
  feedback: string;
};

export type BulkUpdateResponse = {
  updated: number;
  failed: string[];
};

export type TranscriptEntry = {
  text: string;
  secondsFromStart: number;
  speaker: "Agent" | "Customer";
};

export type SessionDetails = {
  id: string;
  user_id: string;
  feedback?: string;
  transcript: TranscriptEntry[];
};
