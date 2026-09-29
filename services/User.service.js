import bcrypt from "bcryptjs";
import { User } from "../schema/User.schema.js";
import { generateToken } from "../middleware/auth.middleware.js";

/**
 * Service to handle User registration / creation
 */
export const createUserService = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user in DB
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

/**
 * Service to handle User login & JWT generation
 */
export const loginUserService = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  // Generate JWT token using middleware helper
  const authToken = generateToken({
    id: user._id,
    email: user.email,
  });

  return {
    authToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

/**
 * Service to fetch user profile details (protected)
 */
export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
