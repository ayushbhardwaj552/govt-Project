import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

// Helper component for displaying profile fields
const InfoField = ({ label, value }) => (
    <div>
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <p className="text-lg text-gray-800">{value || 'N/A'}</p>
    </div>
);

const ProfileSettings = () => {
    const { mlaToken } = useAuth();
    const navigate = useNavigate(); // 2. Initialize useNavigate
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!mlaToken) {
                setError("Authentication error. Please log in again.");
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/mla/profile`, {
                    headers: { 'Authorization': `Bearer ${mlaToken}` }
                });
                if (res.data.success) {
                    setProfile(res.data.profile);
                } else {
                    throw new Error(res.data.message);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [mlaToken]);

    const handlePasswordInputChange = (e) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({ ...prev, [id]: value }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/mla/change-password`, passwordData, {
                headers: { 'Authorization': `Bearer ${mlaToken}` }
            });

            if (res.data.success) {
                // 3. Navigate to the success page
                navigate('/dashboard/password-change-success');
            }
        } catch (err) {
            setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'An error occurred.' });
        }
    };

    if (loading) return <div className="p-6 text-center">Loading Profile...</div>;
    if (error) return <div className="p-6 text-center text-red-600 bg-red-100 rounded-md">{error}</div>;

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile & Settings</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">My Information</h2>
                {profile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField label="Full Name" value={profile.fullName} />
                        <InfoField label="Email Address" value={profile.email} />
                        <InfoField label="Phone Number" value={profile.phone} />
                        <InfoField label="Gender" value={profile.gender} />
                        <InfoField label="Address" value={profile.address} />
                        <InfoField label="Role" value={profile.role} />
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">Change Password</h2>
                 <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">New Password</label>
                        <input type="password" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                    </div>

                    {passwordMessage.text && (
                        <div className={`p-3 rounded-md text-sm ${passwordMessage.type === 'error' ? 'bg-red-100 text-red-800' : ''}`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    <div className="text-right">
                        <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-6 rounded-md hover:bg-orange-600">
                            Update Password
                        </button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
