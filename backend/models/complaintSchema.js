import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // Link to the citizen submitting the complaint
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Link to the MLA the complaint is for
    mlaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MLA", // Fixed: Correctly references your separate MLA model
      required: true,
    },
    // Details of the person filling the form
    fillerName: {
      type: String,
      required: [true, "Your name is required."],
      trim: true,
    },
    fillerPhone: {
      type: String,
      required: [true, "A contact phone number is required."],
      match: [/^\d{10}$/, "Invalid phone number. It must be exactly 10 digits."],
      trim: true,
    },
    fillerEmail: {
      type: String,
      required: [true, "A contact email is required."],
      trim: true,
      lowercase: true,
    },
    fillerAddress: {
      type: String,
      required: [true, "Your residential address is required."],
      trim: true,
    },
    // Details about the problem
    tehsil: {
      type: String,
      required: [true, "Tehsil is required."],
      trim: true,
    },
    problemLocationAddress: {
      type: String,
      required: [true, "The address of the problem location is required."],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "A detailed message describing the problem is required."],
      trim: true,
    },
    // For multiple file uploads
    mediaFiles: [
      {
        url: { 
          type: String, 
          required: [true, "File URL is required."] 
        },
        fileType: { 
          type: String, 
          enum: ["image", "video", "pdf"], 
          required: [true, "File type is required."],
          lowercase: true,
        }
      },
    ],
    // To track the complaint's progress
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Resolved", "Closed"],
      default: "Submitted",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // To store the MLA's response
    mlaResponse: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;