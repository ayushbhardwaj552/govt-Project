import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar.jsx';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPassword.jsx';
import { useAuth } from "../context/AuthContext.jsx"
import axios from 'axios';

const Login = () => {
  const navigat = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isMounted, setIsMounted] = useState(false); // 👈 Added for animation

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setApiError('');

    if (!email || !password) {
      setApiError("Both email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigat('/user-dashboard');
      }
    }
    catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[url('/assets/agra1.jpg')] min-h-screen font-sans bg-cover bg-center">
        {/* Header */}
        <NavBar />

        {/* Main Content */}
        <main
          className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center"
          style={{ minHeight: 'calc(100vh - 150px)' }}
        >
          <div
            className={`w-full max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000 ease-in-out 
            ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
          >
            {/* Left Panel (Orange) */}
            <div className="w-full md:w-1/2 bg-orange-500 p-8 md:p-12 text-white relative md:rounded-r-[80px]">
            </div>

            {/* Right Panel (Login Form) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">साइन इन करें</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">ईमेल</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">अपना पासवर्ड डालें</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {apiError && <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>}

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                      क्या आप साइन इन रहना चाहते हैं?
                    </label>
                  </div>
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => navigat('/forgot-password')}
                      className="cursor-pointer font-medium text-orange-600 hover:text-orange-900"
                    >
                      क्या आप पासवर्ड भूल गए हैं? ✨
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105 disabled:bg-orange-300 cursor-pointer"
                  >
                    {loading ? 'Signing In...' : 'साइन इन करें'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-sm font-black text-gray-900 hover:bg-amber-400">
            Copyright © 2025-26 e-SERVICES FOR CITIZEN by MLA Agra, GoUP
          </p>
        </footer>
      </div>
    </>
  );
};

export default Login;
