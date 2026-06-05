import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiFileText, FiThumbsUp, FiClock, FiSearch, FiChevronRight } from 'react-icons/fi';

// A component for the summary cards
const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const MeetingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // ✅ State for search
    const { mlaToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = async () => {
            if (!mlaToken) {
                setError("Authentication Error: Please log in.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/dashboard`, {
                    headers: { 'Authorization': `Bearer ${mlaToken}` }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `HTTP Error: ${res.status}`);
                }

                const data = await res.json();
                if (data.success && data.data) {
                    const { approvedRequests = [], rejectedRequests = [], completedRequests = [], expiredRequests = [] } = data.data;
                    const allHistoryRequests = [...approvedRequests, ...rejectedRequests, ...completedRequests, ...expiredRequests];
                    
                    // ✅ Sort all history items by the last update date
                    allHistoryRequests.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    setHistory(allHistoryRequests);
                } else {
                    throw new Error(data.message || "Failed to fetch meeting history.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [mlaToken]);

    // ✅ Filtering logic for the search bar
    const filteredHistory = history.filter(request => {
        if (!searchQuery) return true;
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            request.fullName?.toLowerCase().includes(lowercasedQuery) ||
            request.purpose?.toLowerCase().includes(lowercasedQuery)
        );
    });
    
    const handleRowClick = (requestId) => {
        navigate(`/dashboard/requests/history/${requestId}`);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved':
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            case 'Expired':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    // ✅ Calculate stats for the new feature cards
    const approvedCount = history.filter(req => req.status === 'Approved' || req.status === 'Completed').length;
    const approvalRate = history.length > 0 ? `${Math.round((approvedCount / history.length) * 100)}%` : '0%';
    const mostRecentUpdate = history.length > 0 ? new Date(history[0].updatedAt).toLocaleDateString() : 'N/A';


    if (loading) return <div className="p-6 text-center text-gray-500">Loading meeting history...</div>;
    if (error) return <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Meeting Request History</h1>

            {/* --- ✅ New Feature: Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard 
                    icon={<FiFileText size={24} />} 
                    title="Total Past Requests" 
                    value={history.length}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard 
                    icon={<FiThumbsUp size={24} />} 
                    title="Approval Rate" 
                    value={approvalRate}
                    color="bg-green-100 text-green-600"
                />
                 <StatCard 
                    icon={<FiClock size={24} />} 
                    title="Most Recent Update" 
                    value={mostRecentUpdate}
                    color="bg-purple-100 text-purple-600"
                />
            </div>
            
            {/* --- ✅ Search Bar Added and Styled --- */}
            <div className="mb-6 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or purpose..."
                    className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Purpose</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* ✅ Use filteredHistory to render the table */}
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map(request => (
                                <tr 
                                    key={request._id} 
                                    className="hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRowClick(request._id)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{request.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-sm truncate">{request.purpose}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                                        <FiChevronRight size={20} className="inline-block"/>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    {searchQuery ? "No requests match your search." : "No items in history."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MeetingHistory;