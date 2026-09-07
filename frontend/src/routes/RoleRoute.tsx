import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../utils/authStorage";
import type { Role } from "../types/auth";

interface RoleRouteProps {
  allowedRoles: Role[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const auth = getAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(auth.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;