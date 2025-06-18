import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminViewUser.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderCounts, setOrderCounts] = useState({}); // { userId: count }

  useEffect(() => {
    const fetchUsersAndOrders = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/users");
        const userData = userResponse.data;

        setUsers(userData);

        // Fetch order counts for each user
        const counts = {};
        for (const user of userData) {
          try {
            const orderRes = await axios.get(`http://localhost:5000/api/orders/${user._id}`);
            counts[user._id] = orderRes.data.orders.length;
          } catch {
            counts[user._id] = 0;
          }
        }

        setOrderCounts(counts);
      } catch (error) {
        console.error("Error fetching users or orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndOrders();
  }, []);

  return (
    <div className="container">
      <h2>All Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Orders</th>
              
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.contact || "N/A"}</td>
                <td>{user.address || "N/A"}</td>
                <td>{orderCounts[user._id] || 0}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
