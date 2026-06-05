import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log("✅ Database Connected");

    // Optional: Handle other events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // optional: force exit
  }
};
