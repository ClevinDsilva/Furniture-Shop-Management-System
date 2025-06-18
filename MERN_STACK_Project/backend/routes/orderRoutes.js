const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// // ✅ Place Order with full user details and payment method
// router.post('/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const { paymentMethod, userDetails } = req.body;  // ✅ Get delivery info from frontend

//   try {
//     const cart = await Cart.findOne({ userId }).populate('items.productId');

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Prepare order items
//     const orderItems = cart.items.map(item => ({
//       productId: item.productId._id,
//       name: item.productId.name,
//       price: item.productId.price,
//       quantity: item.quantity,
//       subtotal: item.productId.price * item.quantity,
//     }));

//     const totalAmount = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

//     // Create order with userDetails passed from frontend
//     const newOrder = new Order({
//       userId,
//       userDetails: {
//         name: userDetails.name,
//         contact: userDetails.contact,
//         address: userDetails.address,
//       },
//       items: orderItems,
//       totalAmount,
//       paymentMethod,
//       status: 'Pending',
//     });

//     await newOrder.save();
//     await Cart.findOneAndDelete({ userId });

//     res.status(201).json({ message: 'Order placed successfully', order: newOrder });

//   } catch (error) {
//     console.error('Error placing order:', error);
//     res.status(500).json({ message: 'Failed to place order', error });
//   }
// });


// ✅ Place Order with Payment Method
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { paymentMethod } = req.body;  // ✅ Capture payment method

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const newOrder = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity
      })),
      totalAmount: cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0),
      paymentMethod,  // ✅ Store payment method
      status: 'Pending',
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
});






router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { paymentMethod } = req.body;  

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');  // ✅ Fetch full product details

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or invalid' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,  
      price: item.productId.price,
      quantity: item.quantity,
      subtotal: item.productId.price * item.quantity,
    }));

    const totalAmount = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

    const newOrder = new Order({
      userId,
      userDetails: {
        name: user.name,
        contact: user.contact,
        address: user.address,
      },
      items: orderItems,  
      totalAmount,
      paymentMethod,  
      status: 'Pending',
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
});

  
// ✅ Cancel Order by ID
router.put("/cancel/:orderId", async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // ✅ Ensure the order is not already canceled or completed
      if (order.status === "Cancelled") {
        return res.status(400).json({ message: "Order is already cancelled" });
      }
      
      if (order.status === "Completed") {
        return res.status(400).json({ message: "Cannot cancel a completed order" });
      }
  
      // ✅ Update order status to "Cancelled"
      order.status = "Cancelled";
      await order.save();
  
      res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ message: 'Failed to fetch all orders' });
    }
  });
  

  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ message: 'Failed to fetch all orders' });
    }
  });

// ➡️ Create a new order
router.post("/", async (req, res) => {
  const { customerName, email, products, totalAmount, status } = req.body;

  const newOrder = new Order({
    customerName,
    email,
    products,
    totalAmount,
    status,
  });

  await newOrder.save();
  res.json(newOrder);
});

// ➡️ Update order status
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updatedOrder);
});

// ➡️ Delete order
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
});

  
// router.post('/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const { paymentMethod } = req.body;  

//   try {
//     const cart = await Cart.findOne({ userId }).populate('items.productId');  // ✅ Fetch full product details

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty or invalid' });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // ✅ Include product details in items array
//     const orderItems = cart.items.map(item => ({
//       productId: item.productId._id,
//       name: item.productId.name,  
//       price: item.productId.price,
//       quantity: item.quantity,
//       subtotal: item.productId.price * item.quantity,
//     }));

//     const totalAmount = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

//     // ✅ Include user details in the order
//     const newOrder = new Order({
//       userId,
//       userDetails: {
//         name: user.name,
//         contact: user.contact,
//         address: user.address,
//       },
//       items: orderItems,   // ✅ Now includes product details
//       totalAmount,
//       paymentMethod,  
//       status: 'Pending',
//     });

//     await newOrder.save();
//     await Cart.findOneAndDelete({ userId });

//     res.status(201).json({ message: 'Order placed successfully', order: newOrder });

//   } catch (error) {
//     console.error('Error placing order:', error);
//     res.status(500).json({ message: 'Failed to place order', error });
//   }
// });


router.get('/count', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ count: totalOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    res.json({ revenue: totalRevenue[0]?.totalRevenue || 0 });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch Orders for a User
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId })
      .populate("items.productId", "name price")  // Populate only the name and price fields
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found", orders: [] });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", orders: [] });
  }
});

  

module.exports = router;
