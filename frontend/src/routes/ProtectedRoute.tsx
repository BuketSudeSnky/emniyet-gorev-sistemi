import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../utils/authStorage";

const ProtectedRoute = () => {
  const auth = getAuth();

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;