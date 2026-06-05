import React from 'react';
import { Link } from 'react-router-dom';

// Success Icon Component
const SuccessIcon = () => (
    <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

const PasswordChangeSuccess = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <SuccessIcon />
                <h1 className="text-2xl font-bold text-gray-800 mt-4">Password Changed Successfully!</h1>
                <p className="text-gray-600 mt-2">
                    Your password has been updated. Please use your new password for future logins.
                </p>
                <div className="mt-6">
                    <Link
                        to="/dashboard/settings"
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Return to Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeSuccess;
