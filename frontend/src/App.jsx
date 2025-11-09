import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Skill from "./pages/Skill";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import ReportsList from "./pages/ReportsList";
import LoginHome from "./components/LoginHome";
import AllHome from "./components/AllHome";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login sessions
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const adminToken = localStorage.getItem("adminToken");
    const adminId = localStorage.getItem("adminId");
    if (token && userId) setUser({ token, userId, name: userName });
    if (adminToken && adminId) setAdmin({ token: adminToken, id: adminId });
    setLoading(false);
  }, []);

  const login = (token, userId, userName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    setUser({ token, userId, name: userName });
  };

  const adminLogin = (token, adminId) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminId", adminId);
    setAdmin({ token, id: adminId });
  };

  const logout = () => { localStorage.clear(); setUser(null); setAdmin(null); };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, admin, login, adminLogin, logout }}>
      <Router>
        <Routes>
          {/* ---------- USER ROUTES ---------- */}
          {user ? (
            <Route path="/*" element={<Layout />}>
              <Route index element={<LoginHome />} />
              <Route path="skill" element={<Skill />} />
              <Route path="interview" element={<Interview />} />
              <Route path="report/:reportId" element={<Report />} />
              <Route path="reports" element={<ReportsList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            <>
              {/* ---------- ADMIN ROUTES ---------- */}
              <Route path="/admin/login" element={<AdminLogin />} />
              {admin && <Route path="/admin/dashboard" element={<AdminDashboard />} />}
              
              {/* ---------- GENERAL ---------- */}
              <Route path="/" element={<AllHome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;