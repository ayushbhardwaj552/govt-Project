import React, { useState } from 'react';
import UserHeader from './UserHeader.jsx';
// UPDATED the import to use UserSidebar
import UserSidebar from './UserSidebar.jsx'; 

const UserDashboardLayout = ({ children }) => {
    // State for the mobile sidebar (overlay)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // State for the desktop sidebar (folded or expanded)
    const [isSidebarFolded, setIsSidebarFolded] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header Component - now always at the top */}
            <UserHeader
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarFolded={isSidebarFolded}
                setIsSidebarFolded={setIsSidebarFolded}
            />

            {/* Container for Sidebar and Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* UPDATED the component tag to UserSidebar */}
                <UserSidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSidebarFolded={isSidebarFolded}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;