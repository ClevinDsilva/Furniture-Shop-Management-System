import React, { useState } from "react";
import axios from "axios";
import "./adminlogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      if (response.data.success) {
        alert("Login Successful!");
        localStorage.setItem("adminToken", response.data.token); // Store token
        window.location.href = "/dashboard"; // Redirect to dashboard
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <h2>Admin Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
      <div className="mb-3 text-start">
      <label htmlFor="email" className="form-label">
      Email</label>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
           className="form-control"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
        <div className="mb-3 text-start">
        <label htmlFor="password" className="form-label">
              Password
            </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
           className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit" className="btn btn-dark w-100">Login</button>
      </form>
    </div>
    </div>
  );
};

export default AdminLogin;
