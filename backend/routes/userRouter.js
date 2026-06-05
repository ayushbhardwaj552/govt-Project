  import express from "express";
  import { login, signup,changePassword,forgotPassword,resetPassword ,getUserProfileById} from "../controllers/userController.js";
  import { mlaLogin, mlaSignup ,getMlaStats,getRecentActivity,changeMlaPassword} from "../controllers/mlaController.js";
  import { requireMLAAuth,requireAuth } from "../middleware/authMiddleware.js";
  import { isLoggedIn } from "../middleware/authMiddleware.js";
  import upload from "../middleware/multer.js";
  import { createMeetingRequest ,getEachMeetingHistory,getMyMeetingRequestHistory} from "../controllers/meetingController.js";
  import { getMlaDashboardHistory,updateMeetingRequestStatus,getMeetingRequestDetails,getMlaProfile } from "../controllers/mlaMeetingController.js";
  import { createComplaint,getComplaintHistory, getMlaComplaintHistory } from "../controllers/complaintController.js";
  import { getInvitationDetails,createInvitation,getInvitationHistory,getMlaInvitationDashboard,getMlaInvitations,respondToInvitation } from "../controllers/invitaionController.js";
  import { getMlaComplaints,respondToComplaint,markComplaintAsRead,getComplaintDetails } from "../controllers/complaintController.js";
  import { createCalendarEvent,getMlaCalendar,updateCalendarEvent,deleteCalendarEvent ,getPublicCalendar} from "../controllers/calenderController.js";
  import { isMLA } from "../middleware/isMLA.js";
  const userRouter = express.Router();


  userRouter.put('/mla/change-password', requireMLAAuth, changeMlaPassword);
  userRouter.post('/mla/calendar/create', requireMLAAuth, createCalendarEvent);
  userRouter.get('/mla/calendar', requireMLAAuth, getMlaCalendar);
  userRouter.put('/mla/calendar/:eventId', requireMLAAuth, updateCalendarEvent);
  userRouter.delete('/mla/calendar/:eventId', requireMLAAuth, deleteCalendarEvent);
  userRouter.get('/profile/:id', requireAuth, getUserProfileById);
  userRouter.get('/mla/stats',requireMLAAuth,getMlaStats);
  userRouter.get('/mla/recent-activity',requireMLAAuth,getRecentActivity);
  userRouter.get('/mla/profile',requireMLAAuth,getMlaProfile);
  // --- Public Calendar Route (Not Protected) ---
  userRouter.get('/public/calendar/:mlaId', getPublicCalendar);

  // Citizen routes
  userRouter.post("/signup",signup);
  userRouter.post("/login", login); 
  userRouter.put('/change-password', requireAuth, changePassword);
  userRouter.post('/forgot-password',requireAuth, forgotPassword); // This now sends an OTP
  userRouter.put('/reset-password',requireAuth, resetPassword);  

  // userRouter.post('/request-meeting', requireAuth, upload.array('media', 5), createMeetingRequest);
  userRouter.post('/request-meeting', requireAuth, createMeetingRequest);
  // This line must have 'requireAuth'
  userRouter.get('/meeting-requests/history', requireAuth, getMyMeetingRequestHistory);
  userRouter.get('/meeting-request/history/:id',requireAuth,getEachMeetingHistory);
  // MLA routes
  userRouter.post("/mla-signup", mlaSignup);
  userRouter.post("/mla-login", mlaLogin);
  userRouter.get('/mla/dashboard', requireMLAAuth, getMlaDashboardHistory);
  userRouter.put('/mla/meeting-requests/:requestId', requireMLAAuth, updateMeetingRequestStatus);
  userRouter.get('/mla/meeting/requests/Details/:requestId', requireAuth, getMeetingRequestDetails);

  // MLA Inviation 
  userRouter.post('/submit-invitation', requireAuth, upload.array('media', 5), createInvitation);
  userRouter.get('/invitations/history', requireAuth, getInvitationHistory);
  userRouter.get('/mla/invitations', requireMLAAuth, getMlaInvitations);
  userRouter.put('/mla/invitations/:invitationId/respond', requireMLAAuth, respondToInvitation);
  userRouter.get('/mla/invitations/dashboard', requireMLAAuth,getMlaInvitationDashboard);
  userRouter.get('/mla/invitations/details/:invitationId', requireMLAAuth,getInvitationDetails);

  // MLA complain 
  userRouter.post('/submit-complaint', requireAuth, upload.array('media', 5), createComplaint);
  userRouter.get('/complaints/history', requireAuth, getComplaintHistory);
  userRouter.get('/mla/complaints', requireMLAAuth, getMlaComplaints);
  userRouter.put('/mla/complaints/:complaintId/read', requireMLAAuth, markComplaintAsRead);
  userRouter.put('/mla/complaints/:complaintId/respond', requireMLAAuth, respondToComplaint);
  userRouter.get('/mla/complaints/:complaintId', requireMLAAuth, getComplaintDetails);
  userRouter.get('/mla/complaints/history', requireMLAAuth, getMlaComplaintHistory);

  userRouter.get("/mla-dashboard", requireMLAAuth, (req, res) => {
    res.json({ message: "Welcome to MLA Dashboard", user: req.user });
  });

  export default userRouter;
