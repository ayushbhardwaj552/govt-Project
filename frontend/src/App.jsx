import React from 'react';
import { Routes, Route } from "react-router-dom";

// --- Route Wrappers ---
import ProtectedRoute from './Routes/ProtectedRoute.jsx';
import PublicRoute from './Routes/PublicRoute.jsx';

// --- Page Imports ---
import Homepage from './HomePages/Homepage.jsx';
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";
import PasswordResetSuccessPage from "./pages/Reset_Password_Success.jsx";
import UserDashboard from "./UserDashboard/UserDashboard.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Facilities from "./pages/Facilities.jsx";
import Gallery from "./pages/Gallery.jsx";

// --- MLA Portal Imports ---
import MlaLogin from "./mlaDashboard/MlaLogin.jsx";
import MlaDashboard, { DashboardHome } from "./mlaDashboard/MlaDashboard.jsx";
import MeetingRequests from "./mlaComponents/meetingRequest.jsx";
import MeetingHistory from "./mlaComponents/meetingHistory.jsx" 
import RequestDetails from "./mlaModel/RequestDetails.jsx";
import NewComplaints from "./mlaComponents/NewComplaints.jsx";
import ResolvedComplaints from "./mlaComponents/ResolvedComplaints.jsx";
import NewComplaintDetails from "./mlaModel/NewComplaintDetails.jsx";
import ResolvedComplaintDetails from "./UserView/ResolvedComplaintDetails.jsx";
import ComplaintResponseSuccess from "./mlaComponents/ComplaintResponseSuccess.jsx"
import UpcomingInvitations from "./mlaComponents/UpcomingInvitations.jsx";
import InvitationHistory from "./mlaComponents/InvitationHistory.jsx";
import InvitationDetails from './mlaComponents/InvitationDetails.jsx';
import InvitationResponseSuccess from "./mlaComponents/InvitationResponseSuccess.jsx";
import MlaCalendar from "./Calendar/MlaCalendar.jsx";
import ProfileSettings from "./mlaDashboard/ProfileSetting.jsx"
import PasswordChangeSuccess from "./mlaModel/PasswordChangeSuccess.jsx";

function App() {
  return (
      <Routes>
        {/* --- Main Public Routes (Accessible to everyone) --- */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* --- Authentication Routes (For non-logged-in users) --- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
          <Route path="/mla-login" element={<MlaLogin />} />
        </Route>

        {/* --- User Protected Routes (For logged-in citizens) --- */}
        {/* This assumes UserDashboard.jsx has its own <Routes> for nested paths */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
        </Route>

        {/* --- MLA Protected Routes (For logged-in MLAs) --- */}
        <Route element={<ProtectedRoute role="mla" />}>
          <Route path="/dashboard" element={<MlaDashboard />}>
            <Route index element={<DashboardHome />} />
            
            {/* Meeting Requests */}
            <Route path="requests/new" element={<MeetingRequests />} />
            <Route path="requests/history" element={<MeetingHistory />} />
            <Route path="requests/history/:requestId" element={<RequestDetails />} />
            
            {/* Complaints */}
            <Route path="complaints/new" element={<NewComplaints />} />
            <Route path="complaints/resolved" element={<ResolvedComplaints />} />
            <Route path="complaints/new/:complaintId" element={<NewComplaintDetails />} />
            <Route path="complaints/resolved/:complaintId" element={<ResolvedComplaintDetails />} />
            <Route path="complaints/response-success" element={<ComplaintResponseSuccess />} />
            
            {/* Invitations */}
            <Route path="invitations">
              <Route path="upcoming" element={<UpcomingInvitations />} />
              <Route path="history" element={<InvitationHistory />} />
              <Route path="details/:invitationId" element={<InvitationDetails />} />
              <Route path="response-success" element={<InvitationResponseSuccess />} />
            </Route>
            
            {/* Other Dashboard Pages */}
            <Route path="calendar" element={<MlaCalendar />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="password-change-success" element={<PasswordChangeSuccess />} />
          </Route>
        </Route>

        {/* Fallback Route - Renders if no other route matches */}
        <Route path="*" element={<Homepage />} />
      </Routes>
  );
}

export default App;