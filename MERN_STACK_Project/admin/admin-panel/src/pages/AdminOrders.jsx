import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaCheck, FaClock, FaShippingFast, FaTruck, FaCheckCircle } from "react-icons/fa";
import "./order.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const order = orders.find(order => order._id === id);

    // Prevent status change if order is already cancelled
    if (order.status === "Cancelled") {
      alert("This order has been cancelled and cannot be updated.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status: newStatus });
      const updatedOrders = orders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancelOrder = async (id) => {
    const order = orders.find(order => order._id === id);

    // Users can only cancel orders if they are pending
    if (order.status !== "Pending") {
      alert("Orders can only be cancelled while they are pending.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status: "Cancelled" });
      const updatedOrders = orders.map((order) =>
        order._id === id ? { ...order, status: "Cancelled" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        setOrders(orders.filter((order) => order._id !== id));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-orders-container">
      <h1>Manage Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="admin-order-card">
              <h3>Order ID: {order._id}</h3>
              {/* <p>User Name: <strong>{order.user?.name || "N/A"}</strong></p> */}
              <p>User ID: <strong>{order.userId || "N/A"}</strong></p>
              {/* <p>Contact: <strong>{order.user?.contact || "N/A"}</strong></p> */}
              {/* <p>Address: <strong>{order.user?.address || "N/A"}</strong></p> */}
              <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Payment Method: <strong>{order.paymentMethod}</strong></p>

              {/* Order Status with Tracking Bar */}
              <div className="order-status">
                <p>Order Status: <strong>{order.status}</strong></p>
                <div className="status-bar">
                  <span className={order.status === "Pending" ? "active" : ""}>🕐 Pending</span>
                  <span className={order.status === "Shipped" ? "active" : ""}>🚚 Shipped</span>
                  <span className={order.status === "Out for Delivery" ? "active" : ""}>📦 Out for Delivery</span>
                  <span className={order.status === "Delivered" ? "active" : ""}>✅ Delivered</span>
                </div>
              </div>

              {/* Product Details */}
              {/* <table className="order-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productId?._id || "N/A"}</td>
                      <td>{item.productId?.name || "N/A"}</td>
                      <td>₹{item.productId?.price || "0"}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.productId?.price * item.quantity) || "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table> */}

              <div className="order-total">
                <p>Total Amount: <strong>₹{order.totalAmount}</strong></p>
              </div>

              <div className="order-actions">
                {/* Status Dropdown (Disabled for Cancelled Orders) */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={order.status === "Cancelled"}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Cancel Order Button (Only for Pending Orders) */}
                {order.status === "Pending" && (
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}

                {/* Delete Button */}
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteOrder(order._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
