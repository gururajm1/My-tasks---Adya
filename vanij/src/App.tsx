import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import PrivateRoute from "./Routes/PrivateRoutes";  
import PublicRoute from "./Routes/PublicRoutes";  
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/SideBarPages/Tools";
import Analytics from "./pages/SideBarPages/Analytics";
import Support from "./pages/SideBarPages/Support";
import Ticket from "./pages/SideBarPages/Ticket";
import Settings from "./pages/SideBarPages/Settings";
import PrivacyPolicy from "./pages/PolicyPages/PrivacyPolicy";
import TermsOfService from "./pages/PolicyPages/TermsOfService";



const sidebarRoutes = [
  { path: 'tools', component: Tools },
  { path: 'analytics', component: Analytics },
  { path: 'settings', component: Settings },
  { path: 'support', component: Support },
  { path: 'ticket', component: Ticket }
];

const policypages = [
  { path: 'terms', component: TermsOfService },
  { path: 'privacypolicy', component: PrivacyPolicy }
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          {policypages.map(({ path, component: Component}) => (
            <Route key={path} path={`/${path}`} element={<Component />} />
          ))}
        </Route>

        {/* Private Route */}
        <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
          {sidebarRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={`/${path}`} element={<Component />} />
        ))}
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
