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

const ComplaintResponseSuccess = () => {
    const location = useLocation();
    // Safely get the complaint and response data passed from the previous page
    const { complaint, mlaResponse } = location.state || { complaint: null, mlaResponse: '' };

    // A fallback for cases where the page is accessed directly without data
    if (!complaint) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500 font-semibold">No submission details found.</p>
                <Link to="/dashboard/complaints/new" className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700">
                    Return to New Complaints
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full flex items-center justify-center">
            <div className="bg-white shadow-2xl rounded-lg max-w-3xl w-full animate-fade-in">
                {/* Success Header */}
                <div className="p-5 bg-green-600 text-white rounded-t-lg flex items-center gap-4">
                    {/* You might need to add a 'check-circle' icon to your Icon component */}
                    <Icon name="check-circle" className="w-8 h-8" /> 
                    <h1 className="text-2xl font-bold">Response Submitted Successfully</h1>
                </div>

                {/* Main Content */}
                <div className="p-6 md:p-8">
                    <p className="text-gray-700 mb-8 text-lg">
                        Your response has been recorded and a notification has been sent to the citizen.
                        Below is a summary of the submission.
                    </p>
                    
                    {/* Original Complaint Details */}
                    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Original Complaint Details</h2>
                        <DetailField label="Submitted By" value={complaint.fillerName} />
                        <DetailField label="Location of Issue" value={complaint.problemLocationAddress} />
                        <div className="py-2">
                            <p className="text-sm font-medium text-gray-500">Citizen's Message</p>
                            <blockquote className="text-md text-gray-800 bg-white p-3 rounded-md mt-1 border-l-4 border-gray-300">
                                {complaint.message}
                            </blockquote>
                        </div>
                    </div>

                    {/* Your Response */}
                    <div className="border-2 rounded-lg p-4 bg-blue-50 border-blue-200">
                        <h2 className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-3 mb-4">Your Official Response</h2>
                        <p className="text-lg text-gray-900 leading-relaxed">{mlaResponse}</p>
                    </div>
                </div>

                {/* Footer with Back Button */}
                <div className="p-4 bg-gray-100 rounded-b-lg text-right">
                    <Link to="/dashboard/complaints/new" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 inline-flex items-center gap-2 transition-transform duration-200 hover:scale-105">
                        <Icon name="back" />
                        Return to New Complaints
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ComplaintResponseSuccess;