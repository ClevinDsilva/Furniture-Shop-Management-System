const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../routes/authRoutes");

// GET profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT profile update
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, contact, address, image } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, contact, address, image },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
