import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";
import user1 from "../assets/user1.jpg";
import user2 from "../assets/user2.jpg";
import user3 from "../assets/user3.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
    profileImage: user1
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateName = (name) => /^[A-Za-z]{4,}$/.test(name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameBlur = () => {
    if (!validateName(formData.name)) {
      setMessage({
        type: "error",
        text: "❌ Username must be at least 4 letters, no spaces or symbols.",
      });
    } else {
      setMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    if (!validateName(formData.name)) {
      setMessage({
        type: "error",
        text: "❌ Username must be at least 4 letters, no spaces or symbols.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "❌ Passwords do not match!" });
      return;
    }

    if (!/^\d{10}$/.test(formData.contact)) {
      setMessage({ type: "error", text: "❌ Contact must be 10 digits." });
      return;
    }

    if (formData.address.trim().length < 5) {
      setMessage({
        type: "error",
        text: "❌ Address must be at least 5 characters.",
      });
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        address: formData.address,
        password: formData.password, // Note: In production, hash this password
        image: formData.profileImage
      };

      // 1. Save to backend
      const response = await axios.post("http://localhost:5000/api/register", userData);

      if (response.status === 200) {
        // 2. Also save to localStorage for immediate access
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        
        setMessage({ type: "success", text: "✅ Registration successful!" });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "❌ Registration failed!",
      });
    }
  };

  return (
    <div className="login-containers">
      <div className="login-boxes">
        <h2 className="login-title">Create an Account</h2>
        <p className="login-subtitle">Join us today!</p>

        {message && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="text-start mb-3">
            <label className="form-label">Choose Profile Image</label>
            <div className="d-flex gap-3">
              {[user1, user2, user3].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="avatar"
                  onClick={() => setFormData(prev => ({ ...prev, profileImage: img }))}
                  className={`profile-option ${
                    formData.profileImage === img ? "selected" : ""
                  }`}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: formData.profileImage === img ? "3px solid green" : "1px solid gray",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="name" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter username"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleNameBlur}
              pattern="[A-Za-z]{4,}"
              title="Username must be at least 4 letters, no numbers or special characters."
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="contact" className="form-label">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="10-digit mobile number"
              className="form-control"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Create a password"
              className="form-control pe-5"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="position-absolute top-68 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Register
          </button>
        </form>

        <p className="mt-3">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;