// Keep React import for compatibility with both old & new JSX transform
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import CalendarEventModal from "./CalendarEventModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const localizer = momentLocalizer(moment);


// --- Main Calendar Component ---
const MlaCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // State to manage the calendar's view for responsiveness
  const [calendarView, setCalendarView] = useState('month');
  const { mlaToken } = useAuth();

  // --- RESPONSIVENESS EFFECT ---
  // This effect checks the window size and adjusts the calendar view.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCalendarView('day');
      } else {
        setCalendarView('month');
      }
    };

    // Set the initial view based on the current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // --- FETCH EVENTS ---
  const loadEvents = async () => {
    if (!mlaToken) return;
    try {
      // *** FIXED: Corrected the fetch URL to match your userRouter.js ***
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/mla/calendar`, {
        headers: { Authorization: `Bearer ${mlaToken}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        const formattedEvents = data.events.map((e) => ({
          ...e,
          start: new Date(e.startTime),
          end: new Date(e.endTime),
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [mlaToken]);

  // --- EVENT HANDLERS ---
  const handleSelectSlot = (slotInfo) => {
    setSelectedEvent({ start: slotInfo.start, end: slotInfo.end });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // --- CREATE OR UPDATE EVENT ---
  const handleSaveEvent = async (formData, eventId) => {
    // *** FIXED: Corrected the URLs for both creating and updating events ***
    const url = eventId
      ? `${import.meta.env.VITE_API_URL}/api/auth/mla/calendar/${eventId}`
      : `${import.meta.env.VITE_API_URL}/api/auth/mla/calendar/create`;

    const method = eventId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mlaToken}`,
        },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
        }),
      });

      const result = await res.json();
      if (result.success) {
        loadEvents(); // Reload events to show the new/updated one
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }

    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // --- DELETE EVENT ---
  const handleDeleteEvent = async (eventId) => {
    // Using a custom modal/confirm dialog is recommended over window.confirm
    // but for this example, we'll keep it simple.
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        // *** FIXED: Corrected the URL for deleting an event ***
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/mla/calendar/${eventId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${mlaToken}` },
          }
        );

        const result = await res.json();
        if (result.success) {
          loadEvents(); // Reload events to remove the deleted one
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  // --- RENDER METHOD ---
  return (
    // Use min-h-screen for better mobile layout, and responsive padding
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">My Calendar</h1>
      {/* Container for the calendar with responsive height.
        h-[65vh] for small screens, h-[75vh] for medium and up.
      */}
      <div
        className="bg-white p-2 sm:p-4 rounded-lg shadow-md h-[65vh] md:h-[75vh]"
      >
        <Calendar
          localizer={localizer}
          events={events}
          titleAccessor="title"
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          // Responsive view props
          view={calendarView}
          onView={(view) => setCalendarView(view)}
        />
      </div>

      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        eventInfo={selectedEvent}
      />
    </div>
  );
};

export default MlaCalendar;
