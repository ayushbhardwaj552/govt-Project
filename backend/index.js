import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/database.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";

// Create Express app & HTTP server
const app = express();
const server = http.createServer(app);

// Middleware setup
// Use express.json() to parse JSON bodies
app.use(express.json({ limit: "4mb" }));
// This is redundant and has been removed: app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "4mb" })); // Add this middleware to parse URL-encoded data

// Configure CORS
app.use(cors({
  origin: "http://localhost:5173",   // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  // Explicitly allow Content-Type for multipart/form-data and Authorization
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
  
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Mount the route
app.use("/api/auth", userRouter);

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});