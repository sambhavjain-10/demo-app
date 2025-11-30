import Button from "@/components/Button/Button";
import { Caution as CautionIcon } from "@/icons";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionLabel?: string;
  className?: string;
};

/**
 * A component for displaying error states with an optional retry action.
 *
 * @component
 * @example
 * // Basic error state
 * <ErrorState
 *   title="Something went wrong"
 *   description="Please try again later."
 * />
 *
 * @example
 * // Error state with retry button
 * <ErrorState
 *   title="Failed to load data"
 *   description="Unable to fetch the requested information."
 *   onRetry={handleRetry}
 *   actionLabel="Try Again"
 * />
 *
 * @param {ErrorStateProps} props - The component props
 * @param {string} [props.title="We couldn't load this data"] - The main error title
 * @param {string} [props.description="Please retry in a moment."] - Additional error description
 * @param {() => void} [props.onRetry] - Optional callback for retry action (shows retry button if provided)
 * @param {string} [props.actionLabel="Retry"] - Label text for the retry button
 * @param {string} [props.className=""] - Additional CSS classes for the container
 * @returns {JSX.Element} An error state display with icon, message, and optional retry button
 */
const ErrorState = ({
  title = "We couldn't load this data",
  description = "Please retry in a moment.",
  onRetry,
  actionLabel = "Retry",
  className = "",
}: ErrorStateProps) => (
  <div className={`flex flex-col items-center gap-3 text-center ${className}`}>
    <CautionIcon className="h-12 w-12 text-amber-500" />
    <div>
      <p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    {onRetry && (
      <Button onClick={onRetry} className="px-6 py-2 text-sm font-semibold">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default ErrorState;
