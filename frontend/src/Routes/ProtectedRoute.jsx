import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';// Adjust path to your AuthContext

/**
 * A component to protect routes based on user authentication and role.
 * @param {{ role: 'mla' | 'user' }} props - The role required to access the route.
 */
const ProtectedRoute = ({ role }) => {
    const { user, mlaToken, loading } = useAuth();

    // Show a loading indicator while auth state is being determined
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    // Check for MLA role
    if (role === 'mla') {
        // If not an authenticated MLA, redirect to the MLA login page
        if (!mlaToken) {
            return <Navigate to="/mla-login" replace />;
        }
    } 
    // Check for standard user role
    else if (role === 'user') {
        // If not an authenticated user, redirect to the citizen login page
        if (!user) {
            return <Navigate to="/login" replace />;
        }
    }

    // If the user is authenticated and has the correct role, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
