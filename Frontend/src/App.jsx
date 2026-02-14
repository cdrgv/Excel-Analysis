import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./Components/Homepage/Homepage";
import SignIn from "./Components/Login/SignIn";
import SignUp from "./Components/Login/SignUp";
import Dashboard from "./Components/Dashboard/Dashboard";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import ExcelVisualizer from "./Components/ExcelVisualizer/ExcelVisualizer";
import HistoryPage from "./Components/upload/uploadhistory";
import ProtectedRoute from "./Components/Common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visualize"
          element={
            <ProtectedRoute>
              <ExcelVisualizer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
