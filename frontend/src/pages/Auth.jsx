import { useState } from "react";
import { useAuth } from '../App';
import axios from "axios";

export default function Auth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  
  const { login } = useAuth();

  async function handleAuth(e) {
    e.preventDefault();

    try {
      if (isSignup) {
        // Sign up
        const response = await axios.post("http://localhost:3000/v1/user/signup", {
          name, email, password
        });
        setMessage(response.data.message);
      } else {
        // Sign in
        const response = await axios.post("http://localhost:3000/v1/user/signin", {
          email, password
        });
        
        // Save user info and redirect automatically
        login(response.data.token, response.data.userId, response.data.name || name);
        setMessage("Login successful!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      {/* Topbar - Only shows app name when not logged in */}
      <div style={{ 
        backgroundColor: 'black', 
        color: 'white', 
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold',display: 'flex', justifyContent:'center' }}>
          Prep Me Up
        </div>
        <div>
          {/* No logout button here */}
        </div>
      </div>

      {/* Auth Form */}
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
        <h2>{isSignup ? 'Create Account' : 'Login to Your Account'}</h2>
        
        <form onSubmit={handleAuth}>
          {isSignup && (
            <div>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ width: '100%', padding: '10px', margin: '10px 0' }}
              />
            </div>
          )}
          
          <input 
            type='email' 
            placeholder='Your Email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          
          <input 
            type='password' 
            placeholder='Your Password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          
          <button 
            type='submit' 
            style={{ 
              width: '100%', 
              padding: '12px', 
              margin: '10px 0',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        {message && (
          <p style={{ 
            color: message.includes('successful') ? 'green' : 'red',
            textAlign: 'center',
            margin: '10px 0'
          }}>
            {message}
          </p>
        )}
        
        <p style={{ textAlign: 'center' }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button 
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'blue', 
              cursor: 'pointer',
              marginLeft: '5px'
            }}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}