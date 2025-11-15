import { useAuth } from '../App';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Topbar */}
      <header className="w-full bg-gray-900 border-b border-gray-800 py-4 shadow-xl z-40">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Prep Me Up Logo"
              className="h-14 w-auto pointer-events-none select-none"
            />
            <span className="text-2xl font-semibold">Prep Me Up</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-gray-300 font-medium">

            <Link
              to="/"
              className="hover:text-white transition"
            >
              Home
            </Link>

            <Link
              to="/skill"
              className="hover:text-white transition"
            >
              Interview
            </Link>

            <Link
              to="/reports"
              className="hover:text-white transition"
            >
              Reports
            </Link>

            <span className="text-indigo-400 font-semibold">
              Welcome, {user?.name}!
            </span>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-semibold shadow-lg transition"
            >
              Logout
            </button>
          </nav>

        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}