import { twMerge } from "tailwind-merge";
import type { SkeletonLoaderProps } from "./types";

const SkeletonLoader = ({
  lines = 1,
  wrapperClassName = "",
  loaderClassName = "",
}: SkeletonLoaderProps) => {
  const mergedWrapperClassName = twMerge("space-y-2", wrapperClassName);
  const mergedLoaderClassName = twMerge(
    "h-4 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700",
    loaderClassName
  );
  return (
    <div className={mergedWrapperClassName} role="status" aria-live="polite" aria-busy="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={`skeleton-line-${index}`} className={mergedLoaderClassName} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonLoader;
