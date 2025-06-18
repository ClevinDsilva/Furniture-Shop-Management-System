const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"  // ✅ Reference Product model
      },
      quantity: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: String,
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
