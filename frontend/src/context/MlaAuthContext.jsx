import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // State to hold MLA user data and token
  const [mlaUser, setMlaUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('mla_token'));
  const [loading, setLoading] = useState(true); // For initial session check

  // Check localStorage when app loads
  useEffect(() => {
    const storedToken = localStorage.getItem('mla_token');
    const storedUser = localStorage.getItem('mla_user');

    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setMlaUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sync MLA token if localStorage changes (multi-tab support)
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem('mla_token'));
      const user = localStorage.getItem('mla_user');
      setMlaUser(user ? JSON.parse(user) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // MLA Login
  const login = (userData, token) => {
    setMlaUser(userData);
    setAuthToken(token);
    localStorage.setItem('mla_user', JSON.stringify(userData));
    localStorage.setItem('mla_token', token);
  };

  // MLA Logout
  const logout = () => {
    setMlaUser(null);
    setAuthToken(null);
    localStorage.removeItem('mla_user');
    localStorage.removeItem('mla_token');
  };

  const value = {
    mlaUser,
    authToken,
    isAuthenticated: !!authToken,
    isLoading: loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
