import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./paymentPage.css";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentDone, setPaymentDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePayment = async () => {
    console.log("Attempting to place order...");
    console.log("User ID:", userId);
    console.log("User Details:", userDetails);
    console.log("Payment Method:", paymentMethod);

    if (!userId) {
      alert("User is not logged in. Please login again.");
      navigate("/login");
      return;
    }

    if (!userDetails) {
      alert("User details are missing. Please go back and enter your delivery details.");
      navigate("/user-details");
      return;
    }

    if (paymentMethod === "Online" && !paymentDone) {
      alert("Please confirm the payment by clicking 'Payment Done' after scanning.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/orders/${userId}`, {
        paymentMethod,
        userDetails,
      });

      console.log("Order placed successfully:", response.data);
      alert(`✅ Order placed successfully with ${paymentMethod}!`);
      navigate("/success");

      // Optional: Clear cart and user details
      localStorage.removeItem("userDetails");
      localStorage.removeItem("cart"); // if you store it like this
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("❌ Failed to place order. Please try again.");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Choose Payment Method</h2>

        <div className="payment-options">
          <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <div className="option-content">
              <img src="https://cdn-icons-png.flaticon.com/512/3759/3759021.png" alt="COD" />
              <span>Cash on Delivery (COD)</span>
            </div>
          </label>

          <label className={`payment-option ${paymentMethod === "Online" ? "selected" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Online"
              checked={paymentMethod === "Online"}
              onChange={() => {
                setPaymentMethod("Online");
                setPaymentDone(false);
              }}
            />
            <div className="option-content">
              <img src="https://cdn-icons-png.flaticon.com/512/4812/4812292.png" alt="Online" />
              <span>Online Payment</span>
            </div>
          </label>
        </div>

        {paymentMethod === "Online" && (
          <div className="qr-section">
            <h3>📱 Scan to Pay</h3>

            {isMobile ? (
              <div className="mobile-payment">
                <a
                  href="upi://pay?pa=user@upi&pn=UserName&mc=0000&tid=123456&tr=456789&tn=Payment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-payment-link"
                >
                  🔗 Click here to pay via UPI
                </a>
              </div>
            ) : (
              <div>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=user@upi&pn=UserName"
                  alt="QR Code"
                  className="qr-code"
                />
                <p>Scan the QR code with your mobile UPI app to complete the payment.</p>
              </div>
            )}

            <button
              className={`confirm-btn ${paymentDone ? "done" : ""}`}
              onClick={() => setPaymentDone(true)}
            >
              ✅ Payment Done
            </button>
          </div>
        )}

        <button onClick={handlePayment} className="pay-btn">
          {paymentMethod === "Online" && !paymentDone ? "Confirm Payment" : "Place Order 💳"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
