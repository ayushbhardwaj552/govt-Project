import React, { useState, useEffect } from 'react';
import Icon from '../mlaComponents/Icon.jsx';

const CalendarEventModal = ({ isOpen, onClose, onSave, onDelete, eventInfo }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: 'Private Event', // Default to a valid schema value
        location: '',
        startTime: '',
        endTime: '',
        isAllDay: false,
    });

    useEffect(() => {
        if (eventInfo) {
            setFormData({
                title: eventInfo.title || '',
                description: eventInfo.description || '',
                eventType: eventInfo.eventType || 'Private Event',
                location: eventInfo.location || '',
                // Format dates for input[type=datetime-local]
                startTime: eventInfo.start ? new Date(eventInfo.start.valueOf() - eventInfo.start.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '',
                endTime: eventInfo.end ? new Date(eventInfo.end.valueOf() - eventInfo.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '',
                isAllDay: eventInfo.isAllDay || false,
            });
        }
    }, [eventInfo]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, eventInfo?._id);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up">
                <div className="p-4 border-b bg-gray-50 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{eventInfo?._id ? 'Edit Event' : 'Create New Event'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><Icon name="close" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>

                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>

                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                            <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>

                        <div>
                             <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
                             {/* *** FIXED: Option values now match the backend schema enum *** */}
                             <select name="eventType" value={formData.eventType} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                                <option value="Public Meeting">Public Meeting</option>
                                <option value="Private Event">Private Event</option>
                                <option value="Available">Available</option>
                                <option value="Busy">Busy</option>
                             </select>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 w-full p-2 border rounded-md"></textarea>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-4 border-t">
                        <div>
                            {eventInfo?._id && (
                                <button type="button" onClick={() => onDelete(eventInfo._id)} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700">
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Save Event</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalendarEventModal;
