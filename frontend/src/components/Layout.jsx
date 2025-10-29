import { useAuth } from '../App';
import { Routes, Route, useNavigate } from 'react-router-dom';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      {/* Topbar - Only shows when logged in */}
      <div style={{ 
        backgroundColor: 'black', 
        color: 'white', 
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Prep Me Up
        </div>

        <div>
          <span>Welcome, {user?.name}!</span>
          <button 
            onClick={handleLogout}
            style={{ 
              marginLeft: '2rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add other routes here later */}
        </Routes>
      </div>
    </div>
  );
}

// Simple Home Page Component
function HomePage() {
  return (
    <div>
      <h1>Welcome to Home Page!</h1>
      <p>You are successfully logged in.</p>
      <p>This is where your interview preparation content will go.</p>
    </div>
  );
}