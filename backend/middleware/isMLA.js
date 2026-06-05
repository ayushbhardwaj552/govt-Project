import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

export const isMLA = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer TOKEN
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'mla') {
      return res.status(403).json({ message: 'Access denied. MLA only.' });
    }

    req.user = user; // optional: to pass user info to next handlers
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};



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


export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure it looks for 'userId'
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to the request object
    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};