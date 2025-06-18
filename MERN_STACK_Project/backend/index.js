const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // For password hashing
const adminRoutes = require("./routes/adminRoutes");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Cart = require("./models/Cart");  // Check correct path
const cartRoutes = require('./routes/cart');  
const orderRoutes = require('./routes/orderRoutes');  // ✅ Import order routes
const { ObjectId } = require('mongoose').Types;
const jwt = require('jsonwebtoken'); // Ensure you're requiring jsonwebtoken
const nodemailer = require("nodemailer");


const otpStore = {};


const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // To serve uploaded images


// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://clevindsilva0023:2002@cluster0.nuug6.mongodb.net/furnitureDB?retryWrites=true&w=majority")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
    

    // ✅ Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

    
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String ,// Hashed password
  contact:Number ,
  address: String,
  image: String,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
});

const User = mongoose.model("User", UserSchema);

console.log("User model:", User);  // Check if the model is loaded properly

// Product Schema
const ProductSchema = new mongoose.Schema({
name: String,
price: Number,
category: String,
description: String,
image: String,
stock: {
  type: String,
  enum: ["In Stock", "Out of Stock"],
  default: "In Stock"
}
});

const Product = mongoose.model("Product", ProductSchema);

// ✅ Register Customer (With Password Hashing)
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, contact, address, image } = req.body; // ✅ include all fields

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "❌ User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      address,
      image,
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "✅ Registration Successful!" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "❌ Error registering user" });
  }
});

// ✅ Login Customer (Compare Hashed Password)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ success: false, message: "Invalid password" });
  }

  // ✅ Create a token (you might already have this)
  const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: "1d" });

  // ✅ Send token + userId in the response
  // Example: login route response
res.json({
  success: true,
  token,
  userId: user._id,
  user: {
    name: user.name,
    email: user.email,
    password: user.password,
    address: user.address,
    contact: user.contact,
    image: user.image // if applicable
  }
});

});

app.get("/api/users", async (req, res) => {
  try {
    console.log("🚀 Fetching users...");

    const users = await User.find({}, "name email image contact address");  // Fetch all fields

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    console.log("🚀 Fetching users...");
    
    // Check if the model has the find method
    if (!User.find) {
      console.error("❌ User.find is not a function");
      return res.status(500).json({ message: "User.find is not a function" });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, user });
  } catch (err) {
    console.error("Get user failed:", err);
    res.status(500).json({ success: false });
  }
});

app.put("/api/update-profile/:id", async (req, res) => {
  try {
    const { name, email, password, address, contact, image } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password, // 🔐 Ideally, hash the password
        address,
        contact,
        image,
      },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

// Add Product (with image upload)
app.post("/api/products", upload.single("image"), async (req, res) => {
  const { name, price, category, description } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  const product = new Product({ name, price, category, description, image: imagePath });
  await product.save();
  res.send({ success: true, message: "Product added" });
});

// Get Products
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// Update product by ID
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  const { name, price, category, description } = req.body;
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Update the fields with new values or retain the old ones
    product.name = name || product.name;
    product.price = parseFloat(price) || product.price;
    product.category = category || product.category;
    product.description = description || product.description;

    // Update the image only if a new one is uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.send(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Failed to update product.");
  }
});
// Delete Product
app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send({ success: true, message: "Product deleted" });
});

// Route to get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});




app.use('/api/cart', cartRoutes);

// Fetch cart with populated product details
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Ensure you are using new ObjectId() when querying
    const cart = await Cart.findOne({ userId: new ObjectId(userId) })
      .populate('items.productId');  // Populate product details

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  app.post("/api/cart", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if cart exists for the user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Check if product already in cart
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex > -1) {
            // Increase quantity if product already exists
            cart.products[productIndex].quantity += quantity;
        } else {
            // Add new product
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ success: true, message: "✅ Product added to cart", cart });

    } catch (error) {
        console.error("Cart Error:", error);
        res.status(500).json({ success: false, message: "❌ Failed to add product to cart" });
    }
});


// ✅ Add Product (Admin Only)
app.post("/api/products", async (req, res) => {
    try {
        const { name, category, price, image, stock } = req.body;

        const newProduct = new Product({ name, category, price, image, stock });
        await newProduct.save();

        res.status(201).json({ success: true, message: "✅ Product added successfully!" });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({ success: false, message: "❌ Error adding product" });
    }
});

// ✅ Get All Products (For Customers)
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({ success: false, message: "❌ Error fetching products" });
    }
});


app.get("/api/products", async (req, res) => {
    try {
      const products = await Product.find();
      
      // Format price with Rs prefix
      const formattedProducts = products.map((product) => ({
        ...product._doc,
        price: `Rs ${product.price}` 
      }));
  
      res.json(formattedProducts);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
// Update product with image upload
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
      const productId = req.params.id;
  
      const updatedData = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        image: req.file ? `/uploads/${req.file.filename}` : req.body.image,  // Use existing image if no new image is uploaded
      };
  
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Server error");
    }
  });
  
  
  
  // Delete Product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).send("Product not found");
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // ✅ Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

  

// ✅ Add Item to Cart
app.post("/api/cart/add", async (req, res) => {
    try {
        const { userId, productId, name, image, price } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ productId, name, image, price, quantity: 1 });
        }

        await cart.save();
        res.status(200).json({ success: true, message: "✅ Item added to cart!" });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, message: "❌ Error adding to cart" });
    }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate totals using populated product data
    const totalQuantity = cart.products.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.products.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0);

    res.json({ cart, totalQuantity, totalPrice });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/admin/stats", async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const successfulOrders = await Order.countDocuments({ status: "Delivered" });
        const pendingOrders = await Order.countDocuments({ status: "Pending" });
        const failedOrders = await Order.countDocuments({ status: "Canceled" });

        res.json({ totalOrders, successfulOrders, pendingOrders, failedOrders });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: "❌ Failed to fetch stats" });
    }
});

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);  // ✅ Add order routes




app.use("/admin", adminRoutes);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.post("/api/admin/login", (req, res) => {
const { email, password } = req.body;

  // Simple hardcoded admin check
  if (email === "admin@example.com" && password === "admin123") {
    res.json({ success: true, token: "fake-admin-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});



// ✅ Get All Orders for Admin
app.get("/api/admin/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "❌ Error fetching orders" });
    }
});

// ✅ Update Order Status (Pending -> Ready -> Delivered)
app.put("/api/admin/orders/update", async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "❌ Order not found" });

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, message: "✅ Order status updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "❌ Error updating order" });
    }
});

app.get("/api/admin/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email");
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ success: false, message: "❌ Failed to fetch orders" });
    }
});

// // Fetch total order count
// app.get('/api/orders/count', async (req, res) => {
//   try {
//     const orderCount = await Order.countDocuments();
//     res.json({ count: orderCount });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching order count" });
//   }
// });

// Fetch total users count
app.get('/api/users/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user count" });
  }
});

// // Fetch total revenue from all orders
// app.get('/api/orders/revenue', async (req, res) => {
//   try {
//     const totalRevenue = await Order.aggregate([
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//     ]);
//     res.json({ total: totalRevenue[0]?.total || 0 });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching revenue" });
//   }
// });

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
