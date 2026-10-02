import { Router } from "express";
import {
  addFoodItem,
  getAllFoodItems,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/Food.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

// Public Routes (Anyone can view food items)
router.get("/", getAllFoodItems);
router.get("/:id", getFoodItemById);

// Admin-Only Protected Routes (Requires valid JWT with role: 'admin')
router.post(
  "/add",
  authenticateToken,
  authorizeAdmin,
  upload.single("image"),
  addFoodItem
);

router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  upload.single("image"),
  updateFoodItem
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  deleteFoodItem
);

export default router;
