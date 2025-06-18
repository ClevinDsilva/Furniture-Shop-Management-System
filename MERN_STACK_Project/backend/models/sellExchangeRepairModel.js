const mongoose = require("mongoose");

const sellExchangeRepairSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Sell", "Exchange", "Repair"], required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 }, // Admin sets price for sell/exchange
  image: { type: String }, // Stores image path
  repairDate: { type: Date }, // For repair scheduling
  repairLocation: { type: String }, // Customer or shop location
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

module.exports = mongoose.model("SellExchangeRepair", sellExchangeRepairSchema);
