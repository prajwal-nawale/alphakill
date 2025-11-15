import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../App";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/v1/admin/users", {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/v1/admin/deleteUser/${userId}`,
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
      setMessage(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error("Delete error", err);
      setMessage("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNavbar logout={logout} />
      
      {/* Main Content */}
      <div className="relative isolate px-6 lg:px-8 py-8">
        {/* Background Effects */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 pointer-events-none transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-red-500 to-indigo-500 opacity-20 sm:w-[72rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* Header Section */}
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Manage users and monitor platform activity
            </p>
            <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full mt-4">
              <span className="text-sm font-medium text-gray-300">
                {users.length} {users.length === 1 ? 'User' : 'Users'} Total
              </span>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`max-w-4xl mx-auto mb-6 p-4 rounded-xl text-center font-semibold ${
              message.includes("Error") 
                ? "bg-red-100 text-red-800 border border-red-300" 
                : "bg-green-100 text-green-800 border border-green-300"
            }`}>
              {message}
            </div>
          )}

          {/* Users Table */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <span className="ml-3 text-gray-300">Loading users...</span>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-200">
                          User
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-200">
                          Email
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-200">
                          Joined
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-750 transition-colors duration-200">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-sm text-gray-400">User ID: {user._id?.substring(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-white">{user.email}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-300 text-sm">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Users Found
                  </h3>
                  <p className="text-gray-400">
                    There are no users registered on the platform yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {users.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
                <div className="text-3xl font-bold text-white mb-2">{users.length}</div>
                <div className="text-gray-400 font-medium">Total Users</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {users.filter(u => u.lastLogin).length}
                </div>
                <div className="text-gray-400 font-medium">Active Users</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {new Date().getFullYear()}
                </div>
                <div className="text-gray-400 font-medium">Current Year</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Admin Dashboard</h2>
          <p className="text-gray-400 text-sm">
            Platform management and user administration
          </p>
          <div className="border-t border-gray-800 mt-6 pt-6">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Prep Me Up Admin. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}