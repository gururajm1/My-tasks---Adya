import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const PublicRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const updateAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));

    window.addEventListener("storage", updateAuth);
    window.addEventListener("authChange", updateAuth);

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
