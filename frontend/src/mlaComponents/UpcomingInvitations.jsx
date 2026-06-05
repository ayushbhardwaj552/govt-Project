import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import InvitationRespondModal from '../mlaModel/InvitationRespondModel.jsx';
import { FiSend, FiCalendar, FiSearch, FiChevronRight } from 'react-icons/fi';

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


const UpcomingInvitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
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
                    throw new Error(errorData.message || "Failed to fetch invitations.");
                }
                
                const data = await res.json();
                if (data.success) {
                    setInvitations(data.data.upcomingInvitations || []);
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

    const handleResponseSubmit = async (invitationId, responseData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/invitations/${invitationId}/respond`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${mlaToken}` },
                body: JSON.stringify(responseData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to submit response.");
            }
            
            const result = await res.json();
            if (result.success) {
                navigate('response-success', {
                    state: {
                        invitation: result.invitation,
                        mlaResponse: responseData
                    }
                });
                setInvitations(prev => prev.filter(inv => inv._id !== invitationId));
                setSelectedInvitation(null);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Filtering logic for the search bar
    const filteredInvitations = invitations.filter(item => {
        if (!searchQuery) return true;
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            item.eventType?.toLowerCase().includes(lowercasedQuery) ||
            item.inviterName?.toLowerCase().includes(lowercasedQuery)
        );
    });
    
    // ✅ Calculate stats for the new feature cards
    const sortedUpcoming = [...invitations].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    const nextEventDate = sortedUpcoming.length > 0 ? new Date(sortedUpcoming[0].eventDate).toLocaleDateString() : 'N/A';

    if (loading) return <div className="p-6 text-center text-gray-500">Loading upcoming invitations...</div>;
    if (error) return <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Invitations</h1>

            {/* --- ✅ New Feature: Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <StatCard 
                    icon={<FiSend size={24} />} 
                    title="Total Upcoming Events" 
                    value={invitations.length}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard 
                    icon={<FiCalendar size={24} />} 
                    title="Next Event Date" 
                    value={nextEventDate}
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
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Invited By</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quick Response</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* ✅ Use filteredInvitations to render the table */}
                        {filteredInvitations.length > 0 ? filteredInvitations.map(invitation => (
                            <tr 
                                key={invitation._id} 
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/dashboard/invitations/details/${invitation._id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{invitation.eventType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{`${new Date(invitation.eventDate).toLocaleDateString()} at ${invitation.eventTime}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invitation.inviterName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents row's onClick from firing
                                            setSelectedInvitation(invitation);
                                        }}
                                        // ✅ Button color updated to orange
                                        className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 text-xs font-semibold shadow-sm transition-colors"
                                    >
                                        Respond
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    {searchQuery ? "No invitations match your search." : "No new upcoming invitations."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedInvitation && (
                <InvitationRespondModal
                    invitation={selectedInvitation}
                    onClose={() => setSelectedInvitation(null)}
                    onSubmit={handleResponseSubmit}
                />
            )}
        </div>
    );
};

export default UpcomingInvitations;