import React, { createContext, useState, useContext, useEffect } from 'react';

// --- FILE 1: AuthContext.jsx ---
// In a real application, this would be in its own file (e.g., src/context/AuthContext.jsx)

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // --- Regular user state ---
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    // --- MLA state ---
    const [mlaUser, setMlaUser] = useState(null);
    const [mlaToken, setMlaToken] = useState(localStorage.getItem('mlaToken'));

    const [loading, setLoading] = useState(true);

    // Load user session on app start
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        const storedMlaToken = localStorage.getItem('mlaToken');
        const storedMlaUser = localStorage.getItem('mlaUser');
        if (storedMlaToken && storedMlaUser) {
            setMlaToken(storedMlaToken);
            setMlaUser(JSON.parse(storedMlaUser));
        }

        setLoading(false);
    }, []);

    // --- Regular user functions ---
    const login = (userData, authToken) => {
        const userToStore = userData.user || userData;
        setUser(userToStore);
        setToken(authToken);
        localStorage.setItem('authUser', JSON.stringify(userToStore));
        localStorage.setItem('authToken', authToken);
    };

    const signup = (userData, authToken) => {
        const userToStore = userData.user || userData;
        setUser(userToStore);
        setToken(authToken);
        localStorage.setItem('authUser', JSON.stringify(userToStore));
        localStorage.setItem('authToken', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
    };

    // --- MLA functions ---
    const mlaLogin = (mlaData, authToken) => {
        const userToStore = mlaData.user || mlaData;
        setMlaUser(userToStore);
        setMlaToken(authToken);
        localStorage.setItem('mlaUser', JSON.stringify(userToStore));
        localStorage.setItem('mlaToken', authToken);
    };

    const mlaSignup = (mlaData, authToken) => {
        const userToStore = mlaData.user || mlaData;
        setMlaUser(userToStore);
        setMlaToken(authToken);
        localStorage.setItem('mlaUser', JSON.stringify(userToStore));
        localStorage.setItem('mlaToken', authToken);
    };

    const mlaLogout = () => {
        setMlaUser(null);
        setMlaToken(null);
        localStorage.removeItem('mlaUser');
        localStorage.removeItem('mlaToken');
        // Redirect after MLA logout
        window.location.href = '/mla-login';
    };

    // --- Context value ---
    const value = {
        user, token, isAuthenticated: !!token, login, signup, logout,
        mlaUser, mlaToken, isMlaAuthenticated: !!mlaToken, mlaLogin, mlaSignup, mlaLogout,
        isLoading: loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
