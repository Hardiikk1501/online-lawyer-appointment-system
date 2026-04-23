import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children}) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allow access
  return children;
}

export default ProtectedAdminRoute;