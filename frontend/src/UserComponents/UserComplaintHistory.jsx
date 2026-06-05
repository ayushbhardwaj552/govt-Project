import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- Your Main Component ---
const UserComplaintHistory = () => {
    const [history, setHistory] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // ✅ State for the search input
    const { token } = useAuth();

    useEffect(() => {
        const getComplaintHistory = async () => {
            if (!token) {
                setError("Authentication error: You are not logged in.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null); 

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/complaints/history`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Failed to fetch data: ${res.statusText}`);
                }

                const data = await res.json();
                if (data.success) {
                    setHistory(data.complaints || []);
                } else {
                    throw new Error(data.message || "An unknown error occurred.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getComplaintHistory();
    }, [token]);

    // ✅ Filter the history based on the search query
    const filteredHistory = history.filter(item => {
        if (!searchQuery) return true; // If search is empty, show all items
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            item.fillerName?.toLowerCase().includes(lowercasedQuery) ||
            item.message?.toLowerCase().includes(lowercasedQuery)
        );
    });

    const getStatusClass = (status) => {
        if (status === 'Under Review') return 'bg-blue-100 text-blue-800';
        if (status === 'Resolved' || status === 'Closed') return 'bg-green-100 text-green-800';
        return 'bg-yellow-100 text-yellow-800'; // Default for 'Submitted'
    };
    
    const DetailItem = ({ label, value }) => (
        <div className="py-2">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-sm text-gray-900">{value || 'N/A'}</p>
        </div>
    );

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading complaint history...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500 bg-red-100 rounded-lg shadow-md"><strong>Error:</strong> {error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Complaint History</h1>
            
            {/* --- ✅ Search Bar Added Here --- */}
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or message..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {/* --- End of Search Bar --- */}
            
            <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
                {/* ✅ Use the 'filteredHistory' variable for rendering */}
                {filteredHistory.length > 0 ? filteredHistory.map(item => (
                    <div 
                        key={item._id}
                        className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => setSelectedComplaint(item)}
                    >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{item.fillerName}</p>
                                <p className="text-sm text-gray-600 mt-1 truncate max-w-md">{item.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Filed on: {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`mt-2 sm:mt-0 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <p className="p-6 text-center text-gray-500">
                        {searchQuery ? 'No complaints match your search.' : 'You have not filed any complaints yet.'}
                    </p>
                )}
            </div>

            {/* Complaint Details Modal (remains unchanged) */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h2 className="text-xl font-bold text-gray-800">Complaint Details</h2>
                            <button onClick={() => setSelectedComplaint(null)} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <DetailItem label="Complainant Name" value={selectedComplaint.fillerName} />
                            <DetailItem label="Complainant Phone" value={selectedComplaint.fillerPhone} />
                            <DetailItem label="Complainant Email" value={selectedComplaint.fillerEmail} />
                            <DetailItem label="Complainant Address" value={selectedComplaint.fillerAddress} />
                            <DetailItem label="Tehsil" value={selectedComplaint.tehsil} />
                            <DetailItem label="Problem Location" value={selectedComplaint.problemLocationAddress} />
                            <DetailItem label="MLA" value={selectedComplaint.mlaId?.fullName} />
                            <DetailItem label="Filed On" value={new Date(selectedComplaint.createdAt).toLocaleString()} />
                        </div>

                        <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium text-gray-500 mb-2">Complaint Message</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{selectedComplaint.message}</p>
                        </div>

                        {selectedComplaint.mediaFiles && selectedComplaint.mediaFiles.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Attached Media</h3>
                                <div className="flex flex-wrap gap-4">
                                    {selectedComplaint.mediaFiles.map(file => (
                                        file.fileType === 'image' && (
                                            <a key={file._id} href={`${import.meta.env.VITE_API_URL}/${file.url.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/${file.url.replace(/\\/g, '/')}`}
                                                    alt="Complaint media"
                                                    className="w-32 h-32 object-cover rounded-md border hover:opacity-80 transition-opacity"
                                                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/eee/ccc?text=Invalid\\nImage'; }}
                                                />
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <button 
                            onClick={() => setSelectedComplaint(null)} 
                            className="mt-6 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserComplaintHistory;