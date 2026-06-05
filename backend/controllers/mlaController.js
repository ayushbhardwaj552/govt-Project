import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import Complaint from "../models/complaintSchema.js";
import MeetingRequest from "../models/meetingRequestSchema.js";
import Invitation from "../models/invitationSchema.js";

// Signup - MLA

// Signup - MLA
export const mlaSignup = async (req, res) => {
    // ... your existing mlaSignup code ...
    try {
        const { fullName, email, password, confirmPassword, phone,gender, address, mlaKey } = req.body;
    
        // Check secret key
        if (mlaKey !== process.env.MLA_SECRET_KEY) {
          return res.status(403).json({ success: false, message: "Unauthorized: Invalid MLA Key" });
        }
    
        // Check required fields
        if (!fullName || !email || !password || !confirmPassword || !gender  || !phone || !address) {
          return res.status(400).json({ success: false, message: "All fields are required" });
        }
    
        if (password !== confirmPassword) {
          return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ success: false, message: "Email already registered" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await User.create({
          fullName,
          email,
          password: hashedPassword,
          phone,
          gender,
          address,
          role: "mla", // set role
        });
    
        const token = jwt.sign({ userId: newUser._id, role: "mla" }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
    
        res.status(201).json({
          success: true,
          message: "MLA registered successfully",
          token,
          user: {
            id: newUser._id,
            name: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
          },
        });
      } catch (error) {
        console.error("MLA Signup Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
};

// Login - MLA
export const mlaLogin = async (req, res) => {
    // ... your existing mlaLogin code ...
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ success: false, message: "Please enter all entries" });
        }
    
        const user = await User.findOne({ email, role: "mla" });
        if (!user) {
          return res.status(401).json({ success: false, message: "Invalid credentials or not an MLA" });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    
        // --- FIX: Create the token with 'userId' for consistency ---
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
    
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
    
        res.status(200).json({
          success: true,
          message: "MLA login successful",
          token,
          user,
        });
      } catch (err) {
        res.status(500).json({ message: "MLA login failed", error: err.message });
      }
};


export const getMlaStats = async (req, res) => {
    try {
        // ✅ FIX 2: Changed `req.user.userId` to `req.user._id`
        // The middleware attaches the full user document, where the ID is stored in the `_id` field.
        const mlaId = process.env.MLA_ID;

        // Database Queries
        // Note: I've changed "Meeting" to "MeetingRequest" to match your file names.
        const newComplaintsCount = await Complaint.countDocuments({ mlaId: mlaId, status: 'Pending' });
        const pendingMeetingsCount = await MeetingRequest.countDocuments({ mlaId: mlaId, status: 'Pending' });
        const upcomingInvitationsCount = await Invitation.countDocuments({ mlaId: mlaId, status: { $in: ['Sent', 'Seen'] } });

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const resolvedThisMonthCount = await Complaint.countDocuments({
            mlaId: mlaId,
            status: 'Under Review', // Assuming 'Under Review' or 'Resolved' means it's actioned
            updatedAt: { $gte: startOfMonth } // Using 'updatedAt' is more reliable than a custom date field
        });

        const stats = {
            newComplaints: newComplaintsCount,
            pendingMeetings: pendingMeetingsCount,
            upcomingInvitations: upcomingInvitationsCount,
            resolvedThisMonth: resolvedThisMonthCount,
        };

        res.status(200).json({
            success: true,
            stats: stats,
        });

    } catch (error) {
        console.error('Error fetching MLA stats:', error);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred while fetching stats.',
        });
    }
};

// --- NEW FUNCTION: Get Recent Activity for Dashboard ---
export const getRecentActivity = async (req, res) => {
    try {
        const mlaId = process.env.MLA_ID ; //"68946e516968d9365cf6b2f3";

        // Fetch the 3 most recent complaints
        const recentComplaints = await Complaint.find({ mlaId: mlaId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('fillerName createdAt');

        // Fetch the 3 most recent meeting requests
        const recentMeetings = await MeetingRequest.find({ mlaId: mlaId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('fullName createdAt');

        // Format and combine the activities
        const complaintsActivity = recentComplaints.map(c => ({
            _id: c._id,
            message: `New complaint from ${c.fillerName}`,
            createdAt: c.createdAt,
            type: 'complaint'
        }));

        const meetingsActivity = recentMeetings.map(m => ({
            _id: m._id,
            message: `New meeting request from ${m.fullName}`,
            createdAt: m.createdAt,
            type: 'meeting'
        }));

        // Combine, sort by date, and take the 5 most recent
        const allActivities = [...complaintsActivity, ...meetingsActivity]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        res.status(200).json({ success: true, activities: allActivities });

    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching activity.' });
    }
};

// --- NEW FUNCTION: Change MLA Password ---
export const changeMlaPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const mlaId = req.user._id; // Get ID from the authenticated user

        // 1. Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All password fields are required." });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "New password and confirm password do not match." });
        }

        // 2. Find the user in the database
        const user = await User.findById(mlaId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // 3. Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password." });
        }

        // 4. Hash and update the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully." });

    } catch (error) {
        console.error('Error changing MLA password:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};