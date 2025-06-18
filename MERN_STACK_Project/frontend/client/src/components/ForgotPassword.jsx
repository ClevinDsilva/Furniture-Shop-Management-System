import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/login.css"; // using the same styles as login

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        email,
        password: newPassword,
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "✅ Password reset successful. Redirecting..." });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({ type: "error", text: res.data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to reset password." });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Reset Password</h2>
        <p className="login-subtitle">Enter your email and new password</p>

        {message && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <button type="submit" className="btn-login">Reset Password</button>
        </form>

        <div className="login-links">
          <a href="/login" className="login-link">Back to login</a>
        </div>
      </div>

      <div className="login-image" />
    </div>
  );
};

export default ResetPassword;
