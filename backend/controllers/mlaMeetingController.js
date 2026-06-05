import MeetingRequest from "../models/meetingRequestSchema.js";
import User from "../models/userSchema.js";
import sendSms from "../utils/sendSms.js";
import sendEmail from "../utils/sendEmail.js"

export const getMlaDashboardHistory = async (req, res) => {
  try {
    const mlaId = req.user._id;
    const now = new Date();

    // --- Step 1: Automatically update expired requests ---
    // Find all 'Pending' requests for this MLA where the meeting date is in the past.
    await MeetingRequest.updateMany(
      { mlaId: mlaId, status: 'Pending', meetingDate: { $lt: now } },
      { $set: { status: 'Expired' } }
    );

    // --- Step 2: Fetch all requests for the MLA ---
    const allRequests = await MeetingRequest.find({ mlaId: mlaId })
      .populate('requestedBy', 'fullName email phone') // Get citizen details
      .sort({ createdAt: -1 });

    // --- Step 3: Categorize the requests ---
    const pendingRequests = allRequests.filter(r => r.status === 'Pending');
    const approvedRequests = allRequests.filter(r => r.status === 'Approved');
    const rejectedRequests = allRequests.filter(r => r.status === 'Rejected');
    const completedRequests = allRequests.filter(r => r.status === 'Completed');
    const expiredRequests = allRequests.filter(r => r.status === 'Expired');

    res.status(200).json({
      success: true,
      data: {
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        completedRequests,
        expiredRequests,
      },
      summary: {
        total: allRequests.length,
        pending: pendingRequests.length,
        approved: approvedRequests.length,
        rejected: rejectedRequests.length,
        completed: completedRequests.length,
        expired: expiredRequests.length,
      }
    });

  } catch (error) {
    console.error("Error fetching MLA dashboard history:", error);
    res.status(500).json({ success: false, message: "Server error while fetching dashboard data." });
  }
};


// --- NEW FUNCTION: Update the status of a meeting request ---
export const updateMeetingRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, scheduledDate, scheduledTime, meetingNotes } = req.body;
    const mlaId = req.user._id;

    // 1. Validate status
    const allowedStatuses = ['Approved', 'Rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid or missing status provided. Must be 'Approved' or 'Rejected'." });
    }

    // 2. Find the request
    const request = await MeetingRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Meeting request not found." });
    }

        // --- NEW FEATURE: Check if the request has already been actioned ---
    if (request.status !== 'Pending') {
      return res.status(400).json({ 
        success: false, 
        message: `This request has already been processed (Status: ${request.status}) and cannot be changed.` 
      });
    }
    
    // 3. Security Check
    if (request.mlaId.toString() !== mlaId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: You are not authorized to update this request." });
    }

    let emailSubject = '';
    let emailMessage = '';
    let smsMessage = '';

    // 4. Handle logic based on status
    if (status === 'Approved') {
      // For 'Approved', a new date and time are required
      if (!scheduledDate || !scheduledTime) {
        return res.status(400).json({ success: false, message: "For approved requests, please provide a 'scheduledDate' (YYYY-MM-DD) and 'scheduledTime' (HH:MM)." });
      }
      
      const scheduledMeetingTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
      
      // Update the request document
      request.status = 'Approved';
      request.scheduledMeetingTime = scheduledMeetingTime;
      request.meetingNotes = meetingNotes || 'No additional notes.';
      
      // Prepare notifications
      emailSubject = 'Your Meeting Request has been Approved';
      const formattedDate = scheduledMeetingTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = scheduledMeetingTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      emailMessage = `Dear ${request.fullName},\n\nYour meeting request regarding "${request.purpose}" has been approved.\n\nThe meeting is scheduled for:\nDate: ${formattedDate}\nTime: ${formattedTime}\n\nNotes from the MLA's office: ${request.meetingNotes}\n\nThank you.`;
      smsMessage = `Your meeting with the MLA has been confirmed for ${formattedDate} at ${formattedTime}. Please check your email for details.`;

    } else if (status === 'Rejected') {
      // Update the request document
      request.status = 'Rejected';
      request.meetingNotes = meetingNotes || 'No reason provided.';

      // Prepare notifications
      emailSubject = 'Update on Your Meeting Request';
      emailMessage = `Dear ${request.fullName},\n\nRegarding your meeting request for "${request.purpose}", we regret to inform you that we are unable to schedule a meeting at this time.\n\nNotes from the MLA's office: ${request.meetingNotes}\n\nThank you for your understanding.`;
      smsMessage = `Regarding your meeting request, we regret that we are unable to schedule a meeting at this time. Please check your email for details.`;
    }

    // 5. Save the changes to the database
    await request.save();

    // 6. Send the notifications (wrapped in a try/catch so the main response doesn't fail)
    try {
      await sendEmail({ email: request.email, subject: emailSubject, message: emailMessage });
      await sendSms(request.phone, smsMessage);
    } catch (notificationError) {
      console.error("Failed to send notifications, but request status was updated.", notificationError);
    }

    res.status(200).json({
      success: true,
      message: `Request status successfully updated to '${status}' and notifications have been sent.`,
      request,
    });

  } catch (error) {
    console.error("Error updating meeting request status:", error);
    res.status(500).json({ success: false, message: "Server error while updating status." });
  }
};

// Add this function to your existing MLA controller file

export const getMeetingRequestDetails = async (req, res) => {
  try {
    const { requestId } = req.params; // Get the ID from the URL (e.g., /api/.../6895c272661583c00aea3118)
    const mlaId = "68946e516968d9365cf6b2f3";

    // 1. Find the request by its ID and populate the citizen's details
    const request = await MeetingRequest.findById(requestId)
      .populate('requestedBy', 'fullName email phone');

    // 2. Handle case where the request is not found
    if (!request) {
      return res.status(404).json({ success: false, message: "Meeting request not found." });
    }

    // 3. Security Check: Ensure the logged-in MLA is the one assigned to this request
    if (request.mlaId.toString() !== mlaId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: You are not authorized to view this request." });
    }

    // 4. Send the successful response
    res.status(200).json({
      success: true,
      data: request,
    });

  } catch (error) {
    console.error("Error fetching meeting request details:", error);
    res.status(500).json({ success: false, message: "Server error while fetching request details." });
  }
};


export const getMlaProfile = async (req, res) => {
    try {
        // ✅ If requireMLAAuth middleware attaches user to req.user
        const mlaId = req.user?._id || "68946e516968d9365cf6b2f3"; 

        // ✅ Fetch MLA from DB
        const mlaUser = await User.findById(mlaId).select("-password -confirmPassword"); 
        if (!mlaUser) {
            return res.status(404).json({
                success: false,
                message: "MLA profile not found",
            });
        }

        // ✅ Build profile object
        const userProfile = {
            fullName: mlaUser.fullName,
            email: mlaUser.email,
            phone: mlaUser.phone?.number, // optional chaining
            gender: mlaUser.gender,
            address: mlaUser.address,
            role: mlaUser.role,
            mlaKey: mlaUser.mlaKey,
        };

        res.status(200).json({
            success: true,
            profile: userProfile,
        });

    } catch (error) {
        console.error("Error fetching MLA profile:", error);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred while fetching the profile.",
        });
    }
};

