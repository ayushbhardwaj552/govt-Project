import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RespondModal from "../mlaModel/RespondModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// --- Search Icon ---
const Icon = ({ name }) => {
  if (name === "search") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    );
  }
  return null;
};

const MeetingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mlaToken } = useAuth();
  const navigate = useNavigate();

  // --- Load pending requests ---
  useEffect(() => {
    const loadRequests = async () => {
      if (!mlaToken) {
        setError("Authentication Error: No token provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/mla/dashboard`,
          {
            headers: { Authorization: `Bearer ${mlaToken}` },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `HTTP Error: ${res.status}`);
        }

        if (data.success) {
          setRequests(data.data.pendingRequests || []);
        } else {
          throw new Error(data.message || "Failed to fetch data.");
        }
      } catch (err) {
        console.error("Load requests error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [mlaToken]);

  // --- Respond to a request ---
  const handleRespondSubmit = async (requestId, responseData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/mla/meeting-requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${mlaToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(responseData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `HTTP Error: ${res.status}`);
      }

      if (data.success) {
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
        setSelectedRequest(null);
      } else {
        throw new Error(data.message || "Failed to update request.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(`Failed to update request: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Navigate to history/details page ---
  const handleRowClick = (requestId) => {
    navigate(`/dashboard/requests/history/${requestId}`);
  };

  // --- Filter requests based on search ---
  const filteredRequests = requests.filter(
    (req) =>
      req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.includes(searchTerm) ||
      req.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading requests...</div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center border rounded-md overflow-hidden">
          <span className="p-3 text-gray-400">
            <Icon name="search" />
          </span>
          <input
            type="text"
            placeholder="Search by name, phone, or purpose..."
            className="w-full p-3 border-none outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Phone No
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Requested Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr
                  key={request._id}
                  onClick={() => handleRowClick(request._id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {request.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {request.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(request.meetingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs">
                    {request.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 text-xs font-semibold shadow-sm"
                    >
                      Respond
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm
                    ? "No requests match your search."
                    : "No new meeting requests found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <RespondModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSubmit={(id, data) => handleRespondSubmit(id, data)}
        />
      )}
    </div>
  );
};

export default MeetingRequests;
