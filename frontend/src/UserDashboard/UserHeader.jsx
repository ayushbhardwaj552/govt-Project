import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiSettings, FiMoreVertical } from 'react-icons/fi';

const UserHeader = ({ isSidebarOpen, setIsSidebarOpen, isSidebarFolded, setIsSidebarFolded }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.split(' ');
        return names.length > 1 ? names[0][0] + names[1][0] : name.substring(0, 2);
    };

    const ProfileSetting = () => {
        // The FIX is here: Use the correct nested path
        navigate(`/user-dashboard/user-profile/${user._id}`);
        setIsProfileOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Add a guard to prevent rendering errors if user is null
    if (!user || !user._id) {
        return null;
    }

    return (
        <header className="flex justify-between items-center p-3 shadow-md bg-orange-500 text-white z-10">
            {/* Left side: Toggles and Title */}
            <div className="flex items-center">
                {/* Mobile Menu Toggle (Hamburger) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-white focus:outline-none lg:hidden mr-4"
                >
                    <FiMenu size={24} />
                </button>

                {/* Desktop Sidebar Fold Toggle (3 Dots) */}
                <button
                    onClick={() => setIsSidebarFolded(!isSidebarFolded)}
                    className="text-white focus:outline-none hidden lg:block mr-4"
                >
                    <FiMoreVertical size={24} />
                </button>

                <div className="text-xl font-bold">e-Services Portal</div>
            </div>

            {/* Right side: User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-white text-orange-500 rounded-full font-bold text-lg focus:outline-none"
                >
                    {getInitials(user?.fullName)}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
                        <div className="px-4 py-2 border-b">
                            <p className="font-bold">{user?.fullName || 'User Name'}</p>
                            <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                        </div>
                        <button
                            onClick={ProfileSetting}
                            className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            <FiSettings className="mr-3" /> Profile & Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            <FiLogOut className="mr-3" /> Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default UserHeader;