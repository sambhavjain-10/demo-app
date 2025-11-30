import { Button } from "@/components";
import { useAlerts } from "@/context/AlertsContext";
import { Close, CheckCircle, XCircle } from "@/icons";

/**
 * A global alerts/toast notification component that displays alerts from the AlertsContext.
 *
 * @component
 * @description
 * This component automatically displays alerts managed by the AlertsContext.
 * It supports success and error alert types with optional call-to-action buttons.
 * Alerts are displayed at the bottom of the screen with enter/exit animations.
 *
 * @example
 * // This component is typically rendered once at the app root level
 * // Alerts are triggered using the useAlerts hook:
 *
 * const { showAlert } = useAlerts();
 *
 * // Show success alert
 * showAlert("success", "Operation completed successfully!");
 *
 * // Show error alert with action
 * showAlert("error", "Failed to save changes.", {
 *   text: "Retry",
 *   onClick: () => handleRetry()
 * });
 *
 * @returns {JSX.Element | null} The alerts container or null if no alerts exist
 */
const Alerts = () => {
  const { alerts, exitingIds, removeAlert } = useAlerts();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-3 p-4 pointer-events-none">
      {alerts.map((alert) => {
        const isSuccess = alert.type === "success";
        const isExiting = exitingIds.has(alert.id);
        const bgColor = isSuccess
          ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/50 dark:border-emerald-500"
          : "bg-rose-50 border-rose-200 dark:bg-rose-500/50 dark:border-rose-500";
        const textColor = isSuccess
          ? "text-emerald-700 dark:text-emerald-300"
          : "text-rose-700 dark:text-rose-300";
        const iconColor = isSuccess
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400";

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg max-w-md w-full opacity-100 ${bgColor} ${
              isExiting ? "alert-exit" : "alert-enter"
            }`}
          >
            <div className={`shrink-0 ${iconColor}`}>
              {isSuccess ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <div className={`flex-1 text-sm font-medium ${textColor}`}>{alert.message}</div>
            <div className="flex items-center gap-2">
              {alert.cta && (
                <Button
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isSuccess
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      : "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
                  }`}
                  onClick={() => {
                    alert.cta?.onClick();
                    removeAlert(alert.id);
                  }}
                >
                  {alert.cta.text}
                </Button>
              )}
              <Button
                type="button"
                theme="icon"
                onClick={() => removeAlert(alert.id)}
                className={`h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10 ${iconColor} hover:text-white-700 dark:hover:text-black-700`}
                aria-label="Close alert"
              >
                <Close className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Alerts;
