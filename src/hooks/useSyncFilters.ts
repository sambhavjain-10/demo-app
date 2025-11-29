import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useActionHistory from "./useActionHistory";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const defaultIsEqual = <T>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

type UseSyncFiltersOptions<T> = {
  initialFilters: T;
  paramKey?: string;
  historyLimit?: number;
  isEqual?: (a: T, b: T) => boolean;
};

type UseSyncFiltersReturn<T> = {
  filters: T;
  setFilters: (updater: T | ((prev: T) => T)) => void;
};

const HISTORY_LIMIT_DEFAULT = 5;

const useSyncFilters = <T extends Record<string, unknown>>({
  initialFilters,
  paramKey = "filters",
  historyLimit = HISTORY_LIMIT_DEFAULT,
  isEqual = defaultIsEqual,
}: UseSyncFiltersOptions<T>): UseSyncFiltersReturn<T> => {
  const [searchParams, setSearchParams] = useSearchParams();
  const latestSerializedRef = useRef<string | null>(null);

  const parseFromParams = useCallback((): T => {
    const raw = searchParams.get(paramKey);
    if (!raw) {
      return clone(initialFilters);
    }
    try {
      const parsed = JSON.parse(raw);
      return { ...initialFilters, ...parsed };
    } catch {
      console.warn(`[useSyncFilters] Failed to parse filters from ${paramKey}.`);
      return clone(initialFilters);
    }
  }, [paramKey, searchParams, initialFilters]);

  const [filters, setFiltersState] = useState<T>(() => {
    const parsed = parseFromParams();
    return parsed;
  });

  // Initialize the serialized ref after first render
  useEffect(() => {
    if (latestSerializedRef.current === null) {
      latestSerializedRef.current = JSON.stringify(filters);
    }
  }, [filters]);

  const writeToUrl = useCallback(
    (nextFilters: T) => {
      const serialized = JSON.stringify(nextFilters);
      if (latestSerializedRef.current === serialized) return;
      latestSerializedRef.current = serialized;
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set(paramKey, serialized);
      setSearchParams(nextParams, { replace: true });
    },
    [paramKey, searchParams, setSearchParams]
  );

  const { pushToHistory } = useActionHistory<T>({
    initialValue: filters,
    historyLimit,
    isEqual,
    onHistoryApply: (snapshot) => {
      latestSerializedRef.current = JSON.stringify(snapshot);
      setFiltersState(snapshot);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set(paramKey, latestSerializedRef.current);
      setSearchParams(nextParams, { replace: true });
    },
  });

  const setSyncedFilters = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setFiltersState((prev) => {
        const next = (
          typeof updater === "function" ? (updater as (value: T) => T)(prev) : updater
        ) as T;
        if (isEqual(prev, next)) {
          return prev;
        }
        pushToHistory(next);
        writeToUrl(next);
        return next;
      });
    },
    [isEqual, pushToHistory, writeToUrl]
  );

  // Sync filters from URL params when they change externally
  useEffect(() => {
    const raw = searchParams.get(paramKey);
    if (!raw || raw === latestSerializedRef.current) {
      return;
    }
    try {
      const parsed = { ...initialFilters, ...JSON.parse(raw) };
      if (isEqual(parsed, filters)) {
        latestSerializedRef.current = raw;
        return;
      }
      // Sync state from URL - this is intentional for URL synchronization
      setFiltersState(parsed);
      latestSerializedRef.current = raw;
      pushToHistory(parsed);
    } catch {
      console.warn(`[useSyncFilters] Failed to parse filters from ${paramKey}.`);
    }
    // Only depend on searchParams, not filters state to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isEqual, paramKey, pushToHistory, initialFilters]);

  return {
    filters,
    setFilters: setSyncedFilters,
  };
};

export default useSyncFilters;
