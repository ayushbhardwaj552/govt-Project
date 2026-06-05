import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";


export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // It now correctly looks for 'userId' which we will create in the login controller
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please log in again." });
    }

    // This line is crucial. It attaches the user to the request.
    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};


// Middleware for MLA-only routes
export const requireMLAAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "mla") {
      return res.status(403).json({ message: "Access denied. MLA only." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



export const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(400).json({
        success: false,
        message: "Already logged in",
      });
    } catch (error) {
      // Invalid token, proceed to login
      next();
    }
  } else {
    // No token, proceed to login
    next();
  }
};

