import { Router } from "express";
import {
  createUser,
  loginUser,
  getUserProfile,
} from "../controllers/User.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/create-user", createUser);
router.post("/login", loginUser);

// Protected routes (require valid JWT token)
router.get("/get-user", authenticateToken, getUserProfile);

export default router;
