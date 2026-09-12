import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import PersonelPage from "../pages/PersonelPage";
import GorevlerPage from "../pages/GorevlerPage";
import GorevDagitimPage from "../pages/GorevDagitimPage";

import BirimlerPage from "../pages/admin/BirimlerPage";
import GorevTurleriPage from "../pages/admin/GorevTurleriPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
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
          {/* ADMIN + BIRIM_YETKILISI */}
          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/personeller"
            element={<PersonelPage />}
          />

          <Route
            path="/gorevler"
            element={<GorevlerPage />}
          />

          <Route
            path="/gorev-dagitim"
            element={<GorevDagitimPage />}
          />

          {/* Sadece ADMIN */}
          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN"]} />
            }
          >
            <Route
              path="/birimler"
              element={<BirimlerPage />}
            />

            <Route
              path="/gorev-turleri"
              element={<GorevTurleriPage />}
            />

            <Route
              path="/kullanicilar"
              element={
                <PlaceholderPage
                  title="Kullanıcı Yönetimi"
                  description="Sistem kullanıcıları ve yetkilendirme işlemleri."
                />
              }
            />
          </Route>
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