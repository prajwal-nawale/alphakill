import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/v1/admin/signin", {
        email,
        password,
      });
      if (res.data.success) {
        adminLogin(res.data.token, res.data.adminId);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-10 text-red-500 drop-shadow">
        Admin Portal
      </h1>

      {/* AUTH CARD */}
      <form
        onSubmit={handleLogin}
        className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-96 border border-gray-700"
      >
        {/* EMAIL */}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        {/* ERROR */}
        {error && <p className="text-red-400 mb-3 text-center">{error}</p>}

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Login
        </button>
      </form>

    </div>
  );
}