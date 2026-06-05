import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // 👈 Import axios

// --- SVG Icon Components --- (No changes here)// User Icon
const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4zM12 12a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);

// Lock Icon
const IconLock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.105 0-2 .895-2 2v4h4v-4c0-1.105-.895-2-2-2zM6 11V7a6 6 0 1112 0v4h-2V7a4 4 0 10-8 0v4H6z" />
  </svg>
);


const MlaLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const navigate = useNavigate();
  const { mlaLogin } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ CHANGED: Switched from fetch to axios.post
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/mla-login`, {
        email,
        password,
      });

      const data = response.data; // With axios, the response data is in the .data property

      if (data.success && data.token) {
        // The user object from the response (data.user) is the MLA's data
        mlaLogin(data.user, data.token);
        navigate('/dashboard');
      } else {
        // This else block might not be needed if axios throws an error for unsuccessful requests
        throw new Error(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      // ✅ CHANGED: Improved axios error handling
      // Axios puts server error messages in err.response.data.message
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... No changes to the JSX ...
    <div className="min-h-screen bg-gray-200 flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-amber-100 shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="logo-up-gov.png"
                  alt="UP Govt Logo"
                  className="h-10 w-auto object-contain rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-100"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Citizen Login</Link>
              <Link to="/mla-login" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">MLA Portal</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main
        className="flex-grow flex items-center justify-center p-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/agra1.jpg')" }}
      >
        <div
          className={`w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden transition-all duration-1000 ease-in-out 
            ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
        >
          {/* Left Side - Branding */}
          <div className="hidden md:flex w-1/2 bg-orange-500 p-12 text-white flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Admin & MLA Portal</h2>
            <p className="mb-2">Secure access for authorized personnel.</p>
            <p className="text-sm opacity-80">Please enter your credentials to access the administrative dashboard.</p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign In</h2>
            {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><IconUser /></span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Password</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><IconLock /></span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="font-medium text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MlaLogin;