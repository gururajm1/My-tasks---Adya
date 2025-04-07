import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar"; // make sure path is correct

const PrivateRoute = () => {
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

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateRoute;
