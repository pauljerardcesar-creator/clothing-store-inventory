// This file handles logging in.

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// When the Login page sends a username + password here, we check if
// they're correct, and if so, send back a "token" (like a wristband at an
// event) that proves the user is logged in for future requests.
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please enter a username and password." });
  }

  const user = await User.findOne({ username });

  // If we can't find the user, or their account has been turned off,
  // show the same generic error - don't tell people which part was wrong,
  // that's a small security habit worth knowing about.
  if (!user || !user.active) {
    return res.status(401).json({ message: "Incorrect username or password." });
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordIsCorrect) {
    return res.status(401).json({ message: "Incorrect username or password." });
  }

  // Create the "wristband" (token) that proves who this user is.
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: { id: user._id, name: user.name, username: user.username, role: user.role },
  });
});

module.exports = router;
