const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const User = require("./models/user"); // Your user model
const { generateToken, authenticateToken } = require("./config/auth");
require("dotenv").config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());

// Connect to database
(async () => {
    await connectDB();
  })();

// Registration Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({ token }); // Send token to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Route Example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is protected content", user: req.user });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});