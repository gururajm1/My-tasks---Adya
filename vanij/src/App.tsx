import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import Dashboard from "./pages/Dashboard";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={!isAuthenticated() ?<Login /> : <Navigate to="/dashboard" />} />
        {/* Private Route */}
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
