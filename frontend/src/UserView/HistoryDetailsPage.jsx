import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFile } from 'react-icons/fi';
import { useAuth } from "../context/AuthContext.jsx";

const DetailRow = ({ label, value }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{value}</dd>
        </div>
    );
};

const HistoryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/meeting-request/history/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

                if (data.success && data.request) {
                    setItem(data.request);
                } else {
                    throw new Error(data.message || 'Failed to get request details from response.');
                }
            } catch (err) {
                console.error('Failed to load details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token && id) loadDetails();
    }, [id, token]);
    
    // Helper function to check if a file URL is an image
    const isImage = (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

    if (loading) {
        return <div className="p-6 text-center">Loading Details...</div>;
    }

    if (error || !item) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-4 hover:underline"
                >
                    <FiArrowLeft />
                    Back to History
                </button>
                <div className="bg-white p-6 text-center text-red-500 rounded-lg shadow-md">
                    <p className="font-bold">Could not load details.</p>
                    <p className="text-sm mt-1">{error || "Please try again later."}</p>
                </div>
            </div>
        );
    }

    const title = 'Meeting Request Details';
    
    const flat = {
        'Request Purpose': item.purpose,
        Status: item.status,
        'Submitted On': item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'N/A',
        'Your Name': item.fullName,
        "Father's Name": item.fatherName,
        'Email': item.email,
        'Phone': item.phone,
        'Alternate Phone': item.alternatePhone,
        'Job Profile': item.jobProfile,
        'Address': `${item.addressLine1}${item.addressLine2 ? `, ${item.addressLine2}` : ''}`,
        'Pradhan Name': item.pradhanName,
        'MLA Name': item.mlaId?.fullName,
        'Preferred Date': item.meetingDate ? new Date(item.meetingDate).toLocaleDateString('en-IN') : 'N/A',
        'Scheduled Time': item.scheduledMeetingTime
            ? new Date(item.scheduledMeetingTime).toLocaleString('en-IN')
            : 'Not scheduled yet',
        'MLA Response': item.meetingNotes || 'No response yet',
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-4 hover:underline"
            >
                <FiArrowLeft />
                Back to History
            </button>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-4">
                    {title}
                </h1>
                <dl className="divide-y divide-gray-200">
                    {Object.entries(flat).map(([label, value]) =>
                        <DetailRow key={label} label={label} value={String(value)} />
                    )}
                </dl>

                {item.mediaFiles && item.mediaFiles.length > 0 && (
                    <div className="pt-4 mt-4 border-t">
                        <h2 className="text-sm font-medium text-gray-500 mb-3">Attached Files</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {item.mediaFiles.map((file, index) => (
                                <a 
                                    key={index} 
                                    href={file.url} // FIX: Use file.url
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="block group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {isImage(file.url) ? ( // FIX: Use file.url
                                        <img src={file.url} alt={`Attachment ${index + 1}`} className="w-full h-24 object-cover" />
                                    ) : (
                                        <div className="p-4 flex flex-col items-center justify-center h-24 bg-gray-50">
                                            <FiFile className="w-8 h-8 text-gray-400" />
                                            <span className="text-xs text-center text-gray-500 mt-2 truncate w-full">
                                                {file.url.split('/').pop()} // FIX: Use file.url
                                            </span>
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryDetailsPage;