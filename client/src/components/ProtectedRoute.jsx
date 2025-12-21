import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roles = [] }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role))
    return <Navigate to="/login" replace />;
  return <Outlet />;
}
