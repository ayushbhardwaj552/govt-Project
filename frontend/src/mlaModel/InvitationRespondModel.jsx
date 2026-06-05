import React, { useState } from 'react';
import Icon from '../mlaComponents/Icon.jsx';

const InvitationRespondModal = ({ invitation, onClose, onSubmit }) => {
    const [responseStatus, setResponseStatus] = useState('Accepted'); // 'Accepted' or 'Declined'
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const responseData = { responseStatus, responseMessage };
        
        // *** FIX: Changed invitation.id to invitation._id ***
        // MongoDB uses _id, so we must pass the correct property.
        onSubmit(invitation._id, responseData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up">
                <div className="p-4 border-b bg-gray-50 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Respond to Invitation</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <Icon name="close" />
                    </button>
                </div>
                <div className="p-6">
                    {/* Invitation Details */}
                    <div className="mb-6 bg-gray-100 p-4 rounded-md border border-gray-200">
                        <h3 className="font-bold text-gray-700">Event: {invitation.eventType}</h3>
                        <p className="text-sm text-gray-600"><strong>Invited By:</strong> {invitation.inviterName}</p>
                        <p className="text-sm text-gray-600"><strong>Date & Time:</strong> {new Date(invitation.eventDate).toLocaleDateString()} at {invitation.eventTime}</p>
                        <p className="text-sm text-gray-600"><strong>Location:</strong> {invitation.eventLocation}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Status Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input type="radio" value="Accepted" checked={responseStatus === 'Accepted'} onChange={() => setResponseStatus('Accepted')} className="form-radio text-green-600" />
                                    <span className="ml-2 text-gray-700">Accept</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" value="Declined" checked={responseStatus === 'Declined'} onChange={() => setResponseStatus('Declined')} className="form-radio text-red-600" />
                                    <span className="ml-2 text-gray-700">Decline</span>
                                </label>
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div className="mb-4">
                            <label htmlFor="responseMessage" className="block text-sm font-medium text-gray-700 mb-1">Custom Message (Optional)</label>
                            <textarea
                                id="responseMessage"
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="If you leave this blank, a default message will be sent."
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Submit Response</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InvitationRespondModal;