import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

/**
 * Helper to generate JWT Token
 * @param {Object} payload - Data to embed in token (e.g. { id, email })
 * @param {string} expiresIn - Token expiry duration (e.g. "24h")
 */
export const generateToken = (payload, expiresIn = "24h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Middleware to authenticate and verify JWT token from request headers
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Check Authorization header (Bearer <token>) or 'auth-token' header
    const authHeader = req.headers["authorization"] || req.headers["auth-token"];
    let token = null;

    if (authHeader) {
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach decoded user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
