import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import DashboardLayout from "../layouts/DashboardLayout";
import PublicRoute from "../components/PublicRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import Applications from "../pages/Applications";
import Donors from "../pages/Donors";
import Beneficiaries from "../pages/Beneficiaries";
import MonthlyGrocery from "../pages/MonthlyGrocery";

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
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications/>} />
        <Route path="/donors" element={<Donors/>} />
        <Route path="/beneficiaries" element={<Beneficiaries/>} />
        <Route path="/monthly-grocery" element={<MonthlyGrocery/>} />

      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes> 
  );
}