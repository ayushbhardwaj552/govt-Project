
import Complaint from '../models/complaintSchema.js';
import User from '../models/userSchema.js';
import sendEmail from '../utils/sendEmail.js'; // Import the email utility
import sendSms from '../utils/sendSms.js';
export const createComplaint = async (req, res) => {
  try {
    const {
      mlaId,
      fillerName,
      fillerPhone,
      fillerEmail,
      fillerAddress,
      tehsil,
      problemLocationAddress,
      message
    } = req.body;

    const citizenId = req.user._id; // From requireAuth middleware

    // --- Validation ---
    if (!mlaId || !fillerName || !fillerPhone || !fillerEmail || !fillerAddress || !tehsil || !problemLocationAddress || !message) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    // Check if the mlaId is valid and belongs to an MLA
    const mla = await User.findById(mlaId);
    if (!mla || mla.role !== 'mla') {
      return res.status(404).json({ success: false, message: "MLA not found." });
    }

    // --- File Handling Logic ---
    const uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        let type;
        if (file.mimetype.startsWith('image/')) type = 'image';
        else if (file.mimetype.startsWith('video/')) type = 'video';
        else if (file.mimetype === 'application/pdf') type = 'pdf';
        
        if (type) {
          uploadedFiles.push({ url: file.path, fileType: type });
        }
      });
    }

    // --- Create the new complaint ---
    const newComplaint = await Complaint.create({
      submittedBy: citizenId,
      mlaId,
      fillerName,
      fillerPhone,
      fillerEmail,
      fillerAddress,
      tehsil,
      problemLocationAddress,
      message,
      mediaFiles: uploadedFiles
    });

    // --- Send Confirmation Email ---
    try {
      const emailSubject = `Complaint Received: Regarding ${newComplaint.problemLocationAddress}`;
      const emailMessage = `Dear ${newComplaint.fillerName},\n\nThis email confirms that we have successfully received your complaint regarding the issue at ${newComplaint.problemLocationAddress}.\n\nYour complaint is now being processed. You can check its status in your history page.\n\nThank you for bringing this to our attention.\n\nSincerely,\nMLA Office`;
      
      await sendEmail({
        email: newComplaint.fillerEmail,
        subject: emailSubject,
        message: emailMessage,
      });
    } catch (notificationError) {
      console.error("Complaint created, but failed to send confirmation email.", notificationError);
    }

    res.status(201).json({
      success: true,
      message: "Your complaint has been submitted successfully. A confirmation email has been sent.",
      complaint: newComplaint,
    });

  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ success: false, message: "Server error while submitting your complaint." });
  }
};


export const getComplaintHistory = async (req, res) => {
  try {
    const citizenId = req.user._id; // From requireAuth middleware

    const complaints = await Complaint.find({ submittedBy: citizenId })
      .populate('mlaId', 'fullName') // Show the MLA's name
      .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error("Error fetching complaint history:", error);
    res.status(500).json({ success: false, message: "Server error while fetching complaint history." });
  }
};



// --- Get all complaints for the logged-in MLA ---
export const getMlaComplaints = async (req, res) => {
  try {
    const mlaId = req.user._id;

    const allComplaints = await Complaint.find({ mlaId: mlaId })
      .populate('submittedBy', 'fullName email phone')
      .sort({ createdAt: -1 });

    const unreadComplaints = allComplaints.filter(c => !c.isRead);
    const readComplaints = allComplaints.filter(c => c.isRead);

    res.status(200).json({
      success: true,
      data: {
        unreadComplaints,
        readComplaints,
      },
      summary: {
        total: allComplaints.length,
        unread: unreadComplaints.length,
        read: readComplaints.length,
      }
    });
  } catch (error) {
    console.error("Error fetching MLA complaints:", error);
    res.status(500).json({ success: false, message: "Server error while fetching complaints." });
  }
};

// --- Mark a complaint as read (can be used for viewing details) ---
export const markComplaintAsRead = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const mlaId = req.user._id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (complaint.mlaId.toString() !== mlaId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    if (!complaint.isRead) {
      complaint.isRead = true;
      await complaint.save();
    }

    res.status(200).json({
      success: true,
      message: "Complaint marked as read.",
      complaint,
    });
  } catch (error) {
    console.error("Error marking complaint as read:", error);
    res.status(500).json({ success: false, message: "Server error while updating complaint." });
  }
};


// In your complaint controller file (e.g., controllers/complaintController.js)


export const getComplaintDetails = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const mlaId = req.user._id;

    const complaint = await Complaint.findById(complaintId)
      .populate('submittedBy','email phone');

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (complaint.mlaId.toString() !== mlaId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });

  } catch (error) {
    console.error("Error fetching complaint details:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
// --- NEW FUNCTION: Respond to a complaint and send notifications ---

export const respondToComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    // The key here is 'responseMessage' to match what the modal sends
    const { responseMessage } = req.body; 
    const mlaId = req.user._id;

    if (!responseMessage) {
      return res.status(400).json({ success: false, message: "A response message is required." });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (complaint.mlaId.toString() !== mlaId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden. You cannot respond to this complaint." });
    }

    // --- KEY LOGIC ---
    // 1. Mark the complaint as read
    complaint.isRead = true; 
    // 2. Change the status so it appears in the history/resolved list
    complaint.status = 'Under Review'; // Or 'Replied', 'Resolved', etc.
    // 3. Save the MLA's response message
    complaint.mlaResponse = responseMessage;
    
    await complaint.save();

    // --- (Optional but Recommended) Send notifications to the citizen ---
    try {
      const emailSubject = `An update on your complaint regarding: ${complaint.problemLocationAddress}`;
      const emailMessage = `Dear ${complaint.fillerName},\n\nThe MLA's office has responded to your complaint.\n\nResponse: "${responseMessage}"\n\nYour complaint status has been updated to '${complaint.status}'.\n\nThank you.`;
      const smsMessage = `You have a new response from the MLA's office regarding your complaint. Please check your email for details.`;

      await sendEmail({ email: complaint.fillerEmail, subject: emailSubject, message: emailMessage });
      // await sendSms(complaint.fillerPhone, smsMessage); // Uncomment if SMS is configured
    } catch (notificationError) {
      console.error("Complaint response saved, but failed to send notifications.", notificationError);
    }

    res.status(200).json({
      success: true,
      message: "Your response has been saved and sent to the citizen.",
      complaint,
    });

  } catch (error) {
    console.error("Error responding to complaint:", error);
    res.status(500).json({ success: false, message: "Server error while responding to complaint." });
  }
};
// NEW FUNCTION to get the history of all replied-to/actioned complaints
export const getMlaComplaintHistory = async (req, res) => {
  try {
    const mlaId = req.user._id;

    // Find all complaints for this MLA that are NOT 'Pending'
    const complaints = await Complaint.find({ 
      mlaId: mlaId, 
      status: { $ne: 'Pending' } 
    }).sort({ updatedAt: -1 }); // Sort by most recently updated

    res.status(200).json({
      success: true,
      data: complaints,
    });

  } catch (error) {
    console.error("Error fetching complaint history:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};