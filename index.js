import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import { Item } from "./schema/FoodDetails.js";
import userRoutes from "./routes/User.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
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

// app.use("/api", User);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`✅ Example app listening on port ${port}`);
});
