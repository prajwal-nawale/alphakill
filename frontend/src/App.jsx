import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Skill from "./pages/Skill";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import ReportsList from "./pages/ReportsList";
// Create Auth Context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (token && userId) {
      setUser({ token, userId, name: userName });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (token, userId, userName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    setUser({ token, userId, name: userName });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          {/* If user is logged in, show Layout with all pages */}
          {user ? (
            <>
            <Route path="/*" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="skill" element={<Skill />} />
              <Route path="interview" element={<Interview />} />
              <Route path="report/:id" element={<Report />} />
              <Route path="reports" element={<ReportsList />} />
              {/* Add Interview and Report routes later */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            </>
          ) : (
            <>
            {/* If user is NOT logged in, show Auth page */}
            <Route path="*" element={<Auth />} />
            </>
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

// Simple Home component for logged-in users
function Home() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Welcome to Prep Me Up, {user?.name}!</h1>
      <p>Get ready to ace your interviews with AI-powered practice.</p>
      <div>
        <h3>Quick Actions:</h3>
        <p>Click on "Interview" in the topbar to start preparing!</p>
      </div>
    </div>
  );
}

export default App;