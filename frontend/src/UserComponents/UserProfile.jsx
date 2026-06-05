import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import { FiUser, FiMail, FiPhone, FiEdit, FiMapPin } from 'react-icons/fi';
import { BsGenderAmbiguous } from 'react-icons/bs';

const ProfileDetailRow = ({ icon, label, value }) => {
    // FIX: Conditionally check for a nested phone number
    if (label === 'Phone Number' && value && typeof value === 'object') {
        value = value.number;
    }
    if (!value) return null;
    return (
        <div className="flex items-center py-4">
            <div className="text-gray-500 mr-4 text-xl">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-md text-gray-900">{value}</p>
            </div>
        </div>
    );
};

const UserProfile = () => {
    const { id } = useParams(); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token || !id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch profile data.');
                }
                
                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    throw new Error(data.message || 'User data not found in response.');
                }

            } catch (err) {
                console.error("Profile fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token, id]); 

    if (loading) {
        return <div className="p-8 text-center">Loading Profile...</div>;
    }

    if (error || !user) {
        return (
             <div className="max-w-2xl mx-auto p-4">
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                     <strong className="font-bold">Error: </strong>
                     <span className="block sm:inline">{error || "User not found or ID is missing."}</span>
                 </div>
             </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <FiUser className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{user.fullName || 'User Profile'}</h1>
                        <p className="text-md text-gray-500">{user.role || 'Citizen'}</p>
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h2>
                    <div className="divide-y divide-gray-200">
                        <ProfileDetailRow icon={<FiUser />} label="Full Name" value={user.fullName} />
                        <ProfileDetailRow icon={<FiMail />} label="Email Address" value={user.email} />
                        <ProfileDetailRow icon={<FiPhone />} label="Phone Number" value={user.phone} />
                        <ProfileDetailRow icon={<BsGenderAmbiguous />} label="Gender" value={user.gender} />
                        <ProfileDetailRow icon={<FiMapPin />} label="Address" value={user.address} />
                    </div>
                </div>
                <div className="p-6 bg-gray-50 text-right">
                    <button className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">
                        <FiEdit />
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;