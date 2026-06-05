import { useState } from "react";

const Icon = ({ name }) => {
  if (name === "close") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    );
  }
  return null;
};

const RespondModal = ({ request, onClose, onSubmit }) => {
  const [status, setStatus] = useState("Approved");
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    meetingNotes: "",
  });

  const isApproved = status === "Approved";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let responseData = {
      status,
      meetingNotes: formData.meetingNotes,
    };

    if (isApproved && formData.scheduledDate && formData.scheduledTime) {
      responseData.scheduledMeetingTime = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}:00`
      ).toISOString();
    }

    onSubmit(request._id, responseData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up">
        <div className="p-4 border-b bg-gray-50 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Respond to Meeting Request
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <Icon name="close" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6 bg-gray-100 p-4 rounded-md border border-gray-200">
            <h3 className="font-bold text-gray-700">Request from: {request.fullName}</h3>
            <p className="text-sm text-gray-600 mt-1">Phone: {request.phone}</p>
            <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Approved"
                    checked={isApproved}
                    onChange={() => setStatus("Approved")}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Approve</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Rejected"
                    checked={!isApproved}
                    onChange={() => setStatus("Rejected")}
                    className="form-radio text-red-600"
                  />
                  <span className="ml-2 text-gray-700">Decline</span>
                </label>
              </div>
            </div>

            {isApproved && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isApproved ? "Notes / Remarks" : "Reason for Declining"}
              </label>
              <textarea
                name="meetingNotes"
                value={formData.meetingNotes}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={isApproved ? "e.g., Please bring all relevant documents." : "Provide reason for declining..."}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RespondModal;
