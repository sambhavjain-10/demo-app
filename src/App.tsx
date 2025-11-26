import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "@/components";
import DashboardPage from "./pages/Dashboard/Dashboard";
import SessionsPage from "./pages/Sessions/Sessions";

const App = () => {
  return (
    <div className="h-screen bg-gray-100 p-5 dark:bg-gray-900 mx-auto flex max-w-[1440px] gap-6">
      <Sidebar />
      <main className="flex-1 rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
