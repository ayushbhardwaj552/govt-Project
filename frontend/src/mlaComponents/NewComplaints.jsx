import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintRespondModal from '../mlaModel/ComplaintRespondModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FiAlertCircle, FiClock, FiSearch } from 'react-icons/fi';

// A new component for the summary cards
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


const NewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // ✅ State for search
    const { mlaToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadComplaints = async () => {
            if (!mlaToken) {
                setError("Authentication Error: No token found. Please log in.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/complaints`, {
                    headers: { 'Authorization': `Bearer ${mlaToken}` }
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `HTTP Error: ${res.status}`);
                }
                const data = await res.json();
                if (data.success) {
                    setComplaints(data.data.unreadComplaints || []);
                } else {
                    throw new Error(data.message || "Failed to fetch complaints.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadComplaints();
    }, [mlaToken]);

    const handleResponseSubmit = async (complaintId, responseData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/complaints/${complaintId}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mlaToken}`
                },
                body: JSON.stringify(responseData)
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP Error: ${res.status}`);
            }
            const result = await res.json();
            if (result.success) {
                navigate('/dashboard/complaints/response-success', {
                    state: {
                        complaint: result.complaint,
                        mlaResponse: responseData.responseMessage
                    }
                });
                setComplaints(prevComplaints => prevComplaints.filter(c => c._id !== complaintId));
                setSelectedComplaint(null);
            } else {
                throw new Error(result.message || "Failed to submit response.");
            }
        } catch (err) {
            console.error('Failed to respond to complaint:', err);
            setError(`Error: ${err.message}`);
        }
    };

    const handleRowClick = (complaintId) => {
        navigate(`/dashboard/complaints/new/${complaintId}`);
    };
    
    // ✅ Filtering logic for the search bar
    const filteredComplaints = complaints.filter(complaint => {
        if (!searchQuery) return true;
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            complaint.fillerName?.toLowerCase().includes(lowercasedQuery) ||
            complaint.message?.toLowerCase().includes(lowercasedQuery) ||
            complaint.problemLocationAddress?.toLowerCase().includes(lowercasedQuery)
        );
    });

    // ✅ Calculate stats for the new feature cards
    const oldestComplaint = complaints.length > 0
        ? new Date(complaints.reduce((oldest, current) => new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest).createdAt).toLocaleDateString()
        : 'N/A';

    if (loading) return <div className="p-6 text-center text-gray-500">Loading new complaints...</div>;
    if (error) return <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">New Complaints</h1>
            
            {/* --- ✅ New Feature: Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <StatCard 
                    icon={<FiAlertCircle size={24} />} 
                    title="Total New Complaints" 
                    value={complaints.length}
                    color="bg-red-100 text-red-600"
                />
                <StatCard 
                    icon={<FiClock size={24} />} 
                    title="Oldest Pending Complaint" 
                    value={oldestComplaint}
                    color="bg-yellow-100 text-yellow-600"
                />
            </div>
            
            {/* --- ✅ Search Bar Added and Styled --- */}
            <div className="mb-6 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, location, or subject..."
                    className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted By</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Complaint</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quick Response</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* ✅ Use filteredComplaints to render the table */}
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map(complaint => (
                                <tr 
                                    key={complaint._id} 
                                    className="hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRowClick(complaint._id)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{complaint.fillerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{complaint.problemLocationAddress}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-sm">{complaint.message}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedComplaint(complaint);
                                            }}
                                            // ✅ Button color updated to orange
                                            className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 text-xs font-semibold shadow-sm transition-colors"
                                        >
                                            Respond
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    {searchQuery ? "No complaints match your search." : "No new complaints found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedComplaint && (
                <ComplaintRespondModal
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                    onSubmit={handleResponseSubmit}
                />
            )}
        </div>
    );
};

export default NewComplaints;