import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import UserDashboardHome from './UserDashboardHome.jsx';
import UserDashboardLayout from './UserDashboardLayout.jsx';

import CreateMeetingRequest from '../UserComponents/CreateMeetingRequest.jsx';
import UserMeetingHistory from '../UserComponents/UserMeetingHistory.jsx';
import CreateComplaint from '../UserComponents/CreateComplaint.jsx';
import UserComplaintHistory from '../UserComponents/UserComplaintHistory.jsx';
import CreateInvitation from '../UserComponents/CreateInvitation.jsx';
import UserInvitationHistory from '../UserComponents/UserInvitationHistory.jsx';
import MlaPublicCalendar from '../UserComponents/MlaPublicCalendar.jsx';
import UserProfile from '../UserComponents/UserProfile.jsx';
import HistoryDetailsPage from '../UserView/HistoryDetailsPage.jsx';

const UserDashboard = () => {
    return (
        <UserDashboardLayout>
            <Routes>
                <Route path="/" element={<UserDashboardHome />} />

                <Route path="meeting-requests">
                    <Route path="create" element={<CreateMeetingRequest />} />
                    <Route path="history" element={<UserMeetingHistory />} />
                </Route>

                <Route path="history">
                    <Route path="meeting/:id" element={<HistoryDetailsPage />} />
                    <Route path="complaint/:id" element={<HistoryDetailsPage />} />
                    <Route path="invitation/:id" element={<HistoryDetailsPage />} />
                </Route>

                <Route path="complaints">
                    <Route path="create" element={<CreateComplaint />} />
                    <Route path="history" element={<UserComplaintHistory />} />
                </Route>

                <Route path="invitations">
                    <Route path="create" element={<CreateInvitation />} />
                    <Route path="history" element={<UserInvitationHistory />} />
                </Route>

                {/* MLA calendar is now correctly routed with mlaId */}
                <Route path="mla-calendar/68946e516968d9365cf6b2f3" element={<MlaPublicCalendar />} />

                <Route path="user-profile/:id" element={<UserProfile />} />
            </Routes>
            <Outlet />
        </UserDashboardLayout>
    );
};

export default UserDashboard;
