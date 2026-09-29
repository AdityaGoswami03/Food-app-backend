import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (!process.env.db_url) {
  throw new Error(
    "db_url must be set. Did you forget to provide a MongoDB connection string?"
  );
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.db_url);
    console.log(
      `✅ MongoDB connected successfully to DB: ${mongoose.connection.name}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
