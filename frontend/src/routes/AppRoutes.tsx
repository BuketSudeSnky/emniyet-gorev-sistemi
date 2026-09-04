import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Giriş */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Giriş yapılması gereken alan */}
      <Route element={<ProtectedRoute />}>

        {/* Ortak uygulama tasarımı */}
        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<DashboardPage />}
          />

        </Route>

      </Route>

      {/* Bulunamayan adresler */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;