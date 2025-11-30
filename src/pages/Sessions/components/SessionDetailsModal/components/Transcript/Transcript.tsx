import { useState, useMemo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, Button, SkeletonLoader, ErrorState } from "@/components";
import { ChevronUp, ChevronDown } from "@/icons";
import type { TranscriptEntry } from "@/data-access";
import type { TranscriptSearchResult } from "../../types";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

type TranscriptProps = {
  transcript: TranscriptEntry[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

const Transcript = ({ transcript, isLoading, isError, onRetry }: TranscriptProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Search functionality
  const searchResults = useMemo<TranscriptSearchResult[]>(() => {
    if (!searchTerm.trim()) return [];

    const normalizedSearch = searchTerm.toLowerCase();
    const results: TranscriptSearchResult[] = [];

    transcript.forEach((entry, index) => {
      const text = entry.text.toLowerCase();
      let matchIndex = text.indexOf(normalizedSearch);
      while (matchIndex !== -1) {
        results.push({ index, entry, matchIndex });
        matchIndex = text.indexOf(normalizedSearch, matchIndex + 1);
      }
    });

    return results;
  }, [transcript, searchTerm]);

  const currentMatch = searchResults[currentMatchIndex];
  const hasMatches = searchResults.length > 0;

  // Virtualization
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: transcript.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const entry = transcript[index];
      if (!entry) return 60;
      const textLength = entry.text.length;
      return Math.max(60, 50 + Math.ceil(textLength / 100) * 20);
    },
    overscan: 5,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  // Scroll to current match
  useEffect(() => {
    if (currentMatch && virtualizer) {
      virtualizer.scrollToIndex(currentMatch.index, {
        align: "center",
      });
    }
  }, [currentMatch, currentMatchIndex, virtualizer]);

  const handleNextMatch = () => {
    if (searchResults.length === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % searchResults.length);
  };

  const handlePrevMatch = () => {
    if (searchResults.length === 0) return;
    setCurrentMatchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  };

  // Reset focus when search becomes active
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setFocusedIndex(null);
    }
  }, [searchTerm]);

  // Keyboard navigation
  useEffect(() => {
    if (transcript.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

      event.preventDefault();

      const hasActiveSearch = searchTerm.trim().length > 0 && searchResults.length > 0;

      if (hasActiveSearch) {
        if (event.key === "ArrowDown") {
          setCurrentMatchIndex((prev) => (prev + 1) % searchResults.length);
        } else if (event.key === "ArrowUp") {
          setCurrentMatchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
        }
      } else {
        setFocusedIndex((prev) => {
          if (prev === null) {
            return event.key === "ArrowDown" ? 0 : transcript.length - 1;
          }
          if (event.key === "ArrowDown") {
            return prev < transcript.length - 1 ? prev + 1 : prev;
          } else {
            return prev > 0 ? prev - 1 : prev;
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [transcript.length, searchTerm, searchResults.length]);

  // Scroll to focused index when navigating without search
  useEffect(() => {
    if (focusedIndex !== null && !searchTerm.trim() && virtualizer) {
      virtualizer.scrollToIndex(focusedIndex, {
        align: "center",
      });
    }
  }, [focusedIndex, searchTerm, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  const highlightText = (text: string, search: string, currentMatchIndex?: number) => {
    if (!search.trim()) {
      return text;
    }

    const normalizedSearch = search.toLowerCase();
    const textLower = text.toLowerCase();
    const parts: Array<{ text: string; isMatch: boolean; isCurrent: boolean }> = [];
    let lastIndex = 0;
    let matchCount = 0;

    let matchIndex = textLower.indexOf(normalizedSearch, lastIndex);
    while (matchIndex !== -1) {
      if (matchIndex > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, matchIndex),
          isMatch: false,
          isCurrent: false,
        });
      }

      const isCurrent = currentMatchIndex !== undefined && currentMatchIndex === matchCount;
      parts.push({
        text: text.substring(matchIndex, matchIndex + search.length),
        isMatch: true,
        isCurrent,
      });

      lastIndex = matchIndex + search.length;
      matchCount++;
      matchIndex = textLower.indexOf(normalizedSearch, lastIndex);
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), isMatch: false, isCurrent: false });
    }

    if (parts.length === 0) {
      return text;
    }

    return (
      <>
        {parts.map((part, idx) => {
          if (!part.isMatch) {
            return <span key={idx}>{part.text}</span>;
          }
          return (
            <mark
              key={idx}
              className={`font-semibold ${
                part.isCurrent
                  ? "bg-yellow-400 dark:bg-yellow-500"
                  : "bg-yellow-300 dark:bg-yellow-500/50"
              }`}
            >
              {part.text}
            </mark>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-[500px]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Transcript
        </p>
        {hasMatches && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {currentMatchIndex + 1} of {searchResults.length} matches
            </span>
            <Button
              type="button"
              className="h-7 w-7 rounded-full p-0"
              onClick={handlePrevMatch}
              disabled={searchResults.length === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              className="h-7 w-7 rounded-full p-0"
              onClick={handleNextMatch}
              disabled={searchResults.length === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <Search
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search transcript..."
          className="w-full"
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <SkeletonLoader lines={5} />
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 min-h-0">
          <ErrorState
            title="We couldn't load the transcript"
            description="Please check your connection and try again."
            onRetry={onRetry}
            actionLabel="Retry"
          />
        </div>
      ) : transcript.length === 0 ? (
        <div className="flex-1 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 min-h-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">No transcript available</p>
        </div>
      ) : (
        <div
          ref={parentRef}
          className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 min-h-0 snap-y snap-proximity"
        >
          <div
            className="relative w-full"
            style={{
              height: virtualizer.getTotalSize(),
            }}
          >
            {virtualItems.map((virtualRow) => {
              const entry = transcript[virtualRow.index];
              const entryMatches = searchResults.filter((r) => r.index === virtualRow.index);
              const currentMatchInThisEntry =
                currentMatch?.index === virtualRow.index
                  ? entryMatches.find((m) => m.matchIndex === currentMatch.matchIndex)
                  : undefined;

              const isFocused = focusedIndex === virtualRow.index && !searchTerm.trim();
              const isHighlighted = currentMatchInThisEntry || isFocused;

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className={`absolute left-0 right-0 border-b border-gray-100 px-4 py-3 dark:border-gray-700 snap-start transition-colors ${
                    isHighlighted
                      ? "bg-yellow-50 dark:bg-yellow-500/10"
                      : isFocused
                        ? "bg-blue-50 dark:bg-blue-500/10"
                        : ""
                  }`}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {formatTime(entry.secondsFromStart)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1">
                        <span
                          className={`text-xs font-semibold capitalize ${
                            entry.speaker === "Agent"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {entry.speaker}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                        {highlightText(entry.text, searchTerm, currentMatchInThisEntry?.matchIndex)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transcript;
