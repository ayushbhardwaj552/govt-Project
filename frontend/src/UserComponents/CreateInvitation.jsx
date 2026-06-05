import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// --- SubmissionSuccess Component ---
const SubmissionSuccess = ({ title, data, historyLink }) => (
    <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Submission Successful!</h2>
        <p className="text-gray-700">Your {title.toLowerCase()} has been sent and is awaiting a response from the MLA's office.</p>
        
        <div className="mt-6 text-left bg-gray-50 p-6 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Invitation Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div><strong>Inviter Name:</strong> {data.inviterName}</div>
                <div><strong>Phone:</strong> {data.inviterPhone}</div>
                <div><strong>Email:</strong> {data.inviterEmail}</div>
                <div><strong>Job Profile:</strong> {data.jobProfile}</div>
                <div className="md:col-span-2 mt-4">
                    <h4 className="font-bold text-gray-600">Event Information:</h4>
                </div>
                <div><strong>Subject:</strong> {data.subject}</div>
                <div><strong>Event Type:</strong> {data.eventType}</div>
                <div><strong>Event Date:</strong> {data.eventDate}</div>
                <div><strong>Event Time:</strong> {data.eventTime}</div>
                <div className="md:col-span-2"><strong>Event Location:</strong> {data.eventLocation}</div>
                <div className="md:col-span-2">
                    <strong>Message:</strong> 
                    <p className="mt-1 p-2 bg-white rounded border border-gray-300 whitespace-pre-wrap">{data.message}</p>
                </div>
            </div>
        </div>

        <a href={historyLink} className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Invitation History
        </a>
    </div>
);

// --- Job profile options ---
const jobProfileOptions = ["Select One", "Event Organizer", "Community Head", "School Principal", "Business Representative", "Individual", "Other"];

// --- CreateInvitation Component ---
const CreateInvitation = () => {
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        mlaId: import.meta.env.VITE_MLA_ID || "",
        subject: '',
        jobProfile: '',
        inviterName: '',
        inviterPhone: '',
        inviterEmail: '',
        eventType: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        message: '',
    });

    const [files, setFiles] = useState([]);
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFiles(Array.from(e.target.files));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError("You must be logged in to send an invitation.");
            return;
        }

        if (!agreed) {
            setError("Please confirm the invitation details before sending.");
            return;
        }

        setLoading(true);

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));

        // Append files under 'media' field for backend
        files.forEach(file => submissionData.append('media', file));
       
        try {
            console.log("Start")
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/submit-invitation`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Do NOT set Content-Type manually
                },
                body: submissionData
            });

            const data = await res.json();
           
            if (!res.ok) {
                throw new Error(data.message || `HTTP error! Status: ${res.status}`);
            }

            if (data.success) {
                setSubmittedData(formData);
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        } catch (err) {
            setError(`Failed to submit invitation. ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submittedData) {
        return (
            <SubmissionSuccess
                title="Invitation"
                data={submittedData}
                historyLink="/user-dashboard/invitations/history"
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Send an Invitation</h1>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Your Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <InputField label="Your Name" name="inviterName" value={formData.inviterName} onChange={handleChange} required />
                        <InputField label="Phone Number" name="inviterPhone" value={formData.inviterPhone} onChange={handleChange} required />
                        <InputField label="Email Address" name="inviterEmail" type="email" value={formData.inviterEmail} onChange={handleChange} required />
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Your Role/Job Profile</label>
                            <select name="jobProfile" value={formData.jobProfile} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md bg-white">
                                {jobProfileOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Event Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <InputField label="Subject of Invitation" name="subject" value={formData.subject} onChange={handleChange} required />
                        <InputField label="Event Type" name="eventType" value={formData.eventType} onChange={handleChange} placeholder="e.g., Inauguration" required />
                        <InputField label="Event Date" name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} required />
                        <InputField label="Event Time" name="eventTime" type="time" value={formData.eventTime} onChange={handleChange} required />
                    </div>

                    <div className="mt-6">
                        <InputField label="Event Location" name="eventLocation" value={formData.eventLocation} onChange={handleChange} required />
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Invitation Message</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full p-3 border rounded-md" required></textarea>
                    </div>

                    {/* File Upload */}
                    <div className="mt-6">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Attach Media (Optional)</label>
                        <input
                            id="file-upload"
                            name="media"
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                        {files.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                <p className="font-semibold">Selected files:</p>
                                <ul className="list-disc list-inside">
                                    {files.map(file => <li key={file.name}>{file.name}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t mt-6">
                        <label className="flex items-center">
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded"/>
                            <span className="ml-3 text-sm text-gray-700">I am formally extending this invitation to the MLA.</span>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="text-right pt-4">
                        <button type="submit" disabled={!agreed || loading} className={`font-bold py-3 px-8 rounded-md transition-colors ${!agreed || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                            {loading ? 'Sending...' : 'Send Invitation'}
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

export default CreateInvitation;
