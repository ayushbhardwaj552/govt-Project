import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const MlaDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarFolded, setIsSidebarFolded] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarFolded={isSidebarFolded}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSidebarFolded={isSidebarFolded}
                    setIsSidebarFolded={setIsSidebarFolded}
                />
                <main className="
                bg-gradient-to-b from-gray-700 to-amber-50
                flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {/* The Outlet will render the specific page component */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MlaDashboardLayout;