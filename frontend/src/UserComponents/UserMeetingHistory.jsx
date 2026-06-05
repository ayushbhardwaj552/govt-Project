import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";

const UserMeetingHistory = () => {
    const [history, setHistory] = useState({ pending: [], approved: [], rejected: [] });
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const getMyMeetingRequestHistory = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/meeting-requests/history`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`Error ${res.status}`);
                }

                const data = await res.json();
                if (data.success) {
                    setHistory(data.requests);
                }
            } catch (error) {
                console.error('Failed to load meeting request history:', error);
            }
        };

        if (token) getMyMeetingRequestHistory();
    }, [token]);

    const filterRequests = (requests) => {
        if (!requests) return [];
        if (!searchQuery) return requests;

        const lowercasedQuery = searchQuery.toLowerCase();
        return requests.filter(
            (item) =>
                item.purpose?.toLowerCase().includes(lowercasedQuery) ||
                item.mlaId?.fullName?.toLowerCase().includes(lowercasedQuery) ||
                item.fullName?.toLowerCase().includes(lowercasedQuery)
        );
    };

    const filteredPending = filterRequests(history.pending);
    const filteredApproved = filterRequests(history.approved);
    const filteredRejected = filterRequests(history.rejected);

    const renderList = (requests) => (
        !requests || requests.length === 0
            ? <p className="p-4 text-gray-500">No requests found.</p>
            : requests.map(item => (
                <Link
                    key={item._id} // FIX: use item._id
                    to={`/user-dashboard/history/meeting/${item._id}`} // FIX: use item._id
                    className="block p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{item.purpose}</p>
                            <p className="text-sm text-gray-600">By: {item.fullName}</p>
                        </div>
                        <p className="text-sm text-gray-500 text-right">To: {item.mlaId?.fullName}</p>
                    </div>
                </Link>
            ))
    );

    const tabs = [
        { name: 'Pending', data: filteredPending },
        { name: 'Approved', data: filteredApproved },
        { name: 'Rejected', data: filteredRejected },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">My Meeting Request History</h1>
            
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by purpose, user, or MLA name..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name.toLowerCase())}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.name.toLowerCase()
                                        ? `border-blue-500 text-blue-600`
                                        : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
                                }`}
                            >
                                {tab.name}{' '}
                                <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 ml-2 text-xs">
                                    {tab.data?.length || 0}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div>
                    {activeTab === 'pending' && renderList(filteredPending)}
                    {activeTab === 'approved' && renderList(filteredApproved)}
                    {activeTab === 'rejected' && renderList(filteredRejected)}
                </div>
            </div>
        </div>
    );
};

export default UserMeetingHistory;