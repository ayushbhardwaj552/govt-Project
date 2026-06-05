import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiSend, FiThumbsUp, FiCalendar, FiSearch, FiChevronRight } from 'react-icons/fi';

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


const InvitationHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // ✅ State for search
    const { mlaToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            if (!mlaToken) {
                setError("Authentication Error. Please log in.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/invitations/dashboard`, {
                    headers: { 'Authorization': `Bearer ${mlaToken}` }
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Failed to fetch invitation history.");
                }

                const data = await res.json();
                if (data.success) {
                    const invitationHistory = data.data.invitationHistory || [];
                    invitationHistory.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    setHistory(invitationHistory);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [mlaToken]);

    // ✅ Filtering logic for the search bar
    const filteredHistory = history.filter(item => {
        if (!searchQuery) return true;
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            item.eventType?.toLowerCase().includes(lowercasedQuery) ||
            item.inviterName?.toLowerCase().includes(lowercasedQuery)
        );
    });
    
    const handleRowClick = (invitationId) => {
        navigate(`/dashboard/invitations/details/${invitationId}`);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Accepted': return 'bg-green-100 text-green-800';
            case 'Declined': return 'bg-red-100 text-red-800';
            case 'Expired': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    // ✅ Calculate stats for the new feature cards
    const acceptedCount = history.filter(item => item.status === 'Accepted').length;
    const acceptanceRate = history.length > 0 ? `${Math.round((acceptedCount / history.length) * 100)}%` : '0%';
    const mostRecentEventDate = history.length > 0 ? new Date(history[0].eventDate).toLocaleDateString() : 'N/A';

    if (loading) return <div className="p-6 text-center text-gray-500">Loading invitation history...</div>;
    if (error) return <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Invitation History</h1>
            
            {/* --- ✅ New Feature: Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard 
                    icon={<FiSend size={24} />} 
                    title="Total Invitations" 
                    value={history.length}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard 
                    icon={<FiThumbsUp size={24} />} 
                    title="Acceptance Rate" 
                    value={acceptanceRate}
                    color="bg-green-100 text-green-600"
                />
                 <StatCard 
                    icon={<FiCalendar size={24} />} 
                    title="Most Recent Event" 
                    value={mostRecentEventDate}
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
                    placeholder="Search by event type or inviter name..."
                    className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Invited By</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Event Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* ✅ Use filteredHistory to render the table */}
                        {filteredHistory.length > 0 ? filteredHistory.map(invitation => (
                            <tr 
                                key={invitation._id} 
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleRowClick(invitation._id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{invitation.eventType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invitation.inviterName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(invitation.eventDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invitation.status)}`}>
                                        {invitation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                                     <FiChevronRight size={20} className="inline-block"/>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    {searchQuery ? "No invitations match your search." : "No invitation history found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvitationHistory;