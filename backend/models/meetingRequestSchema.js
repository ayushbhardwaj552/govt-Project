import mongoose from "mongoose";

const meetingRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the Citizen/User who raised the request
      required: true,
    },
    mlaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MLA", // Fixed: Correctly references your separate MLA model
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Invalid phone number. It must be exactly 10 digits."],
      trim: true,
    },
    alternatePhone: {
      type: String,
      match: [/^\d{10}$/, "Invalid alternate phone number. It must be exactly 10 digits."],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, "Address Line 1 is required"],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    pradhanName: {
      type: String,
      trim: true,
    },
    jobProfile: {
      type: String,
      required: [true, "Job profile or profession is required"],
      trim: true,
    },
    purpose: {
      type: String,
      required: [true, "Purpose of the meeting is required"],
      trim: true,
    },
    meetingDate: {
      type: Date,
      required: [true, "Please select a date for the meeting"],
    },
    mediaFiles: [
      {
        url: {
          type: String,
          required: [true, "File URL is required"],
        },
        fileType: {
          type: String,
          enum: ["image", "video", "pdf"],
          lowercase: true,
        },
      },
    ],
    scheduledMeetingTime: {
      type: String, // String is often easier for handling time intervals (e.g., "11:30 AM - 12:00 PM")
      trim: true,
    },
    meetingNotes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Expired"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const MeetingRequest = mongoose.model("MeetingRequest", meetingRequestSchema);
export default MeetingRequest;