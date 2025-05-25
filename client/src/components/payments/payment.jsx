import React, { useState } from "react";
import "./payment.css"; // ✅ Make sure this is here!

function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      setMessage("Please fill in all the fields.");
      return;
    }

    setMessage("Processing payment...");

    setTimeout(() => {
      setMessage("✅ Payment successful! Thank you.");
    }, 2000);
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Make Your Payment</h2>

      {message && (
        <div
          className={`payment-alert ${
            message.includes("successful") ? "alert-success" : "alert-warning"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            placeholder="xxxx xxxx xxxx xxxx"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Card Holder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
          />
        </div>
        <div className="payment-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="password"
              placeholder="***"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>
        <button className="payment-button" type="submit">
          Pay Now
        </button>
      </form>
    </div>
  );
}

export default Payment;