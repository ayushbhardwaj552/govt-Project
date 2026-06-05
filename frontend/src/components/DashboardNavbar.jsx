import React from "react";
import UserProfileDropdown from "./UserProfileDropdown.jsx";
import { MenuIcon } from "./icons.jsx";

const DashboardNavbar = ({ onMenuClick, user }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center z-40 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="text-gray-500 mr-4 lg:hidden"><MenuIcon /></button>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src="/assets/UP_logo.png" alt="UP Gov Logo" className="h-10" />
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">Services for Citizen</h1>
          </div>
        </div>
        <UserProfileDropdown user={user} />
      </div>
    </header>
  );
};

export default DashboardNavbar;
