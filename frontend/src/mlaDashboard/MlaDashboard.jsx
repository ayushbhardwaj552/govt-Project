import { Outlet, Link, useNavigate } from 'react-router-dom'; // 1. Import Link and useNavigate
import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiFileText, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import MlaDashboardLayout from './MlaDashboardLayout.jsx';
import RespondModal from "../mlaModel/RespondModal.jsx";
import axios from 'axios';

// --- Helper function to format dates (e.g., "2 hours ago") ---
const formatDistanceToNow = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
};


// Main MlaDashboard component (wrapper)
const MlaDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);   
    };

    const handleFormSubmit = (requestId, responseData) => {
        console.log("Submitting for:", requestId, responseData);
        handleCloseModal();
    };

    return (
        <MlaDashboardLayout>
            <Outlet />
            {isModalOpen && selectedRequest && (
                <RespondModal
                    request={selectedRequest}
                    onClose={handleCloseModal}
                    onSubmit={handleFormSubmit}
                />
            )}
        </MlaDashboardLayout>
    );
};

export const DashboardHome = () => {
    const { mlaUser: authUser, mlaToken } = useAuth(); 
    const navigate = useNavigate(); // 2. Initialize navigate
    const [date, setDate] = useState(new Date());
    const [stats, setStats] = useState({
        newComplaints: '...',
        pendingMeetings: '...',
        upcomingInvitations: '...',
        resolvedThisMonth: '...'
    });
    // 3. Add state for recent activity
    const [recentActivity, setRecentActivity] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 60000);

        const fetchData = async () => {
            if (!mlaToken) return;
            
            // Use Promise.all to fetch both stats and activity concurrently
            try {
                const [statsResponse, activityResponse] = await Promise.all([
                    // Stats API call
                    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/mla/stats`, {
                        headers: { 'Authorization': `Bearer ${mlaToken}` }
                    }),
                    // Recent Activity API call (You will need to create this endpoint)
                    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/mla/recent-activity`, {
                        headers: { 'Authorization': `Bearer ${mlaToken}` }
                    })
                ]);

                if (statsResponse.data.success) {
                    setStats(statsResponse.data.stats);
                }
                if (activityResponse.data.success) {
                    setRecentActivity(activityResponse.data.activities);
                }

            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching dashboard data.');
                console.error("Dashboard fetch error:", err);
            }
        };

        fetchData();
        return () => clearInterval(timer);
    }, [mlaToken]);

    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // 4. Add navigation paths to the stat cards
    const statsCards = [
        { title: "New Complaints", value: stats.newComplaints, icon: <FiMessageSquare size={24} />, path: "/dashboard/complaints/new" },
        { title: "Pending Meetings", value: stats.pendingMeetings, icon: <FiFileText size={24} />, path: "/dashboard/requests/new" },
        { title: "Upcoming Invitations", value: stats.upcomingInvitations, icon: <FiCalendar size={24} />, path: "/dashboard/invitations/upcoming" },
        { title: "Resolved This Month", value: stats.resolvedThisMonth, icon: <FiUsers size={24} />, path: "/dashboard/complaints/resolved" },
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Welcome back, {authUser?.fullName || 'MLA'}!</h1>
                <p className="text-slate-500 mt-1">{formattedDate}</p>
            </div>

            {/* --- Stat Cards (Now Clickable) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    // 5. Wrap each card in a Link component
                    <Link to={stat.path} key={stat.title} className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:-translate-y-2" style={{ animation: `fadeInUp 0.5s ease forwards`, animationDelay: `${index * 0.1}s` }}>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100 text-orange-500">{stat.icon}</div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Quick Actions (Now Clickable) --- */}
                <div className="lg:col-span-1 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {/* 6. Use navigate for button actions */}
                        <button onClick={() => navigate('/dashboard/requests/new')} className="w-full text-left font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 p-4 rounded-lg transition-colors">
                            View New Meeting Requests
                        </button>
                        <button onClick={() => navigate('/dashboard/complaints/new')} className="w-full text-left font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 p-4 rounded-lg transition-colors">
                            Address New Complaints
                        </button>
                    </div>
                </div>

                {/* --- Recent Activity (Now Dynamic) --- */}
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
                    {/* 7. Render activity dynamically or show a message if empty */}
                    {recentActivity.length > 0 ? (
                        <ul className="divide-y divide-gray-200/50">
                            {recentActivity.map((activity) => (
                                <li key={activity._id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiClock className="text-slate-400 mr-3" />
                                        <p className="text-slate-600">{activity.message}</p>
                                    </div>
                                    <p className="text-sm text-slate-400">{formatDistanceToNow(activity.createdAt)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-4">No recent activity to show.</p>
                    )}
                </div>
            </div>

            <style>{`@keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); }}`}</style>
        </div>
    );
};

export default MlaDashboard;
