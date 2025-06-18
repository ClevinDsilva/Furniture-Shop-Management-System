import React from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessPage.css";

const SuccessPage = () => {
  const navigate = useNavigate();

  // Calculate Delivery Date (Next Day)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 1);

  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Thank you for shopping with us. Your order will be delivered on:</p>
        <h3 className="delivery-date">📦 {formattedDate}</h3>

        <button onClick={handleGoHome} className="home-btn">
          Go to Home 🏠
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
