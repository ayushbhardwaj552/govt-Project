import React from "react";
import { HomeIcon, LogOutIcon, FileTextIcon, MailIcon, CalendarIcon } from "./icons.jsx";
import SidebarItem from "./SidebarItem.jsx";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, setPage }) => {
  return (
    <aside className={`bg-white w-64 min-h-screen flex-shrink-0 shadow-lg lg:shadow-none lg:translate-x-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static absolute z-30`}>
        <div className="p-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-8">Dashboard</h2>
            <nav>
                <ul>
                    <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); setPage('dashboard'); }} className="flex items-center p-3 text-gray-700 rounded-lg bg-orange-100  font-semibold"><HomeIcon /> <span className="ml-3 text-sm md:text-base">Dashboard</span></a></li>
                    <SidebarItem icon={<FileTextIcon />} title="Meeting Requests">
                        <ul className="space-y-2">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('create-meeting'); }} className="block text-sm text-gray-500 hover:text-gray-800">Create New</a></li>
                            <li><a href="#" className="block text-sm text-gray-500 hover:text-gray-800">View All</a></li>
                        </ul>
                    </SidebarItem>
                </ul>
            </nav>
        </div>
    </aside>
  );
};

export default Sidebar;

