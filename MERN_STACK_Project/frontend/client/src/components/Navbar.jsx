import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSun,
  FaMoon,
  FaHome,
  FaShoppingCart,
  FaCouch,
  FaTruck,
  FaSearch,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import "./Navbar.css";
import defaultProfileImg from "../assets/user-placeholder.jpg";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImg, setProfileImg] = useState(defaultProfileImg);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }

    // ✅ Fetch the user object and extract the image
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setProfileImg(parsedUser.image || defaultProfileImg);
      }
    } catch (err) {
      console.error("Error parsing user image from localStorage", err);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          {isLoggedIn ? (
            <>
              <div className="profile-img-wrapper" onClick={() => navigate("/profile")}>
                <img src={profileImg} alt="Profile" className="profile-icon" />
              </div>
              <button onClick={handleLogout} className="btn small logout">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn small">Login</Link>
              <Link to="/register" className="btn small register">Register</Link>
            </>
          )}
          <button onClick={toggleDarkMode} className="btn small dark-toggle">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* Navbar */}
      <div className={`navbar-container ${darkMode ? "dark" : ""}`}>
        <div className="logo-container">
          <img src="../src/assets/logo.jpg" alt="Logo" />
          <h2>Furniture Hub</h2>
        </div>

        <ul className="nav-links">
          <li><Link to="/"><FaHome /> Home</Link></li>
          <li><Link to="/products"><FaCouch /> Products</Link></li>
          <li><Link to="/cart"><FaShoppingCart /> Cart</Link></li>
          <li><Link to="/orders"><FaTruck /> Orders</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
