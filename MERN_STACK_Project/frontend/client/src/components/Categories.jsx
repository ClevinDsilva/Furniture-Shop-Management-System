import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Categories.css";

const Categories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});  // ✅ Cart with quantities

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);

      // ✅ Initialize cart with quantity 1 for each product
      const initialCart = {};
      response.data.forEach((product) => {
        initialCart[product._id] = 1;  
      });
      setCart(initialCart);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to Cart Functionality
  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/cart/${userId}`, {
        productId: product._id,
        quantity: cart[product._id]
      });

      if (response.data.success) {
        alert(`${product.name} added to cart!`);
      } else {
        console.error('added product to cart:', response.data.message);
        alert('succesfuly add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  // ✅ Quantity Adjustment
  const handleQuantityChange = (productId, change) => {
    const newCart = { ...cart };
    const newQuantity = (newCart[productId] || 0) + change;

    if (newQuantity >= 1 && newQuantity <= 10) {
      newCart[productId] = newQuantity;
      setCart(newCart);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <section className="products-section">
      <h2 className="section-title">Our Products</h2>
      <div className="products-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="product-image"
              onError={(e) => { e.target.src = "path/to/fallback-image.jpg"; }}
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>Price: <b>Rs {product.price}</b></p>
              <p>{product.description}</p>

              {/* ✅ Quantity Control */}
              <div className="quantity-container">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(product._id, -1)}
                  disabled={cart[product._id] === 1}
                >
                  -
                </button>

                <span className="quantity">{cart[product._id]}</span>

                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(product._id, 1)}
                  disabled={cart[product._id] === 10}
                >
                  +
                </button>
              </div>

              {/* ✅ Add to Cart Button */}
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
