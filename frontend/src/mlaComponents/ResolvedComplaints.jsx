import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiCheckSquare, FiClock, FiSearch, FiChevronRight } from 'react-icons/fi';

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


const ResolvedComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // ✅ State for search
    const { mlaToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadComplaints = async () => {
            if (!mlaToken) {
                setLoading(false);
                setError("Authentication Error: Please log in.");
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
                    const readComplaints = data.data.readComplaints || [];
                    readComplaints.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    setComplaints(readComplaints);
                } else {
                    throw new Error(data.message || "Failed to fetch complaint history.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadComplaints();
    }, [mlaToken]);
    
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

    const handleRowClick = (complaintId) => {
        navigate(`/dashboard/complaints/resolved/${complaintId}`);
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Under Review': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };
    
    // ✅ Calculate stats for the new feature cards
    const mostRecentActionDate = complaints.length > 0 
        ? new Date(complaints[0].updatedAt).toLocaleDateString() 
        : 'N/A';

    if (loading) return <div className="p-6 text-center text-gray-500">Loading complaint history...</div>;
    if (error) return <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Actioned Complaints</h1>

            {/* --- ✅ New Feature: Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <StatCard 
                    icon={<FiCheckSquare size={24} />} 
                    title="Total Actioned Complaints" 
                    value={complaints.length}
                    color="bg-green-100 text-green-600"
                />
                <StatCard 
                    icon={<FiClock size={24} />} 
                    title="Most Recent Action" 
                    value={mostRecentActionDate}
                    color="bg-blue-100 text-blue-600"
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
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Complaint Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
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
                                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-sm">{complaint.message}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    {/* ✅ Cleaner "Action" column */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                                        <FiChevronRight size={20} className="inline-block"/>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    {searchQuery ? "No complaints match your search." : "No actioned complaints found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResolvedComplaints;