import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import DashboardNavbar from "../components/DashboardNavbar.jsx";
import Header from "./Header.jsx";
const MlaDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto lg:ml-64">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MlaDashboardLayout;
