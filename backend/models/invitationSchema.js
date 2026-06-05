import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the Citizen/User who sent the invitation
      required: true,
    },
    mlaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MLA", // Fixed: Points cleanly to your separate MLA model
      required: true,
    },
    inviterName: {
      type: String,
      required: [true, "Inviter name is required"],
      trim: true,
    },
    inviterPhone: {
      type: String,
      required: [true, "Inviter phone number is required"],
      match: [/^\d{10}$/, "Invalid phone number. It must be exactly 10 digits."],
      trim: true,
    },
    inviterEmail: {
      type: String,
      required: [true, "Inviter email is required"],
      trim: true,
      lowercase: true,
    },
    jobProfile: {
      type: String,
      required: [true, "Job profile or profession is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject of the invitation is required"],
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    eventTime: {
      type: String,
      required: [true, "Event time is required"],
      trim: true,
    },
    eventLocation: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Invitation message is required"],
      trim: true,
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
    status: {
      type: String,
      enum: ["Sent", "Seen", "Accepted", "Declined", "Expired"],
      default: "Sent",
    },
    mlaResponse: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { 
    timestamps: true // Replaced the manual createdAt field with native Mongoose tracking (adds createdAt and updatedAt automatically)
  }
);

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;