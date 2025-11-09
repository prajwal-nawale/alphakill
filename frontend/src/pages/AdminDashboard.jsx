import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../App";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/v1/admin/users", {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/v1/admin/deleteUser/${userId}`,
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
      setMessage(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <AdminNavbar logout={logout} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {message && <p className="text-green-400 mb-3">{message}</p>}
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-4" colSpan="3">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}