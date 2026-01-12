import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

interface Props {
  children: JSX.Element;
  role?: "admin" | "patient"; // optional role restriction
}

export default function ProtectedRoute({ children, role }: Props) {
  if (!isAuthenticated()) {
    // belum login → redirect ke login
    return <Navigate to="/" replace />;
  }

  if (role && getRole() !== role) {
    // role tidak sesuai → redirect ke halaman default
    return <Navigate to={getRole() === "admin" ? "/dashboard" : "/book"} replace />;
  }

  return children;
}
