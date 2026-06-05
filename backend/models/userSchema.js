import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      countryCode: { 
        type: String, 
        default: "+91" 
      },
      number: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true, // Re-enabled: A citizen/MLA should have a unique phone number
        match: [/^\d{10}$/, "Invalid phone number. It must be exactly 10 digits."],
        trim: true,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["citizen", "mla"],
      default: "citizen",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    jobProfile: { 
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// --- METHOD TO GENERATE PASSWORD RESET TOKEN ---
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time (15 minutes)
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  return resetToken; // Return unhashed token to send via email/SMS
};

// --- METHOD TO GENERATE OTP ---
userSchema.methods.getResetPasswordOtp = function () {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP and set it on the user document
  this.otp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // Set an expiration time for the OTP (10 minutes)
  this.otpExpires = Date.now() + 10 * 60 * 1000;

  return otp; // Return the plain, unhashed OTP to send via email/SMS
};

const User = mongoose.model("User", userSchema);
export default User;