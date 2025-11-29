import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type AlertType = "success" | "error";

export type AlertCTA = {
  text: string;
  onClick: () => void;
};

export type Alert = {
  id: string;
  type: AlertType;
  message: string;
  cta?: AlertCTA;
};

type AlertsContextType = {
  alerts: Alert[];
  exitingIds: Set<string>;
  showAlert: (type: AlertType, message: string, cta?: AlertCTA) => void;
  removeAlert: (id: string) => void;
};

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within AlertsProvider");
  }
  return context;
};

type AlertsProviderProps = {
  children: ReactNode;
};

export const AlertsProvider = ({ children }: AlertsProviderProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const removeAlert = useCallback((id: string) => {
    // Mark as exiting to trigger exit animation
    setExitingIds((prev) => new Set(prev).add(id));

    // Remove from alerts after animation completes (300ms)
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  const showAlert = useCallback(
    (type: AlertType, message: string, cta?: AlertCTA) => {
      const id = `alert-${Date.now()}-${Math.random()}`;
      const newAlert: Alert = { id, type, message, cta };

      setAlerts((prev) => [...prev, newAlert]);

      // Auto-remove after 5 seconds if no CTA, or 10 seconds if there's a CTA
      const timeout = cta ? 10000 : 5000;
      setTimeout(() => {
        removeAlert(id);
      }, timeout);
    },
    [removeAlert]
  );

  return (
    <AlertsContext.Provider value={{ alerts, exitingIds, showAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};
