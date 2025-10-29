import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if user is already logged in when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (token && userId) {
      setUser({ token, userId, name: userName });
    }
    setLoading(false);
  }, []);

  // ✅ Login function
  const login = (token, userId, userName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    setUser({ token, userId, name: userName });
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUser(null);
  };

  // ✅ Show loading screen briefly
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          {/* If not logged in, show Auth page */}
          {!user && <Route path="/" element={<Auth />} />}

          {/* If logged in, show main layout */}
          {user && <Route path="/" element={<Layout />} />}

          {/* Default redirect based on login state */}
          <Route path="*" element={<Navigate to={"/"} replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;