// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

// console.log("User model:", User);  // Check if the model is loaded properly

// router.get("/", async (req, res) => {
//   try {
//     console.log("🚀 Fetching users...");
    
//     // Check if the model has the find method
//     if (!User.find) {
//       console.error("❌ User.find is not a function");
//       return res.status(500).json({ message: "User.find is not a function" });
//     }

//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("❌ Error fetching users:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;
