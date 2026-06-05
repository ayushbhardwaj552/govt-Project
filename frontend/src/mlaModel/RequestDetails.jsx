import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const DetailField = ({ label, value }) => (
  <div className="py-2">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
  </div>
);

const Icon = ({ name }) => {
  if (name === 'back') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
      </svg>
    );
  }
  return null;
}

const RequestDetails = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
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
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/meeting-request/history/${requestId}`,
          { headers: { Authorization: `Bearer ${mlaToken}` } }
        );
        if (res.data.success) {
          setRequest(res.data.data || res.data.request);
        } else {
          throw new Error(res.data.message || "Could not find the request.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [requestId, mlaToken]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading details...</div>;
  if (error) return <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>;
  if (!request) return <div className="p-6 text-center text-gray-500">Could not find the request.</div>;

  const scheduledDateTime = request.scheduledMeetingTime ? new Date(request.scheduledMeetingTime) : null;
  const submissionDate = new Date(request.createdAt).toLocaleDateString();

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
        <div className="p-4 bg-gray-700 text-white rounded-t-lg flex justify-between items-center">
          <h1 className="text-xl font-bold">Meeting Request Details</h1>
          <p className="text-sm font-mono">ID: {request._id}</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Applicant Information</h2>
              <DetailField label="Name" value={request.fullName} />
              <DetailField label="Father's Name" value={request.fatherName} />
              <DetailField label="Phone Number" value={request.phone} />
              <DetailField label="Alternate Phone" value={request.alternatePhone} />
              <DetailField label="Email Address" value={request.email} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Address & Profile</h2>
              <DetailField label="Address" value={`${request.addressLine1}, ${request.addressLine2 || ''}`} />
              <DetailField label="Pradhan's Name" value={request.pradhanName} />
              <DetailField label="Job Profile" value={request.jobProfile} />
            </div>

            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Request & Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                <DetailField label="Submission Date" value={submissionDate} />
                <DetailField label="Purpose" value={request.purpose} />
                <DetailField label="Status" value={
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                    request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                } />
              </div>

              {request.status === 'Approved' && scheduledDateTime && (
                <div className="py-2 mt-4 bg-blue-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500">Scheduled For</p>
                  <p className="text-lg font-bold text-blue-800">{`${scheduledDateTime.toLocaleDateString()} at ${scheduledDateTime.toLocaleTimeString()}`}</p>
                  <p className="text-sm font-medium text-gray-500 mt-2">Meeting Notes</p>
                  <p className="text-md text-gray-800">{request.meetingNotes}</p>
                </div>
              )}
            </div>
          </div>

          {request.mediaFiles && request.mediaFiles.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Attached Media</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {request.mediaFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {file.fileType === 'image' && <img src={`${import.meta.env.VITE_API_URL}/${file.url}`} alt="Attachment" className="w-full h-auto object-cover"/>}
                    {file.fileType === 'video' && <video controls src={`${import.meta.env.VITE_API_URL}/${file.url}`} className="w-full h-auto"/>}
                    {file.fileType === 'pdf' && <a href={`${import.meta.env.VITE_API_URL}/${file.url}`} target="_blank" rel="noopener noreferrer" className="block p-4 text-center bg-gray-100 hover:bg-gray-200"><p className="font-semibold text-blue-600">View PDF</p></a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-100 rounded-b-lg text-right">
          <Link to="/dashboard/requests/history" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 inline-flex items-center gap-2">
            <Icon name="back" />
            Back to History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
