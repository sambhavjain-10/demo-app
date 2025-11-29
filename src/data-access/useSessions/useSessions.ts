import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type {
  SessionsApiResponse,
  SessionsPage,
  UseSessionsOptions,
  BulkUpdatePayload,
  BulkUpdateResponse,
  SessionDetails,
} from "./types";
import { useCallback } from "react";

type FetchParams = {
  pageParam?: number;
  pageSize: number;
};

const DEFAULT_PAGE_SIZE = 50;

const extractSessions = (
  payload: SessionsApiResponse | undefined,
  fallbackPageSize: number
): SessionsPage => {
  if (!payload) {
    return { sessions: [], nextPage: undefined };
  }

  const sessions = payload.sessions ?? [];
  const currentPage = payload.page ?? 1;
  const effectivePageSize = payload.pageSize ?? fallbackPageSize;
  const total = payload.total ?? sessions.length;
  const totalPages = effectivePageSize ? Math.ceil(total / effectivePageSize) : undefined;

  let nextPage: number | undefined;
  if (typeof totalPages === "number" && currentPage < totalPages) {
    nextPage = currentPage + 1;
  }
  if (nextPage === undefined && sessions.length === effectivePageSize) {
    nextPage = currentPage + 1;
  }

  return { sessions, nextPage };
};

const fetchSessions = async ({ pageParam = 1, pageSize }: FetchParams): Promise<SessionsPage> => {
  const response = await api.get<SessionsApiResponse>("/sessions", {
    params: {
      page: pageParam,
      pageSize,
    },
  });

  return extractSessions(response.data, pageSize);
};

export const SESSIONS_QUERY_KEY = "sessions";

export const useSessions = ({
  pageSize = DEFAULT_PAGE_SIZE,
  initialPage = 1,
}: UseSessionsOptions = {}) => {
  const queryResult = useInfiniteQuery({
    queryKey: [SESSIONS_QUERY_KEY, pageSize],
    queryFn: ({ pageParam = 1 }) => fetchSessions({ pageParam, pageSize }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const sessions = queryResult.data?.pages.flatMap((page) => page.sessions) ?? [];

  return { ...queryResult, sessions };
};

export const useBulkUpdateSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkUpdatePayload): Promise<BulkUpdateResponse> => {
      const response = await api.put<BulkUpdateResponse>("/sessions/bulk", payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate sessions query to refetch updated data
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
};

export const SESSION_DETAILS_QUERY_KEY = "session-details";

const fetchSessionDetails = async (sessionId: string): Promise<SessionDetails> => {
  const response = await api.get<SessionDetails>(`/sessions/${sessionId}`);
  return response.data;
};

export const useSessionDetails = (sessionId: string | null) => {
  return useQuery({
    queryKey: [SESSION_DETAILS_QUERY_KEY, sessionId],
    queryFn: async (): Promise<SessionDetails> => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }
      return fetchSessionDetails(sessionId);
    },
    enabled: Boolean(sessionId),
  });
};

export const usePrefetchSessionDetails = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (sessionId: string) => {
      queryClient.prefetchQuery({
        queryKey: [SESSION_DETAILS_QUERY_KEY, sessionId],
        queryFn: () => fetchSessionDetails(sessionId),
      });
    },
    [queryClient]
  );
};
