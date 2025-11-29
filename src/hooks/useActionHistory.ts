import { useCallback, useEffect, useRef } from "react";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const defaultIsEqual = <T>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

type UseActionHistoryOptions<T> = {
  initialValue: T;
  historyLimit?: number;
  isEqual?: (a: T, b: T) => boolean;
  onHistoryApply?: (value: T) => void;
  enableKeyboardShortcuts?: boolean;
  debounceDelay?: number;
};

type UseActionHistoryReturn<T> = {
  pushToHistory: (value: T) => void;
  undo: () => T | null;
  redo: () => T | null;
};

const HISTORY_LIMIT_DEFAULT = 5;
const DEBOUNCE_DELAY_DEFAULT = 300;

/**
 * A hook for managing undo/redo history with keyboard shortcuts support.
 *
 * @template T - The type of values stored in history
 * @param {UseActionHistoryOptions<T>} options - Configuration options
 * @param {T} options.initialValue - The initial value to start the history with
 * @param {number} [options.historyLimit=5] - Maximum number of history entries to keep
 * @param {(a: T, b: T) => boolean} [options.isEqual] - Custom equality function for comparing values
 * @param {(value: T) => void} [options.onHistoryApply] - Callback fired when undo/redo is applied
 * @param {boolean} [options.enableKeyboardShortcuts=true] - Whether to enable Ctrl/Cmd+Z shortcuts
 * @param {number} [options.debounceDelay=300] - Delay in milliseconds before adding to history (prevents rapid-fire entries)
 * @returns {UseActionHistoryReturn<T>} History management functions and state
 *
 * @example
 * const { pushToHistory, undo, redo } = useActionHistory({
 *   initialValue: { count: 0 },
 *   historyLimit: 10,
 *   onHistoryApply: (value) => {
 *     setState(value);
 *   }
 * });
 */
const useActionHistory = <T>({
  initialValue,
  historyLimit = HISTORY_LIMIT_DEFAULT,
  isEqual = defaultIsEqual,
  onHistoryApply,
  enableKeyboardShortcuts = true,
  debounceDelay = DEBOUNCE_DELAY_DEFAULT,
}: UseActionHistoryOptions<T>): UseActionHistoryReturn<T> => {
  const historyRef = useRef<T[]>([clone(initialValue)]);
  const historyIndexRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingValueRef = useRef<T | null>(null);

  // Internal function that actually adds to history
  const addToHistory = useCallback(
    (value: T) => {
      const cloneValue = clone(value);
      let history = historyRef.current.slice(0, historyIndexRef.current + 1);

      // Skip if the value is equal to the last history entry
      if (history.length && isEqual(history[history.length - 1], cloneValue)) {
        return;
      }

      history.push(cloneValue);

      // Limit history size
      if (history.length > historyLimit) {
        history = history.slice(history.length - historyLimit);
      }

      historyRef.current = history;
      historyIndexRef.current = history.length - 1;
    },
    [historyLimit, isEqual]
  );

  // Debounced pushToHistory function
  const pushToHistory = useCallback(
    (value: T) => {
      // Store the latest value
      pendingValueRef.current = value;

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer to add to history after delay
      debounceTimerRef.current = setTimeout(() => {
        if (pendingValueRef.current !== null) {
          addToHistory(pendingValueRef.current);
          pendingValueRef.current = null;
        }
        debounceTimerRef.current = null;
      }, debounceDelay);
    },
    [debounceDelay, addToHistory]
  );

  const applySnapshot = useCallback(
    (index: number): T | null => {
      const history = historyRef.current;
      const snapshot = history[index];
      if (!snapshot) return null;

      historyIndexRef.current = index;
      const clonedSnapshot = clone(snapshot);
      onHistoryApply?.(clonedSnapshot);
      return clonedSnapshot;
    },
    [onHistoryApply]
  );

  const undo = useCallback((): T | null => {
    if (historyIndexRef.current <= 0) {
      return null;
    }
    return applySnapshot(historyIndexRef.current - 1);
  }, [applySnapshot]);

  const redo = useCallback((): T | null => {
    if (historyIndexRef.current >= historyRef.current.length - 1) {
      return null;
    }
    return applySnapshot(historyIndexRef.current + 1);
  }, [applySnapshot]);

  // Keyboard shortcuts (Ctrl/Cmd+Z for undo, Ctrl/Cmd+Shift+Z for redo)
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() !== "z") return;
      event.preventDefault();

      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardShortcuts, redo, undo]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    pushToHistory,
    undo,
    redo,
  };
};

export default useActionHistory;
