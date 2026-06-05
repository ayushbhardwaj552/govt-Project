import React from 'react';
import { Link } from 'react-router-dom';
import { FiFilePlus, FiMessageCircle, FiSend, FiEye } from 'react-icons/fi';

const ActionCard = ({ icon, title, description, linkTo, buttonText }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 text-orange-500 rounded-full text-2xl">
                {icon}
            </div>
            <h2 className="ml-4 text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600 flex-grow">{description}</p>
        <Link to={linkTo} className="mt-6 bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 text-center">
            {buttonText}
        </Link>
    </div>
);

const UserDashboardHome = () => {
    return (
        <div className="p-2 sm:p-4">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
                <p className="text-base sm:text-lg text-gray-600 mt-2">Connect with your MLA, track your requests, and stay informed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <ActionCard
                    icon={<FiFilePlus />}
                    title="Request a Meeting"
                    description="Schedule an appointment to discuss important matters directly with your MLA."
                    linkTo="meeting-requests/create"
                    buttonText="Create Request"
                />
                <ActionCard
                    icon={<FiMessageCircle />}
                    title="File a Complaint"
                    description="Report local issues or grievances for official review and action."
                    linkTo="complaints/create"
                    buttonText="File Complaint"
                />
                <ActionCard
                    icon={<FiSend />}
                    title="Send an Invitation"
                    description="Invite your MLA to a community event, inauguration, or other function."
                    linkTo="invitations/create"
                    buttonText="Send Invitation"
                />
            </div>
            
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Your History</h2>
                 <p className="text-gray-600 mb-6">View the status of all your past interactions in one place.</p>
                 <div className="flex flex-wrap gap-4">
                     <Link to="meeting-requests/history" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Meeting Request History</Link>
                     <Link to="complaints/history" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Complaint History</Link>
                     <Link to="invitations/history" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Invitation History</Link>
                 </div>
            </div>
        </div>
    );
};

export default UserDashboardHome;