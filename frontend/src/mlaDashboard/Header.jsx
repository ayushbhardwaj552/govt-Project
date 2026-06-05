import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiSettings, FiMoreVertical } from 'react-icons/fi';

// --- Get initials from full name ---
const getInitials = (name) => {
  if (!name) return 'U';
  const names = name.trim().split(' ');
  const firstInitial = names[0][0] || '';
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
  return (firstInitial + lastInitial).toUpperCase();
};

const Header = ({ isSidebarOpen, setIsSidebarOpen, isSidebarFolded, setIsSidebarFolded }) => {
  const { mlaUser, mlaLogout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    mlaLogout();
    navigate('/mla-login');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate(`/dashboard/settings`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center p-3 shadow-md bg-orange-500 text-white z-20">
      <div className="flex items-center">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="text-white focus:outline-none lg:hidden mr-4"
        >
          <FiMenu size={24} />
        </button>
        <button
          onClick={() => setIsSidebarFolded((prev) => !prev)}
          className="text-white focus:outline-none hidden lg:block mr-4"
        >
          <FiMoreVertical size={24} />
        </button>
        <div className="text-xl font-bold">MLA Dashboard</div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="flex items-center justify-center w-10 h-10 bg-white text-orange-500 rounded-full font-bold text-lg"
        >
          {getInitials(mlaUser?.fullName)}
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
            <div className="px-4 py-2 border-b">
              <p className="font-bold truncate">{mlaUser?.fullName || 'MLA Sharma'}</p>
              <p className="text-sm text-gray-500 truncate">{mlaUser?.email || 'mla@example.com'}</p>
            </div>
            <button
              onClick={handleProfileClick}
              className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100"
            >
              <FiSettings className="mr-3" /> Settings
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

export default Header;
