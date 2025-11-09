import { useState } from "react";
import { useAuth } from "../App";
import axios from "axios";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useAuth();

  async function handleAuth(e) {
    e.preventDefault();
    try {
      if (isSignup) {
        const res = await axios.post("http://localhost:3000/v1/user/signup", {
          name,
          email,
          password,
        });
        setMessage(res.data.message);
      } else {
        const res = await axios.post("http://localhost:3000/v1/user/signin", {
          email,
          password,
        });
        login(res.data.token, res.data.userId, res.data.name || name);
        setMessage("Login successful!");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Topbar */}
      <div className="bg-gray-800 text-white flex justify-center items-center py-3 shadow-md">
        <img src="/logo1.png" alt="Prep Me Up Logo" className="h-12 w-auto" />
      </div>

      {/* Auth Form */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {isSignup ? "Create Account" : "Login to Your Account"}
          </h2>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignup && (
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {message && (
            <p
              className={`text-center mt-4 ${
                message.includes("successful") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
              className="text-blue-600 hover:underline"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}