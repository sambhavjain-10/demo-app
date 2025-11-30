import { twMerge } from "tailwind-merge";
import type { SkeletonLoaderProps } from "./types";

/**
 * A skeleton loading component that displays animated placeholder lines.
 *
 * @component
 * @example
 * // Single skeleton line
 * <SkeletonLoader />
 *
 * @example
 * // Multiple skeleton lines
 * <SkeletonLoader lines={5} />
 *
 * @example
 * // Custom styling
 * <SkeletonLoader
 *   lines={3}
 *   wrapperClassName="space-y-4"
 *   loaderClassName="h-6 rounded-lg"
 * />
 *
 * @param {SkeletonLoaderProps} props - The component props
 * @param {number} [props.lines=1] - Number of skeleton lines to display
 * @param {string} [props.wrapperClassName=""] - Additional CSS classes for the wrapper container
 * @param {string} [props.loaderClassName=""] - Additional CSS classes for each skeleton line
 * @returns {JSX.Element} A skeleton loading component with animated placeholders
 */
const SkeletonLoader = ({
  lines = 1,
  wrapperClassName = "",
  loaderClassName = "",
}: SkeletonLoaderProps) => {
  const mergedWrapperClassName = twMerge("space-y-2", wrapperClassName);
  const mergedLoaderClassName = twMerge(
    "h-10 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700",
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
