import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaUserPlus,
  FaSun,
  FaMoon,
  FaHome,
  FaShoppingCart,
  FaCouch,
  FaPhone,
  FaSearch,
  FaTruck,
  FaUserCircle,
  FaSignOutAlt,
}from "react-icons/fa";
import "./cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");  // ✅ Payment method state
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      const items = response.data.cart.items || [];

      const updatedCart = items.map((item) => ({
        ...item,
        image: item.productId.image,
        name: item.productId.name,
        price: item.productId.price,
      }));

      setCartItems(updatedCart);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${userId}/${productId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/orders/${userId}`, {
        paymentMethod,  // ✅ Include selected payment method
      });

      alert(`✅ Order placed successfully with ${paymentMethod}!`);
      console.log("Order:", response.data);
      navigate("/products");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Failed to place order.");
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/user-details");
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="cart-page">

      {/* ✅ Navigation Bar */}
    
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
      

      <h2 className="cart-title">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId._id}>
                  <td>
                    <div className="product-info">
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        className="cart-image"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>Rs {item.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFromCart(item.productId._id)}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className="cart-footer">
            
            

            <button className="place-order-btn" onClick={handleProceedToCheckout}>
              🛒 Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
