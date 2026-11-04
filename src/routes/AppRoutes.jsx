import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import DashboardLayout from "../layouts/DashboardLayout";
import PublicRoute from "../components/PublicRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import Applications from "../pages/Applications";
import Donors from "../pages/Donors";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications/>} />
        <Route path="/donors" element={<Donors/>} />

      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes> 
  );
}