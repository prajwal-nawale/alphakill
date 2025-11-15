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
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">

      {/* Topbar */}
      <header className="w-full bg-gray-900 py-4 shadow">
        <div className="flex justify-center">
         <div className="flex justify-center items-center gap-3 relative z-30">
              <img
                src="/logo.png"
                alt="Prep Me Up Logo"
                className="h-20 w-auto pointer-events-none select-none"
              />
              <h1 className="text-3xl font-semibold">Prep Me Up</h1>
            </div>
        </div>
      </header>

      {/* Auth Form */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96 border border-gray-700">

          <h2 className="text-2xl font-semibold mb-6 text-center text-white">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">

            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {message && (
            <p
              className={`text-center mt-4 font-medium ${
                message.includes("successful") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center mt-5 text-gray-300">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
              className="text-indigo-400 hover:underline"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}