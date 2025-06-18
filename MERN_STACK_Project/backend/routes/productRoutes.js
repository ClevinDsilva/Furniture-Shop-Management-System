// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const Product = require("../models/Product");

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // ✅ Update product route
// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // ✅ If no new image is uploaded, retain the existing image
//     const updatedProduct = {
//       name: req.body.name || product.name,
//       price: `Rs ${req.body.price}` || product.price,
//       category: req.body.category || product.category,
//       description: req.body.description || product.description,
//       image: req.file ? `/uploads/${req.file.filename}` : product.image,  // Keep existing image if no new image is uploaded
//     };

//     // Update the product
//     await Product.findByIdAndUpdate(req.params.id, updatedProduct, {
//       new: true,
//     });

//     res.json({ message: "Product updated successfully", product: updatedProduct });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// module.exports = router;
