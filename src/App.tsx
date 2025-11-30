import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar, Alerts, SkeletonLoader, ErrorBoundary } from "@/components";
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

// Wrapper components with ErrorBoundary for each page
const DashboardPageWithErrorBoundary = () => (
  <ErrorBoundary
    fallbackTitle="Failed to load Dashboard"
    fallbackDescription="An error occurred while loading the dashboard. Please try again."
  >
    <DashboardPage />
  </ErrorBoundary>
);

const SessionsPageWithErrorBoundary = () => (
  <ErrorBoundary
    fallbackTitle="Failed to load Sessions"
    fallbackDescription="An error occurred while loading sessions. Please try again."
  >
    <SessionsPage />
  </ErrorBoundary>
);

const ScoreTrendsPageWithErrorBoundary = () => (
  <ErrorBoundary
    fallbackTitle="Failed to load Score Trends"
    fallbackDescription="An error occurred while loading score trends. Please try again."
  >
    <ScoreTrendsPage />
  </ErrorBoundary>
);

const App = () => {
  return (
    <AlertsProvider>
      <div className="mx-auto flex h-screen max-w-[1440px] flex-col bg-gray-100 p-5 dark:bg-gray-900 md:flex-row md:gap-6">
        <Sidebar />
        <main className="flex-1 rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800 overflow-auto pb-20 md:pb-5">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPageWithErrorBoundary />} />
              <Route path="/sessions" element={<SessionsPageWithErrorBoundary />} />
              <Route path="/score-trends" element={<ScoreTrendsPageWithErrorBoundary />} />
            </Routes>
          </Suspense>
        </main>
        <Alerts />
      </div>
    </AlertsProvider>
  );
};

export default App;
