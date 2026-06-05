import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
    FiGrid, FiFileText, FiMessageSquare, FiSend, FiCalendar, FiSettings, FiLogOut, 
    FiChevronDown, FiChevronUp, FiX 
} from 'react-icons/fi';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isSidebarFolded }) => {
    const { mlaLogout } = useAuth();
    const [openMenu, setOpenMenu] = useState('');

    const handleMenuClick = (menuName) => {
        setOpenMenu(openMenu === menuName ? '' : menuName);
    };
    
    const menuItems = [
        { name: 'Dashboard', icon: <FiGrid />, path: '/dashboard', subOptions: [] },
        { name: 'Meeting Requests', icon: <FiFileText />, subOptions: [ 
            { name: 'New Requests', path: '/dashboard/requests/new' }, 
            { name: 'History', path: '/dashboard/requests/history' } 
        ]},
        { name: 'Complaints', icon: <FiMessageSquare />, subOptions: [ 
            { name: 'New Complaints', path: '/dashboard/complaints/new' }, 
            { name: 'Resolved', path: '/dashboard/complaints/resolved' } 
        ]},
        { name: 'Invitations', icon: <FiSend />, subOptions: [ 
            { name: 'Upcoming', path: '/dashboard/invitations/upcoming' }, 
            { name: 'History', path: '/dashboard/invitations/history' } 
        ]},
        { name: 'Calendar', icon: <FiCalendar />, path: '/dashboard/calendar', subOptions: [] },
        { name: 'Settings', icon: <FiSettings />, path: '/dashboard/settings', subOptions: [] },
    ];

    const navLinkClasses = ({ isActive }) => 
        `flex items-center p-3 rounded-lg w-full transition-colors ${
            isActive 
            ? 'bg-orange-500 text-white font-semibold' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;

    const subNavLinkClasses = ({ isActive }) => 
        `block p-2 text-sm rounded-md w-full transition-colors ${
            isActive 
            ? 'font-bold text-white' 
            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`;

    const renderMenu = (isFolded) => (
        menuItems.map((item) => (
            <div key={item.name}>
                {item.subOptions.length > 0 ? (
                    <button onClick={() => handleMenuClick(item.name)} className="flex items-center justify-between w-full p-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white">
                        <div className="flex items-center">
                            <span className="text-xl">{item.icon}</span>
                            {!isFolded && <span className="ml-4 text-sm font-medium">{item.name}</span>}
                        </div>
                        {!isFolded && <span>{openMenu === item.name ? <FiChevronUp /> : <FiChevronDown />}</span>}
                    </button>
                ) : (
                    <NavLink to={item.path} className={navLinkClasses}>
                        <span className="text-xl">{item.icon}</span>
                        {!isFolded && <span className="ml-4 text-sm font-medium">{item.name}</span>}
                    </NavLink>
                )}
                {!isFolded && openMenu === item.name && item.subOptions.length > 0 && (
                    <div className="mt-1 ml-6 pl-3 border-l-2 border-gray-600">
                        {item.subOptions.map((sub) => (
                            <NavLink key={sub.name} to={sub.path} className={subNavLinkClasses}>
                                {sub.name}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        ))
    );

    return (
        <>
            <aside className={`hidden lg:flex flex-col bg-gray-800 text-white shadow-lg transition-all duration-300 ${isSidebarFolded ? 'w-20' : 'w-64'}`}>
                <div className="flex items-center justify-center h-16 border-b border-gray-700">
                    <Link to="/dashboard">
                      {isSidebarFolded 
                          ? <h1 className="text-2xl font-bold text-orange-500">MLA</h1>
                          : <h1 className="text-xl font-bold">MLA Portal</h1>
                      }
                    </Link>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">{renderMenu(isSidebarFolded)}</nav>
                <div className="px-2 py-4 border-t border-gray-700">
                    <button onClick={mlaLogout} className="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white w-full">
                        <span className="text-xl"><FiLogOut /></span>
                        {!isSidebarFolded && <span className="ml-4 text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            <div className={`fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
                <div className="flex items-center justify-between h-16 border-b border-gray-700 px-4">
                    <h1 className="text-xl font-bold">MLA Portal</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-white"><FiX size={24} /></button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">{renderMenu(false)}</nav>
                 <div className="px-2 py-4 border-t border-gray-700">
                    <button onClick={mlaLogout} className="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white w-full">
                        <span className="text-xl"><FiLogOut /></span>
                        <span className="ml-4 text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
