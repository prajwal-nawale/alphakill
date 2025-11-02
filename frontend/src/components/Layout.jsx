import { useAuth } from '../App';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div>
      {/* Topbar - Shows for logged in users only */}
      <div style={{ 
        backgroundColor: 'black', 
        color: 'white', 
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Prep Me Up
          </Link>
        </div>

        <div>
          {/* Navigation for logged in users using Link */}
          <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem' }}>
            Home
          </Link>
          <Link to="/skill" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem' }}>
            Interview
          </Link>
         
          <Link to="/reports" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem' }}>
          Reports
          </Link>
          
          <span style={{ marginRight: '2rem' }}>Welcome, {user?.name}!</span>
          <button 
            onClick={logout}
            style={{ 
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

      {/* Main Content Area */}
      <div style={{ padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
}