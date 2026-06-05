import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

// A helper component to display each detail field
const DetailRow = ({ label, value }) => {
    if (!value) return null; // Don't render if the value is empty
    return (
        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 text-left">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{value}</dd>
        </div>
    );
};

const SubmissionSuccess = ({ title, data, historyLink, dashboardLink }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
                <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">{title} Submitted Successfully!</h1>
                <p className="mt-2 text-gray-600">Your submission has been received. A confirmation has been sent to your registered email and phone number.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4 text-left">Submission Summary</h2>
                <dl className="divide-y divide-gray-200">
                    {/* Dynamically render all submitted data */}
                    {Object.entries(data).map(([key, value]) => {
                        // Format the key into a readable label
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        if (key !== 'mlaId' && value) { // Don't show mlaId
                            return <DetailRow key={key} label={label} value={value.toString()} />;
                        }
                        return null;
                    })}
                </dl>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <Link to={dashboardLink} className="w-full sm:w-auto text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700">
                    Back to Dashboard
                </Link>
                <Link to={historyLink} className="w-full sm:w-auto text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-gray-300">
                    View History
                </Link>
            </div>
        </div>
    );
};

export default SubmissionSuccess;