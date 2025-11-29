import { Button } from "@/components";
import { useAlerts } from "@/context/AlertsContext";
import { Close } from "@/icons";

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
          ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20"
          : "bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20";
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
              {isSuccess ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
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
              <button
                type="button"
                onClick={() => removeAlert(alert.id)}
                className={`rounded-full p-1 transition hover:bg-black/10 dark:hover:bg-white/10 ${textColor}`}
                aria-label="Close alert"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Alerts;
