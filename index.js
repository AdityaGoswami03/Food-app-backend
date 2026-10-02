import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./db.js";
import { Item } from "./schema/FoodDetails.js";
import userRoutes from "./routes/User.routes.js";
import foodRoutes from "./routes/Food.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const port = process.env.PORT || 9090;

// connect to MongoDB
connectDB();

app.get("/", async (req, res) => {
  try {
    const fetch_data = await Item.find({});
    console.log("🚀 ~ fetch_data:", fetch_data);
    res.json(fetch_data);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// Routes
app.use("/api", userRoutes);
app.use("/api/food", foodRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`✅ Example app listening on port ${port}`);
});
