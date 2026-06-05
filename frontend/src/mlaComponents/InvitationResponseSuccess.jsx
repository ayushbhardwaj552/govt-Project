import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Icon from './Icon.jsx'; // Adjust path as needed

// Helper component for displaying details consistently
const DetailField = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
);

const InvitationResponseSuccess = () => {
    const location = useLocation();
    // Safely get the data passed from the UpcomingInvitations page
    const { invitation, mlaResponse } = location.state || { invitation: null, mlaResponse: null };

    // Fallback if the page is accessed directly without state
    if (!invitation || !mlaResponse) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500 font-semibold">No submission details found.</p>
                <Link to="/dashboard/invitations" className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700">
                    Return to Upcoming Invitations
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full flex items-center justify-center">
            <div className="bg-white shadow-2xl rounded-lg max-w-3xl w-full animate-fade-in">
                {/* Success Header */}
                <div className="p-5 bg-green-600 text-white rounded-t-lg flex items-center gap-4">
                    <Icon name="check-circle" className="w-8 h-8" /> 
                    <h1 className="text-2xl font-bold">Response Submitted Successfully</h1>
                </div>

                {/* Main Content */}
                <div className="p-6 md:p-8">
                    <p className="text-gray-700 mb-8 text-lg">
                        Your response has been recorded and a notification has been sent to the citizen.
                    </p>
                    
                    {/* Original Invitation Details */}
                    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Original Invitation</h2>
                        <DetailField label="Invited By" value={invitation.inviterName} />
                        <DetailField label="Event" value={invitation.eventType} />
                        <DetailField label="Date & Time" value={`${new Date(invitation.eventDate).toLocaleDateString()} at ${invitation.eventTime}`} />
                        <div className="py-2">
                            <p className="text-sm font-medium text-gray-500">Citizen's Message</p>
                            <blockquote className="text-md text-gray-800 bg-white p-3 rounded-md mt-1 border-l-4 border-gray-300">
                                {invitation.message}
                            </blockquote>
                        </div>
                    </div>

                    {/* Your Response */}
                    <div className="border-2 rounded-lg p-4 bg-blue-50 border-blue-200">
                        <h2 className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-3 mb-4">Your Official Response</h2>
                        <p className="text-lg font-semibold text-gray-900">Status: {mlaResponse.responseStatus}</p>
                        <p className="text-md text-gray-800 mt-2">{mlaResponse.responseMessage || "No custom message was sent."}</p>
                    </div>

                     {/* Attached Media */}
                    {invitation.mediaFiles && invitation.mediaFiles.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Attached Media</h2>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {invitation.mediaFiles.map((file, index) => (
                                    <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <img src={file.url} alt={`Attachment ${index + 1}`} className="w-full h-auto object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-100 rounded-b-lg text-right">
                    <Link to="/dashboard/invitations" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 inline-flex items-center gap-2">
                        <Icon name="back" />
                        Return to Upcoming Invitations
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InvitationResponseSuccess;