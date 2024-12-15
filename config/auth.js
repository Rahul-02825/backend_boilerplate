const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key"; // Use an environment variable for security

// Generate a JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username }, // Payload
    JWT_SECRET,                                // Secret
    { expiresIn: "1h" }                        // Token expiration
  );
};

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer scheme

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = payload; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { generateToken, authenticateToken };
