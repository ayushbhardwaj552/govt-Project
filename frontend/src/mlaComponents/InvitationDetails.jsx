import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
// ✅ Using standard icons for consistency
import { 
    FiArrowLeft, FiFile, FiUser, FiMail, FiPhone, FiMapPin, 
    FiCalendar, FiClock, FiTag 
} from 'react-icons/fi';

// ✅ Updated helper component to accept an icon
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

const InvitationDetails = () => {
    const { invitationId } = useParams();
    const [invitation, setInvitation] = useState(null);
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
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/invitations/details/${invitationId}`, {
                    headers: { 'Authorization': `Bearer ${mlaToken}` }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch invitation details.');
                }

                const data = await res.json();
                if (data.success) {
                    setInvitation(data.data);
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
    }, [invitationId, mlaToken]);

    const isImage = (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Accepted': return 'bg-green-100 text-green-800';
            case 'Declined': return 'bg-red-100 text-red-800';
            case 'Expired': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-blue-100 text-blue-800'; // For 'Pending'
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading details...</div>;
    if (error) return <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;
    if (!invitation) return <div className="p-6 text-center text-gray-500">Invitation not found.</div>;

    return (
        <div>
            <Link to="/dashboard/invitations/history" className="inline-flex items-center gap-2 text-orange-600 font-semibold mb-4 hover:underline">
                <FiArrowLeft />
                Back to Invitation History
            </Link>

            <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
                {/* ✅ Orange header with status badge */}
                <div className="p-5 bg-orange-500 text-white rounded-t-lg flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Invitation Details</h1>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusClass(invitation.status)}`}>
                        {invitation.status}
                    </span>
                </div>

                <div className="p-6 md:p-8">
                    {/* ✅ Reorganized into cleaner sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* --- Event Info --- */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Event Details</h2>
                            <DetailField icon={<FiTag />} label="Event Type" value={invitation.eventType} />
                            <DetailField icon={<FiCalendar />} label="Event Date" value={new Date(invitation.eventDate).toLocaleDateString('en-IN')} />
                            <DetailField icon={<FiClock />} label="Event Time" value={invitation.eventTime} />
                            <DetailField icon={<FiMapPin />} label="Location" value={invitation.eventLocation} />
                        </div>

                        {/* --- Inviter Info --- */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Inviter Information</h2>
                            <DetailField icon={<FiUser />} label="Invited By" value={invitation.inviterName} />
                            <DetailField icon={<FiMail />} label="Contact Email" value={invitation.inviterEmail} />
                            <DetailField icon={<FiPhone />} label="Contact Phone" value={invitation.inviterPhone} />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Citizen's Message</h2>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border">{invitation.message}</p>
                    </div>

                    {/* Response */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Your Response</h2>
                        <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-md border border-blue-200">
                            {invitation.mlaResponse || 'You have not responded to this invitation yet.'}
                        </p>
                    </div>

                    {/* ✅ Corrected Media Section */}
                    {invitation.mediaFiles && invitation.mediaFiles.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Attached Media</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {invitation.mediaFiles.map((fileUrl, index) => (
                                    <a 
                                      key={index} 
                                      href={fileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="block group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                      {isImage(fileUrl) ? (
                                        <img src={fileUrl} alt={`Attachment ${index + 1}`} className="w-full h-24 object-cover" />
                                      ) : (
                                        <div className="p-4 flex flex-col items-center justify-center h-24 bg-gray-50">
                                          <FiFile className="w-8 h-8 text-gray-400" />
                                          <span className="text-xs text-center text-gray-500 mt-2 truncate w-full">
                                            {fileUrl.split('/').pop()}
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
        </div>
    );
};

export default InvitationDetails;