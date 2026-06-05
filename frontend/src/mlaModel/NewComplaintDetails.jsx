import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
// ✅ Using standard icons for consistency
import { 
    FiArrowLeft, FiFile, FiUser, FiMail, FiPhone, 
    FiMapPin, FiBriefcase, FiFlag, FiCalendar 
} from 'react-icons/fi';

// Helper component for displaying details
const DetailField = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start py-3">
            <div className="text-gray-500 mr-4 text-xl mt-1">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-md text-gray-800">{value}</p>
            </div>
        </div>
    );
};

const NewComplaintDetails = () => {
    const { complaintId } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { mlaToken } = useAuth();

    useEffect(() => {
        const loadDetails = async () => {
            if (!mlaToken) {
                setError("Authentication Error: Please log in.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/complaints/${complaintId}`, {
                    headers: { 'Authorization': `Bearer ${mlaToken}` }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch details.');
                }

                const data = await res.json();
                if (data.success) {
                    setComplaint(data.data);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [complaintId, mlaToken]);

    // Helper to check if a file URL is an image
    const isImage = (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

    if (loading) return <div className="p-6 text-center text-gray-500">Loading details...</div>;
    if (error) return <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;
    if (!complaint) return <div className="p-6 text-center text-gray-500">Complaint not found.</div>;

    return (
        <div>
            <Link 
                to="/dashboard/complaints/new" 
                className="inline-flex items-center gap-2 text-orange-600 font-semibold mb-4 hover:underline"
            >
                <FiArrowLeft />
                Back to New Complaints
            </Link>

            <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
                {/* ✅ Orange header to match theme */}
                <div className="p-5 bg-orange-500 text-white rounded-t-lg flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Complaint Details</h1>
                    <span className="bg-white text-orange-600 px-3 py-1 text-sm font-bold rounded-full">
                        {complaint.status}
                    </span>
                </div>

                <div className="p-6 md:p-8">
                    {/* ✅ Reorganized into cleaner sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* --- Complainant Info --- */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">
                                Complainant Information
                            </h2>
                            <DetailField icon={<FiUser />} label="Name" value={complaint.fillerName} />
                            <DetailField icon={<FiMail />} label="Email" value={complaint.fillerEmail} />
                            <DetailField icon={<FiPhone />} label="Phone" value={complaint.fillerPhone} />
                            <DetailField icon={<FiMapPin />} label="Address" value={complaint.fillerAddress} />
                        </div>

                        {/* --- Complaint Info --- */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">
                                Complaint Details
                            </h2>
                            <DetailField icon={<FiBriefcase />} label="Department" value={complaint.department} />
                            <DetailField icon={<FiFlag />} label="Tehsil" value={complaint.tehsil} />
                            <DetailField icon={<FiMapPin />} label="Problem Location" value={complaint.problemLocationAddress} />
                            <DetailField 
                                icon={<FiCalendar />} 
                                label="Filed On" 
                                value={new Date(complaint.createdAt).toLocaleString('en-IN')} 
                            />
                        </div>
                    </div>

                    {/* Full Message */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">
                            Full Complaint Message
                        </h2>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border">
                            {complaint.message}
                        </p>
                    </div>

                    {/* ✅ Corrected Media Section */}
                    {complaint.mediaFiles && complaint.mediaFiles.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                                Attached Media
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {complaint.mediaFiles.map((file, index) => {
                                    // ✅ Handle string or object format
                                    const fileUrl = typeof file === "string" ? file : file?.url;
                                    const fileName = typeof file === "string" 
                                        ? file.split("/").pop() 
                                        : file?.name || file?.url?.split("/").pop();

                                    if (!fileUrl) return null;

                                    return (
                                        <a 
                                            key={index} 
                                            href={fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="block group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {isImage(fileUrl) ? (
                                                <img 
                                                    src={fileUrl} 
                                                    alt={`Attachment ${index + 1}`} 
                                                    className="w-full h-24 object-cover" 
                                                />
                                            ) : (
                                                <div className="p-4 flex flex-col items-center justify-center h-24 bg-gray-50">
                                                    <FiFile className="w-8 h-8 text-gray-400" />
                                                    <span className="text-xs text-center text-gray-500 mt-2 truncate w-full">
                                                        {fileName}
                                                    </span>
                                                </div>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewComplaintDetails;
