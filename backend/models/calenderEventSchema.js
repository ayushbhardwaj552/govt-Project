import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
  {
    mlaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MLA", // Fixed: Points to your dedicated MLA model
      required: true,
    },
    title: {
      type: String,
      required: [true, "An event title is required."],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    eventType: {
      type: String,
      enum: ["Available", "Busy", "Public Meeting", "Private Event"],
      required: [true, "Please specify the event type."],
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "A start time is required."],
    },
    endTime: {
      type: Date,
      required: [true, "An end time is required."],
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema);
export default CalendarEvent;