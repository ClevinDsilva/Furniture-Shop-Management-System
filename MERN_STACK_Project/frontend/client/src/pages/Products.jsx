import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Route } from "react-router-dom";
import "./product.css";
import { FaHome, FaShoppingCart, FaCouch, FaTruck } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";


const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState({});

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      const newUserId = uuidv4().replace(/-/g, "").slice(0, 24);
      localStorage.setItem("userId", newUserId);
    }
    fetchProducts();
    loadCart();
  }, []);

  const userId = localStorage.getItem("userId");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(response.data.cart || {});
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const saveCart = async (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
    try {
      await axios.post(`http://localhost:5000/api/cart/${userId}`, { cart: cartData });
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/cart/${userId}`, {
        productId: product._id,
        quantity: cart[product._id] || 1,
      });

      if (response.data.success) {
        alert(`${product.name} added to cart!`);
      } else {
        console.error("Cart update failed:", response.data.message);
        alert("Product added to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding product to cart.");
    }
  };

  const handleQuantityChange = (productId, change) => {
    setCart((prevCart) => {
      const newQuantity = (prevCart[productId] || 0) + change;
      if (newQuantity >= 1 && newQuantity <= 10) {
        const updatedCart = { ...prevCart, [productId]: newQuantity };
        saveCart(updatedCart);
        return updatedCart;
      }
      return prevCart;
    });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (loading) {
    return <div>Loading products...</div>;
  }

  

  return (
    <div className="customer-container">
      <nav className="top-bar">
        <div className="top-container">
          <Link to="/" className="nav-logo">🛒 Furniture Hub</Link>
          <ul className="nav-menu">
            <li><Link to="/"><FaHome /> Home</Link></li>
            <li><Link to="/products"><FaCouch /> Products</Link></li>
            <li><Link to="/cart"><FaShoppingCart /> Cart</Link></li>
            <li><Link to="/orders"><FaTruck /> Orders</Link></li>
          </ul>
        </div>
      </nav>

      <div className="filter-header">
        <div className="filter-container">
          <label>Filter by Category:</label>
          <select onChange={handleCategoryChange} value={selectedCategory}>
            <option value="All">All</option>
            {[...new Set(products.map((product) => product.category))].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
  <img
    src={`http://localhost:5000${product.image}`}
    alt={product.name}
    className="product-image"
    onError={(e) => { e.target.src = "/fallback-image.jpg"; }}
  />
</Link>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p>Price: <b>Rs {product.price}</b></p>
              <p>Category: {product.category}</p>
              <p>{product.description}</p>

              <div className="quantity-container">
                <button className="quantity-btn" onClick={() => handleQuantityChange(product._id, -1)} disabled={cart[product._id] === 1}>-</button>
                <span className="quantity">{cart[product._id]}</span>
                <button className="quantity-btn" onClick={() => handleQuantityChange(product._id, 1)} disabled={cart[product._id] === 10}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    
  );
};

export default CustomerProducts;
