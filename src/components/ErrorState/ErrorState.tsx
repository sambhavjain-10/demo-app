import Button from "@/components/Button/Button";
import { Caution as CautionIcon } from "@/icons";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionLabel?: string;
  className?: string;
};

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
