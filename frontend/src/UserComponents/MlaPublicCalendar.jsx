import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Modal to show event details
const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    const formatDate = (date) => moment(date).format('dddd, MMMM Do YYYY');
    const formatTime = (date) => moment(date).format('h:mm A');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up">
                <div className="p-4 border-b bg-gray-100 rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                    <p className="text-sm text-gray-600">{event.eventType}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <strong className="text-gray-700">Date:</strong>
                        <p>{formatDate(event.start)}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Time:</strong>
                        <p>{`${formatTime(event.start)} - ${formatTime(event.end)}`}</p>
                    </div>
                    {event.location && (
                        <div>
                            <strong className="text-gray-700">Location:</strong>
                            <p>{event.location}</p>
                        </div>
                    )}
                    {event.description && (
                        <div>
                            <strong className="text-gray-700">Description:</strong>
                            <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gray-50 rounded-b-lg text-right">
                    <button 
                        onClick={onClose} 
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Custom styled calendar event
const StyledEvent = ({ event }) => (
    <div className="p-1">
        <strong className="font-semibold">{event.title}</strong>
        <p className="text-xs italic">{event.eventType}</p>
    </div>
);

const MlaPublicCalendar = () => {
    const mlaId = import.meta.env.VITE_MLA_ID || "" // ✅ useParams for MLA ID
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
         console.log(mlaId);
        if (!mlaId) {
            setError("No MLA ID provided in the URL.");
            setLoading(false);
            return;
        }

        const fetchPublicCalendar = async () => {
            try {
                setLoading(true);
                setError(null);
               
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/public/calendar/${mlaId}`);
                if (!res.ok) {
                    throw new Error("Could not fetch the MLA's public calendar.");
                }

                const data = await res.json();
                if (data.success) {
                    const formattedEvents = (data.events || []).map(e => ({
                        ...e,
                        start: new Date(e.startTime),
                        end: new Date(e.endTime),
                    }));
                    setEvents(formattedEvents);
                } else {
                    throw new Error(data.message || "Failed to load calendar data");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicCalendar();
    }, [mlaId]);

    const eventStyleGetter = (event) => {
        let style = {
            backgroundColor: '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        if (event.eventType === 'Public Meeting') style.backgroundColor = '#28a745';
        if (event.eventType === 'Available') {
            style.backgroundColor = '#ffc107';
            style.color = '#212529';
        }
        return { style };
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading calendar...</div>;
    if (error) return <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;

    return (
        <>
            <style>{`
                .rbc-toolbar button { background-color: #f0f0f0; border: 1px solid #ccc; color: #333; padding: 8px 16px; border-radius: 5px; transition: background-color 0.2s; }
                .rbc-toolbar button:hover, .rbc-toolbar button:focus { background-color: #e0e0e0; }
                .rbc-toolbar button.rbc-active { background-color: #007bff; color: white; box-shadow: inset 0 3px 5px rgba(0,0,0,0.125); }
                .rbc-header { background-color: #f8f9fa; padding: 10px 5px; font-weight: bold; border-bottom: 2px solid #dee2e6; }
                .rbc-today { background-color: #eaf6ff; }
            `}</style>

            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">MLA Public Calendar</h1>
                    <p className="text-gray-600 mt-2">Public meetings and availability schedule.</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl" style={{ height: '75vh' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        views={['month', 'week', 'day']}
                        tooltipAccessor={event => `${event.eventType}: ${event.title}`}
                        eventPropGetter={eventStyleGetter}
                        onSelectEvent={handleSelectEvent}
                        components={{ event: StyledEvent }}
                    />
                </div>
            </div>

            <EventDetailsModal 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
            />
        </>
    );
};

export default MlaPublicCalendar;
