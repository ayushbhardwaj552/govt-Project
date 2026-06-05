
import CalendarEvent from '../models/calenderEventSchema.js';

// --- For MLA to create a new calendar event ---
export const createCalendarEvent = async (req, res) => {
  try {
    const { title, description, eventType, location, startTime, endTime, isAllDay } = req.body;
    const mlaId = req.user._id;

    if (!title || !eventType || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: "Title, event type, start time, and end time are required." });
    }

    const newEvent = await CalendarEvent.create({
      mlaId,
      title,  
      description,
      eventType,
      location,
      startTime,
      endTime,
      isAllDay: isAllDay || false,
    });

    res.status(201).json({ success: true, message: "Event created successfully.", event: newEvent });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    res.status(500).json({ success: false, message: "Server error while creating event." });
  }
};

// --- For MLA to get their own full calendar ---
export const getMlaCalendar = async (req, res) => {
  try {
    const mlaId = req.user._id;
    const events = await CalendarEvent.find({ mlaId }).sort({ startTime: 1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching MLA calendar:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// --- For MLA to update an event ---
export const updateCalendarEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const mlaId = req.user._id;

    const event = await CalendarEvent.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found." });

    if (event.mlaId.toString() !== mlaId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    const updatedEvent = await CalendarEvent.findByIdAndUpdate(eventId, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Event updated successfully.", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// --- For MLA to delete an event ---
export const deleteCalendarEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const mlaId = req.user._id;

    const event = await CalendarEvent.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found." });

    if (event.mlaId.toString() !== mlaId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    await CalendarEvent.findByIdAndDelete(eventId);
    res.status(200).json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// --- For the PUBLIC to view an MLA's calendar ---
export const getPublicCalendar = async (req, res) => {
  try {
    const { mlaId } = req.params;
    // Show all public events (all event types except PERSONAL)
    const publicEvents = await CalendarEvent.find({
      mlaId,
      eventType: { $ne: 'PERSONAL' } // Show everything except personal events
    }).select('-mlaId -createdAt -updatedAt -__v').sort({ startTime: 1 });

    res.status(200).json({ success: true, events: publicEvents }); // Changed 'calendar' to 'events' to match frontend
  } catch (error) {
    console.error("Error fetching public calendar:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
