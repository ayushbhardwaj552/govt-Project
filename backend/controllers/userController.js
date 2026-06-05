import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import sendSms from "../utils/sendSms.js";
import * as crypto from 'crypto';

// Signup - Citizen
import generateTokenAndSetCookie from "../config/utils.js"


export const signup = async (req, res) => {
  try {
    const { email, fullName, password, confirmPassword, phone, gender, district, address } = req.body;

    // --- Basic Validation ---
    if (!email || !fullName || !password || !confirmPassword || !phone || !gender || !address) {
      return res.status(400).json({
        success: false,
        message: "Please enter all entries",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Your password and confirm password do not match.",
      });
    }

    // --- Check for Existing User ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    // --- Hash Password ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Create and Save New User ---
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      // **FIX: Format the phone number to match the schema**
      // The frontend sends `phone` as a string, but the schema expects an object.
      phone: { number: phone },
      gender,
      district,
      address,
      role: "citizen",
    });

    if (newUser) {
      // Generate JWT Token
      const token = generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      // Send User Data and Token in Response
      res.status(201).json({
        success: true,
        message: "Citizen registered successfully.",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
        },
        token: token,
      });

    } else {
       res.status(400).json({ message: "Invalid user data" });
    }

  } catch (err) {
    console.error("Error in signup controller: ", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};


// --- UPDATED LOGIN FUNCTION ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all entries" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // --- Send Notifications ---
    try {
      const emailMessage = `Hello, ${user.fullName}!\n\nWe detected a new login to your account. If this was not you, please secure your account immediately.`;
      await sendEmail({
        email: user.email,
        subject: 'Security Alert: New Login to Your Account',
        message: emailMessage,
      });

      const smsMessage = `Hello, ${user.fullName}! A new login to your e-Services account was detected.`;
      await sendSms(user.phone.number, smsMessage);
    } catch (notificationError) {
      console.error("Login: Failed to send notifications.", notificationError);
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


// ... rest of the file

export const changePassword = async (req, res) => {
  try {
    const { previousPassword, password, confirmPassword } = req.body;

    // Check if all fields are present
    if (!previousPassword || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if new passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Get user from DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare previous password
    const isMatch = await bcrypt.compare(previousPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- STEP 1: Request OTP for Forgot Password ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide an email address." });
    }

    const user = await User.findOne({ email });
    // In your backend's userController.js

if (!user) {
  // Change this from a success message to a 404 error
  return res.status(404).json({ success: false, message: 'This email is not registered with us.' });
}
    if (!user) {
      // To prevent email enumeration attacks, we send a success response even if the user doesn't exist.
      return res.status(200).json({ success: true, message: "If an account with that email exists, an OTP has been sent." });
    }

    // Generate and save the OTP
    const otp = user.getResetPasswordOtp();
    await user.save({ validateBeforeSave: false });

    // --- Send Notifications ---
    try {
        // Send the OTP to the user's email
        const emailMessage = `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: 'Your Password Reset OTP',
            message: emailMessage,
        });

        // Send the OTP to the user's registered phone number
        const smsMessage = `Your password reset OTP is: ${otp}`;
        // Assuming your user schema has phone stored as user.phone.number
        await sendSms(user.phone.number, smsMessage);

    } catch (notificationError) {
        console.error("Forgot Password: Failed to send notifications.", notificationError);
        // Do not block the main response if notifications fail
    }


    res.status(200).json({
      success: true,
      message: 'An OTP has been sent to your email address and phone number.',
    });

  } catch (error) {
    // In case of an error, clear the OTP fields to allow the user to try again
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
    }
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: 'There was an error sending the OTP. Please try again later.' });
  }
};




// --- STEP 2: Verify OTP and Reset the Password ---
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "Please provide email, OTP, and new password." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    // Hash the OTP from the request to compare with the one in the database
    const hashedOtp = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpires: { $gt: Date.now() }, // Check if OTP is not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'OTP is invalid or has expired.' });
    }

    // Set the new password
    user.password = await bcrypt.hash(password, 10);
    
    // Clear the OTP fields after successful reset
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // --- Send Confirmation Notifications ---
    try {
        const emailMessage = `Hello, ${user.fullName}!\n\nThis is a confirmation that the password for your account has just been changed. If you did not make this change, please contact our support team immediately.`;
        await sendEmail({
            email: user.email,
            subject: 'Your Password Has Been Reset',
            message: emailMessage,
        });

        const smsMessage = `Hello, ${user.fullName}! The password for your e-Services account has been successfully reset.`;
        await sendSms(user.phone.number, smsMessage);
    } catch (notificationError) {
        console.error("Reset Password: Failed to send confirmation notifications.", notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: 'Error resetting password.' });
  }
};

export const getUserProfile = async (req, res) => {
    try {
        // req.user is provided by the protectRoute middleware
        const user = req.user;

        // ✅ We will build a specific user object to send to the frontend,
        // ensuring we never accidentally send sensitive data like a password.
        const userProfileData = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone?.number, // Safely access the nested 'number' field
            gender: user.gender,
            address: user.address,
            role: user.role
        };

        res.status(200).json({
            success: true,
            user: userProfileData
        });

    } catch (error) {
        console.error("Error in getUserProfile controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// This function gets a user's profile by their ID
export const getUserProfileById = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from the URL

        // Find user by the ID from the params and exclude the password
        const user = await User.findById(id).select("-password");
     
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Send back the public profile data
        res.status(200).json({ success: true, user: user });

    } catch (error) {
        console.error("Error in getUserProfileById:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};