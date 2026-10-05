import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api";

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        await api.get("/api/auth/me");
        setAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, []);

  if (checking) {
    return (
      <div className="auth-loading">
        Checking authentication...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;