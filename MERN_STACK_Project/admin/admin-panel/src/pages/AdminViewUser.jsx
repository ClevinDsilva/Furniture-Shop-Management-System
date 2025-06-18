import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orderStats, setOrderStats] = useState({ count: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(userResponse.data);

        const ordersResponse = await axios.get(`http://localhost:5000/api/orders/${id}`);
        const orders = ordersResponse.data.orders || [];

        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        setOrderStats({
          count: orders.length,
          totalAmount,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user or order details:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>User Details</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Contact:</strong> {user.contact}</p>
      <p><strong>Address:</strong> {user.address}</p>

      {/* ➕ Additional Details (instead of image) */}
      <p><strong>Role:</strong> {user.role || "Customer"}</p>
      <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
      <p><strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : "Not specified"}</p>

      <h3>Order Info</h3>
      <p><strong>Total Orders:</strong> {orderStats.count}</p>
      <p><strong>Total Amount Spent:</strong> ₹{orderStats.totalAmount}</p>

      <h3>Login Info</h3>
      <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</p>
      <p><strong>Registered On:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</p>

      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>Back</button>
    </div>
  );
};

export default AdminViewUser;
