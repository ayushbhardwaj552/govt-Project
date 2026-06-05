import React, { useState } from 'react';
import SubmissionSuccess from '../UserView/SubmissionSuccess.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const jobProfileOptions = [
  "Farmer", "Student", "Business Owner",
  "Government Employee", "Private Employee",
  "Social Worker", "Other"
];

const CreateComplaint = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    mlaId: import.meta.env.VITE_MLA_ID || "",
    subject: '',
    jobProfile: '',
    fillerName: '',
    fillerPhone: '',
    fillerEmail: '',
    fillerAddress: '',
    tehsil: '',
    problemLocationAddress: '',
    message: '',
  });

  const [files, setFiles] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation for required fields
    const emptyField = Object.entries(formData).find(([key, value]) => !value);
    if (emptyField) {
      alert(`Please fill the field: ${emptyField[0]}`);
      return;
    }

    if (!agreed) {
      alert("Please confirm the details before submitting.");
      return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    files.forEach(file => submissionData.append('media', file));

    try {
      setLoading(true);
      setApiError('');
      console.log("Submitting...");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/submit-complaint`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submissionData
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.success) {
        setSubmittedData(data.complaint || data.request || {});
      } else {
        setApiError(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedData) {
    return (
      <SubmissionSuccess
        title="Complaint"
        data={submittedData}
        dashboardLink="/user-dashboard"
        historyLink="/user-dashboard/complaints/history"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          File a New Complaint
        </h1>

        {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Your Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <InputField label="Full Name" name="fillerName" value={formData.fillerName} onChange={handleChange} required />
            <InputField label="Phone Number" name="fillerPhone" value={formData.fillerPhone} onChange={handleChange} required />
            <InputField label="Email Address" name="fillerEmail" type="email" value={formData.fillerEmail} onChange={handleChange} required />
            <InputField label="Address" name="fillerAddress" value={formData.fillerAddress} onChange={handleChange} required /> {/* New field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Job Profile</label>
              <select name="jobProfile" value={formData.jobProfile} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md bg-white">
                {jobProfileOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">
            Complaint Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <InputField label="Subject of Complaint" name="subject" value={formData.subject} onChange={handleChange} required />
            <InputField label="Tehsil" name="tehsil" value={formData.tehsil} onChange={handleChange} required />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Address of Problem Location</label>
            <input name="problemLocationAddress" value={formData.problemLocationAddress} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="5" className="w-full p-3 border rounded-md" required></textarea>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Upload Media (images/videos)</label>
            <input type="file" multiple onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-md" />
            {files.length > 0 && <div className="mt-2 text-sm text-gray-600">{files.length} file(s) selected</div>}
          </div>

          <div className="pt-4 border-t mt-6">
            <label className="flex items-center">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
              <span className="ml-3 text-sm text-gray-700">I confirm that the details provided in this complaint are accurate.</span>
            </label>
          </div>

          <div className="text-right pt-4">
            <button
              type="submit"
              disabled={!agreed || loading}
              className={`font-bold py-3 px-8 rounded-md ${!agreed || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {loading ? "Submitting..." : "File Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full p-3 border border-gray-300 rounded-md" />
  </div>
);

export default CreateComplaint;
