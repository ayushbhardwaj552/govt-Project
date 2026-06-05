// src/components/mlaModel/ResolvedComplaintDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from '../mlaComponents/Icon.jsx';

const DetailField = ({ label, value }) => (
  <div className="py-2">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md font-semibold text-gray-800">{value || 'N/A'}</p>
  </div>
);

const ResolvedComplaintDetails = () => {
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

  if (loading) return <div className="p-6 text-center text-gray-500">Loading details...</div>;
  if (error) return <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;
  if (!complaint) return <div className="p-6 text-center text-gray-500">Complaint not found.</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full">
      <div className="bg-white shadow-lg rounded-lg max-w-5xl mx-auto">
        {/* Header */}
        <div className="p-4 bg-gray-700 text-white rounded-t-lg flex justify-between items-center">
          <h1 className="text-xl font-bold">Complaint Details</h1>
          <p className="text-sm font-mono">Complaint ID: {complaint._id}</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Complainant Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Complainant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailField label="Name" value={complaint.fillerName} />
              <DetailField label="Phone" value={complaint.fillerPhone} />
              <DetailField label="Email" value={complaint.fillerEmail} />
              <DetailField label="Address" value={complaint.fillerAddress} />
              <DetailField label="Job Profile" value={complaint.jobProfile} />
            </div>
          </div>

          {/* Complaint Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Complaint Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailField label="Subject" value={complaint.subject} />
              <DetailField label="Tehsil" value={complaint.tehsil} />
              <DetailField label="Problem Location" value={complaint.problemLocationAddress} />
              <DetailField label="Submission Date" value={new Date(complaint.createdAt).toLocaleString()} />
              <DetailField label="Status" value={complaint.status} />
            </div>
          </div>

          {/* Full Complaint Message */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Full Complaint Message</h2>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">{complaint.message}</p>
          </div>

          {/* MLA Response */}
          <div>
            <h2 className="text-lg font-bold text-blue-800 border-b border-blue-200 pb-2 mb-4">MLA's Official Response</h2>
            <div className="text-gray-800 leading-relaxed bg-blue-50 p-4 rounded-md border border-blue-200">
              {complaint.mlaResponse || 'No response has been recorded yet.'}
            </div>
          </div>

          {/* Attached Media */}
          {complaint.mediaUrl && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Attached Media</h2>
              <div className="mt-2">
                <img src={complaint.mediaUrl} alt="Attached to complaint" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="p-4 bg-gray-100 rounded-b-lg text-right">
          <Link
            to="/dashboard/complaints/history"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Icon name="back" />
            Back to Complaint History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResolvedComplaintDetails;
