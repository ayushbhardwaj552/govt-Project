import mongoose from "mongoose";

const mlaSchema = new mongoose.Schema(
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
        unique: true, // Ensuring an MLA's phone number is unique across the platform
        match: [/^\d{10}$/, "Invalid phone number. It must be exactly 10 digits."],
        trim: true,
      },
    },
    constituency: {
      type: String,
      required: [true, "Constituency is required"],
      trim: true,
    },
    role: {
      type: String,
      default: "mla", // Automatically locks the role for anyone registered via this schema
    },
  },
  { timestamps: true }
);

const MLA = mongoose.model("MLA", mlaSchema);
export default MLA;