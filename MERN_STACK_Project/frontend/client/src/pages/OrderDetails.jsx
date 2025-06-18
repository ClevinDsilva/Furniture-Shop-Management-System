import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./orderDetails.css";
import {
  FaHome,
  FaShoppingCart,
  FaCouch,
  FaTruck,
  FaMoneyBillWave,
} from "react-icons/fa";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${userId}`);
        console.log(response.data.orders); // Check the structure of orders
        setOrders(response.data.orders || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/cancel/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order.");
    }
  };

  // ✅ Progress bar percentage based on order status
  const getProgressPercentage = (status) => {
    const statusSteps = ["Pending", "Shipped", "Out for Delivery", "Delivered"];
    const index = statusSteps.indexOf(status);
    return index !== -1 ? ((index + 1) / statusSteps.length) * 100 : 0;
  };

  if (loading) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="order-details-page">
      <nav className="top-barp">
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

      <h2 className="page-title">📦 Your Order Details</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">

            {/* ✅ Order Header */}
            <div className="order-header">
              <h3>Order ID: {order._id}</h3>
              <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
              <p>
                <FaMoneyBillWave /> Payment Method: <strong>{order.paymentMethod}</strong>
              </p>
            </div>

            {/* ✅ Progress Bar */}
            <div className="tracking-section">
              <h4>Order Status: <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></h4>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${getProgressPercentage(order.status)}%` }}
                ></div>
              </div>
              <div className="tracking-steps">
                <span className={order.status === "Pending" ? "active-step" : ""}>📦 Pending</span>
                <span className={order.status === "Shipped" ? "active-step" : ""}>🚚 Shipped</span>
                <span className={order.status === "Out for Delivery" ? "active-step" : ""}>📍 Out for Delivery</span>
                <span className={order.status === "Delivered" ? "active-step" : ""}>✅ Delivered</span>
              </div>
            </div>

            {/* ✅ Order Items Table */}
            <table className="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
  {order.items.map((item, index) => (
    <tr key={index}>
      <td>{item.productId?.name || "Unknown Product"}</td> {/* Access name */}
      <td>Rs {item.productId?.price || "0"}</td> {/* Access price */}
      <td>{item.quantity}</td>
      <td>Rs {(item.productId?.price || 0) * item.quantity}</td>
    </tr>
  ))}
</tbody>
            </table>

            {/* ✅ Total Amount */}
            <div className="order-total">
              <p>Total Amount: <strong>Rs {order.totalAmount}</strong></p>
            </div>

            {/* ✅ Cancel Button */}
            {order.status !== "Cancelled" && order.status !== "Delivered" && (
              <button
                className="cancel-btn"
                onClick={() => handleCancelOrder(order._id)}
              >
                ❌ Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderDetails;
