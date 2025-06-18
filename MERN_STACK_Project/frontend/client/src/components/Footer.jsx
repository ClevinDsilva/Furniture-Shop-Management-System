import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ✅ Company Info Section */}
        <div className="footer-section">
          <h3>Furniture Hub</h3>
          <p>Discover premium quality furniture for your home and office. Stylish, durable, and affordable.</p>
        </div>

        {/* ✅ Navigation Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* ✅ Contact Information */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@furniturehub.com</p>
          <p>📍 Sakleshpur, India</p>
        </div>

        {/* ✅ Social Media Links */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Furniture Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
