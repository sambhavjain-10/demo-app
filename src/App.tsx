import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar, Alerts, SkeletonLoader } from "@/components";
import { AlertsProvider } from "@/context/AlertsContext";

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import("./pages/Dashboard/Dashboard"));
const SessionsPage = lazy(() => import("./pages/Sessions/Sessions"));
const ScoreTrendsPage = lazy(() => import("./pages/ScoreTrends/ScoreTrends"));

const PageLoader = () => (
  <div className="flex h-full items-center justify-center p-8">
    <SkeletonLoader lines={6} wrapperClassName="w-full max-w-2xl" />
  </div>
);

const App = () => {
  return (
    <AlertsProvider>
      <div className="h-screen bg-gray-100 p-5 dark:bg-gray-900 mx-auto flex max-w-[1440px] gap-6">
        <Sidebar />
        <main className="flex-1 rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800 overflow-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/score-trends" element={<ScoreTrendsPage />} />
            </Routes>
          </Suspense>
        </main>
        <Alerts />
      </div>
    </AlertsProvider>
  );
};

export default App;
