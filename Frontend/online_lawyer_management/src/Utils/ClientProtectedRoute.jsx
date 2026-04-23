
import { Navigate } from "react-router-dom";

function ClientProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
     alert("Please Register to book appointment");
    return <Navigate to="/register" replace />;
  }

  // ❌ Not a client
  if (role !== "client") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allow access
  return children;
}

export default ClientProtectedRoute;
