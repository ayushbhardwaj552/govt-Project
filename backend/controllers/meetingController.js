import MeetingRequest from '../models/meetingRequestSchema.js';
import User from '../models/userSchema.js';
import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config();

// these two are for the user 
// these two are for the user 
export const createMeetingRequest = async (req, res) => {
  try {
    const {
      mlaId,
      fullName,
      email,
      phone,
      alternatePhone,
      fatherName,
      addressLine1,
      addressLine2,
      pradhanName,
      jobProfile,
      purpose,
      meetingDate
    } = req.body;

    const citizenId = req.user._id;

    // --- Validation ---
    if (
      !mlaId ||
      !fullName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !fatherName?.trim() ||
      !addressLine1?.trim() ||
      !jobProfile?.trim() ||
      !purpose?.trim() ||
      !meetingDate?.trim()
    ) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    const mla = await User.findById(mlaId);
    if (!mla || mla.role !== 'mla') {
      return res.status(404).json({ success: false, message: "MLA not found." });
    }

    // --- FIX: Change const to let for uploadedFiles to allow reassignment ---
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map(file => {
        let type;
        if (file.mimetype.startsWith('image/')) {
          type = 'image';
        } else if (file.mimetype.startsWith('video/')) {
          type = 'video';
        } else if (file.mimetype === 'application/pdf') {
          type = 'pdf';
        }

        if (type) {
          return { url: file.path, fileType: type };
        }
        return null;
      }).filter(file => file !== null);
    }

    const newMeetingRequest = await MeetingRequest.create({
      requestedBy: citizenId,
      mlaId,
      fullName,
      email,
      phone,
      alternatePhone,
      fatherName,
      addressLine1,
      addressLine2,
      pradhanName,
      jobProfile,
      purpose,
      meetingDate,
      mediaFiles: uploadedFiles
    });

    res.status(201).json({
      success: true,
      message: "Meeting request submitted successfully.",
      request: newMeetingRequest,
    });

  } catch (error) {
    console.error("Error creating meeting request:", error);
    res.status(500).json({ success: false, message: "Server error while creating request." });
  }
};


export const getMyMeetingRequestHistory = async (req, res) => {
    try {
        const citizenId = req.user._id;

        // FIX: The query should only use the citizen's ID, not an undefined mlaId
        const requests = await MeetingRequest.find({ requestedBy: citizenId })
            .populate('mlaId', 'fullName constituency')
            .sort({ createdAt: -1 });

        // Categorize requests
        const pendingRequests = requests.filter(r => r.status === 'Pending' || r.status === 'Expired');
        const approvedRequests = requests.filter(r => r.status === 'Approved');
        const rejectedRequests = requests.filter(r => r.status === 'Rejected');

        res.status(200).json({
            success: true,
            requests: {
                pending: pendingRequests,
                approved: approvedRequests,
                rejected: rejectedRequests
            }
        });

    } catch (error) {
        console.error("Error fetching citizen meeting request history:", error);
        res.status(500).json({ success: false, message: "Server error while fetching your history." });
    }
};

// ... (Your other controller functions)
export const getEachMeetingHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const citizenId = req.user._id; // Get the ID of the logged-in citizen

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid request ID." });
        }

        // Fetch the request and populate the MLA's name
        const requestDetails = await MeetingRequest.findById(id).populate({
            path: 'mlaId',
            select: 'fullName' 
        });

        if (!requestDetails) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }
        
        // FIX: Add a security check. Ensure the request belongs to the logged-in user.
        if (requestDetails.requestedBy.toString() !== citizenId.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden: You are not authorized to view this request." });
        }

        // Return the request details
        res.status(200).json({ success: true, request: requestDetails });

    } catch (error) {
        console.error("Error fetching history details:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};