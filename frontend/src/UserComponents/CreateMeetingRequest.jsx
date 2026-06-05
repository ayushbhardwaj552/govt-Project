import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import axios from "axios";

// --- Submission Success Component (Updated to correctly render file data) ---
const SubmissionSuccess = ({ title, data, dashboardLink, historyLink }) => (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Submission Successful!</h1>
        <p className="text-gray-700 mb-6">Your {title.toLowerCase()} has been received.</p>
        <div className="text-left bg-gray-50 p-4 rounded-md border">
            <h3 className="font-semibold mb-2">Submitted Details:</h3>
            <p className="text-sm"><strong>MLA ID:</strong> {data.mlaId}</p>
            <p className="text-sm"><strong>Full Name:</strong> {data.fullName}</p>
            <p className="text-sm"><strong>Father's Name:</strong> {data.fatherName}</p>
            <p className="text-sm"><strong>Email:</strong> {data.email}</p>
            <p className="text-sm"><strong>Phone:</strong> {data.phone}</p>
            <p className="text-sm"><strong>Alternate Phone:</strong> {data.alternatePhone}</p>
            <p className="text-sm"><strong>Address Line 1:</strong> {data.addressLine1}</p>
            <p className="text-sm"><strong>Address Line 2:</strong> {data.addressLine2}</p>
            <p className="text-sm"><strong>Pradhan Name:</strong> {data.pradhanName}</p>
            <p className="text-sm"><strong>Job Profile:</strong> {data.jobProfile}</p>
            <p className="text-sm"><strong>Purpose:</strong> {data.purpose}</p>
            <p className="text-sm"><strong>Meeting Date:</strong> {new Date(data.meetingDate).toLocaleDateString()}</p>
            {data.mediaFiles && data.mediaFiles.length > 0 && (
                <div className="mt-2">
                    <h4 className="font-semibold">Uploaded Files:</h4>
                    <ul className="list-disc list-inside text-sm">
                        {data.mediaFiles.map((file, idx) => (
                            <li key={idx}>
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {file.url.substring(file.url.lastIndexOf('/') + 1)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        <div className="mt-6 flex justify-center gap-4">
            <a href={dashboardLink} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Go to Dashboard</a>
            <a href={historyLink} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">View History</a>
        </div>
    </div>
);

// --- Input Field Component ---
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full p-3 border border-gray-300 rounded-md" />
    </div>
);

const CreateMeetingRequest = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        mlaId: import.meta.env.VITE_MLA_ID || "",
        fullName: '',
        fatherName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        addressLine1: '',
        addressLine2: '',
        pradhanName: '',
        jobProfile: "",
        purpose: "",
        meetingDate: new Date().toISOString().split('T')[0],
    });
    const [files, setFiles] = useState([]);
    const [agreed, setAgreed] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFiles(Array.from(e.target.files));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("Authentication error: You are not logged in.");
            return;
        }
        if (!agreed) {
            setError("Please confirm that the information provided is correct.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const submissionData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submissionData.append(key, value ?? "");
            });
            files.forEach(file => submissionData.append('mediaFiles', file));
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/request-meeting`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setSubmittedData(response.data.request);
            } else {
                setError(response.data.message || "An unknown error occurred.");
            }
        } catch (err) {
            console.error("Submit Error:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || err.message || "Failed to submit request. Check server connection.");
        } finally {
            setLoading(false);
        }
    };

    if (submittedData) {
        return (
            <SubmissionSuccess
                title="Meeting Request"
                data={submittedData}
                dashboardLink="/user-dashboard"
                historyLink="/user-dashboard/meeting-requests/history"
            />
        );
    }
    const jobProfileOptions = ["Farmer", "Student", "Business Owner", "Government Employee", "Private Employee", "Social Worker", "Other"];
    const purposeOptions = ["Water Supply Issue", "Electricity Problem", "Road Construction/Repair", "Law and Order", "Education-related", "Health Services", "Land Dispute", "Personal Grievance", "Other"];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Create Meeting Request</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        <InputField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                        <InputField label="Alternate Phone (Optional)" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} />
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Job Profile</label>
                            <select name="jobProfile" value={formData.jobProfile} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md bg-white">
                                <option value="">Select One</option>
                                {jobProfileOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Address */}
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Address Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
                        <InputField label="Address Line 2 (Optional)" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
                        <InputField label="Pradhan Name (Optional)" name="pradhanName" value={formData.pradhanName} onChange={handleChange} />
                    </div>
                    {/* Request */}
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Request Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Purpose of Meeting (Subject)</label>
                            <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md bg-white">
                                <option value="">Select One</option>
                                {purposeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <InputField label="Preferred Meeting Date" name="meetingDate" type="date" value={formData.meetingDate} onChange={handleChange} required />
                    </div>
                    {/* Files */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Attach Files (Optional)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FiUpload />
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                    <span>Upload files</span>
                                    <input id="file-upload" name="mediaFiles" type="file" className="sr-only" onChange={handleFileChange} multiple />
                                </label>
                                {files.length > 0 && <p className="text-sm font-semibold text-green-600">{files.length} file(s) selected</p>}
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}
                    {/* Agreement */}
                    <div className="pt-4 border-t mt-6">
                        <label className="flex items-center">
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
                            <span className="ml-3 text-sm text-gray-700">I hereby declare that the information provided is true and correct.</span>
                        </label>
                    </div>
                    {/* Submit */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className={`font-bold py-3 px-8 rounded-md transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            disabled={loading || !agreed}
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMeetingRequest;