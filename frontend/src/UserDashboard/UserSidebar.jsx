import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
    FiGrid, FiFileText, FiMessageSquare, FiSend, 
    FiCalendar, FiUser, FiLogOut, 
    FiChevronDown, FiChevronUp, FiX 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

// Updated SVG Logo with white text for dark background
const EServicesLogo = () => (
    <svg width="150" height="50" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="50" rx="10" fill="#4F46E5"/>
        <path d="M19.1625 32.5V18.15H31.1625V20.85H22.3125V24H30.2625V26.85H22.3125V29.7H31.3125V32.5H19.1625Z" fill="white"/>
        <text x="65" y="33" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="bold" fill="white">E-Services</text>
    </svg>
);

const UserSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [openMenu, setOpenMenu] = useState('Dashboard');
    const Navigate = useNavigate();

    const handleMenuClick = (menuName) => {
        setOpenMenu(openMenu === menuName ? '' : menuName);
    };

    const LogoutSubmit = () => {
        logout();
        Navigate('/');
    };

    if (!user || !user._id) {
        return (
            <aside className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 h-full flex items-center justify-center text-gray-300">
                Loading...
            </aside>
        );
    }

    const menuItems = [
        { name: 'Dashboard', icon: <FiGrid />, path: '/user-dashboard', subOptions: [] },
        {
            name: 'Meeting Requests',
            icon: <FiFileText />,
            subOptions: [
                { name: 'Create Request', path: '/user-dashboard/meeting-requests/create' },
                { name: 'View History', path: '/user-dashboard/meeting-requests/history' },
            ],
        },
        {
            name: 'Complaints',
            icon: <FiMessageSquare />,
            subOptions: [
                { name: 'File a Complaint', path: '/user-dashboard/complaints/create' },
                { name: 'View History', path: '/user-dashboard/complaints/history' },
            ],
        },
        {
            name: 'Invitations',
            icon: <FiSend />,
            subOptions: [
                { name: 'Send Invitation', path: '/user-dashboard/invitations/create' },
                { name: 'View History', path: '/user-dashboard/invitations/history' },
            ],
        },
        { name: "MLA's Calendar", icon: <FiCalendar />, path: '/user-dashboard/mla-calendar/68946e516968d9365cf6b2f3', subOptions: [] },
        // The FIX is here: use the correct nested path
        { name: 'My Profile', icon: <FiUser />, path: `/user-dashboard/user-profile/${user._id}`, subOptions: [] },
    ];

    const renderMenu = () => (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                {menuItems.map((item) => (
                    <div key={item.name} className="mb-1">
                        {item.subOptions.length > 0 ? (
                            <>
                                <button 
                                    onClick={() => handleMenuClick(item.name)} 
                                    className="flex items-center justify-between w-full p-3 text-base font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        <span className="text-xl text-gray-400">{item.icon}</span>
                                        <span className="ml-4">{item.name}</span>
                                    </div>
                                    <span>{openMenu === item.name ? <FiChevronUp /> : <FiChevronDown />}</span>
                                </button>
                                {openMenu === item.name && (
                                    <div className="mt-1 ml-6 pl-5 border-l-2 border-gray-600">
                                        {item.subOptions.map((sub) => (
                                            <NavLink
                                                key={sub.name}
                                                to={sub.path}
                                                className={({ isActive }) => 
                                                    `block py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
                                                        isActive 
                                                        ? 'font-semibold text-white bg-indigo-500/20' 
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                                    }`
                                                }
                                            >
                                                {sub.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                    `flex items-center p-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`text-xl ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="ml-4">{item.name}</span>
                                    </>
                                )}
                            </NavLink>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <button 
                    onClick={LogoutSubmit} 
                    className="flex items-center p-3 text-base font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white w-full transition-colors duration-200"
                >
                    <span className="text-xl text-gray-400"><FiLogOut /></span>
                    <span className="ml-4">Logout</span>
                </button>
            </div>
        </div>
    );
    
    return (
        <>
            <aside className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-gray-800 to-gray-900 h-full">
                <div className="flex items-center justify-start h-20 px-4">
                    <Link to="/" aria-label="Go to Homepage">
                        <EServicesLogo />
                    </Link>
                </div>
                <nav className="flex-1 p-4">{renderMenu()}</nav>
            </aside>
            <div 
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-20 px-4">
                     <Link to="/" aria-label="Go to Homepage">
                        <EServicesLogo />
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>
                <nav className="flex-1 p-4">{renderMenu()}</nav>
            </aside>
        </>
    );
};

export default UserSidebar;