import React from "react";
import { useRef } from "react";
import { useState,useEffect } from "react";
import { ChevronDownIcon } from "./icons";

// FILE: src/components/UserProfileDropdown.js

const UserProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(user?.fullName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 cursor-pointer">
        <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {initials}
              </div>
              <div>
                <p className="font-bold text-gray-800">{user?.fullName}</p>
                <p className="text-sm text-gray-600">{user?.phone}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">Reset Password</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">Logout</a>
          </div>
        </div>
      )}
    </div>
  );
};


export default UserProfileDropdown;