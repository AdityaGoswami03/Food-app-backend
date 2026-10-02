import {
  createUserService,
  loginUserService,
  getUserProfileService,
} from "../services/User.service.js";

/**
 * Controller to handle user creation / registration
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, password",
      });
    }

    const createdUser = await createUserService({ name, email, password, role });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error("Error in createUser controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Controller to handle user login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const { authToken, user } = await loginUserService({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      authToken,
      user,
    });
  } catch (error) {
    console.error("Error in loginUser controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Controller to get authenticated user details (Protected Route)
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const user = await getUserProfileService(req.user.id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getUserProfile controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
