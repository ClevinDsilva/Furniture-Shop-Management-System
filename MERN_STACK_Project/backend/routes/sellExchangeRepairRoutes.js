const express = require("express");
const multer = require("multer"); // For image upload
const SellExchangeRepair = require("../models/sellExchangeRepairModel");

const router = express.Router();

// Setup file storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📌 Customer submits a Sell/Exchange/Repair request
router.post("/request", upload.single("image"), async (req, res) => {
  try {
    const { customerId, type, description, price, repairDate, repairLocation } = req.body;
    const image = req.file ? req.file.path : null;

    const newRequest = new SellExchangeRepair({
      customerId,
      type,
      description,
      price,
      image,
      repairDate,
      repairLocation,
      status: "Pending", // Default status
    });

    await newRequest.save();
    res.status(200).json({ success: true, message: "Request submitted successfully!" });
  } catch (error) {
    console.error("Request Error:", error);
    res.status(500).json({ success: false, message: "Error submitting request" });
  }
});

// 📌 Admin approves/rejects Sell/Exchange/Repair requests
router.put("/approve/:id", async (req, res) => {
  try {
    const { status, price } = req.body;
    const updatedRequest = await SellExchangeRepair.findByIdAndUpdate(
      req.params.id,
      { status, price },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Request updated successfully!", data: updatedRequest });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ success: false, message: "Error updating request" });
  }
});

// 📌 Get all requests for admin
router.get("/requests", async (req, res) => {
  try {
    const requests = await SellExchangeRepair.find();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
});

// 📌 Get customer-specific requests
router.get("/requests/:customerId", async (req, res) => {
  try {
    const requests = await SellExchangeRepair.find({ customerId: req.params.customerId });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
});

module.exports = router;
