import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Adjust path to your AuthContext

/**
 * A component for public routes like login/signup.
 * If a user is already logged in, it redirects them to their respective dashboard.
 */
const PublicRoute = () => {
    const { user, mlaToken, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    // If an MLA is logged in, redirect them away from public pages to their dashboard
    if (mlaToken) {
        return <Navigate to="/dashboard" replace />;
    }

    // If a citizen user is logged in, redirect them to their dashboard
    // Note: Assuming the user dashboard is at '/user-dashboard'. Change if needed.
    if (user) {
        return <Navigate to="/user-dashboard" replace />;
    }

    // If no one is logged in, show the public route (e.g., the login page)
    return <Outlet />;
};

export default PublicRoute;
