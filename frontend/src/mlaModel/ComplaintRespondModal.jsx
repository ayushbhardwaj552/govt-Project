import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FiX } from 'react-icons/fi'; // ✅ Using standard icons

const ComplaintRespondModal = ({ complaint, onClose, onSubmit }) => {
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const { mlaToken } = useAuth();

    useEffect(() => {
        const markAsRead = async () => {
            if (!complaint || !mlaToken) return;
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/complaints/${complaint._id}/read`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${mlaToken}`
                    }
                });
                console.log(`Complaint ${complaint._id} marked as read.`);
            } catch (err) {
                console.error("Failed to mark complaint as read:", err);
            }
        };

        markAsRead();
    }, [complaint, mlaToken]);

    const handleSubmit = () => {
        setError('');
        if (!response.trim()) {
            setError("Please enter a response before submitting.");
            return;
        }
        const responseData = { responseMessage: response };
        onSubmit(complaint._id, responseData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Respond to Complaint</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto">
                    {/* ✅ Expanded Details Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">Complaint Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div><strong>From:</strong> {complaint.fillerName || 'N/A'}</div>
                            <div><strong>Phone:</strong> {complaint.fillerPhone || 'N/A'}</div>
                            <div><strong>Email:</strong> {complaint.fillerEmail || 'N/A'}</div>
                            <div><strong>Address:</strong> {complaint.fillerAddress || 'N/A'}</div>
                            <div><strong>Tehsil:</strong> {complaint.tehsil || 'N/A'}</div>
                            <div><strong>Department:</strong> {complaint.department || 'N/A'}</div>
                            <div className="sm:col-span-2"><strong>Problem Location:</strong> {complaint.problemLocationAddress || 'N/A'}</div>
                            <div className="sm:col-span-2">
                                <strong>Filed On:</strong> {new Date(complaint.createdAt).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                         <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">Citizen's Message</h3>
                         <p className="text-gray-800 bg-gray-50 p-3 rounded-md border">{complaint.message}</p>
                    </div>

                    <label htmlFor="response-textarea" className="block text-sm font-bold text-gray-700">Your Official Response</label>
                    <textarea
                        id="response-textarea"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows="5"
                        placeholder="Enter your official response or the action taken..."
                    ></textarea>

                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    {/* ✅ Button color updated to orange */}
                    <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors">
                        Submit Response
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplaintRespondModal;