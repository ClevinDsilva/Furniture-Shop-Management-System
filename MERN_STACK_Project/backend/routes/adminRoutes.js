const express = require("express");
const router = express.Router();

router.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  // Simple authentication check
  if (email === "admin@example.com" && password === "admin123") {
    res.json({ success: true, token: "fake-admin-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;
