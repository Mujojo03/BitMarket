import React, { useState, useEffect } from "react";
import $ from "jquery";
import "./payment.css";

function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing payments on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.warn("JWT not found in localStorage.");
      return;
    }

    $.ajax({
      url: "http://localhost:5000/payments",
      type: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        setPayments(data);
        console.log("✅ Retrieved payments:", data);
      },
      error: function (xhr) {
        console.error("❌ Error fetching payments:", xhr.responseJSON || xhr);
      },
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      setMessage("Please fill in all the fields.");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("Authentication required.");
      return;
    }

    setIsSubmitting(true);
    setMessage("Processing payment...");

    const payload = {
      card_number: cardNumber,
      card_holder: cardHolder,
      expiry,
      cvv,
    };

    $.ajax({
      url: "http://localhost:5000/payments",
      type: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(payload),
      success: function (response) {
        setMessage(`✅ Payment successful! ID: ${response.id}`);
        setPayments((prev) => [...prev, response]);
        // Clear form
        setCardNumber("");
        setCardHolder("");
        setExpiry("");
        setCvv("");
      },
      error: function (xhr) {
        setMessage(
          `❌ Error: ${
            xhr.responseJSON?.message || xhr.statusText || "Unknown error"
          }`
        );
      },
      complete: function () {
        setIsSubmitting(false);
      },
    });
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
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label>Card Holder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="password"
              placeholder="***"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <button className="payment-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner" /> : "Pay Now"}
        </button>
      </form>

      {/* Optional: Show payments */}
      <div className="payment-list">
        <h3>Previous Payments</h3>
        <ul>
          {payments.map((payment) => (
            <li key={payment.id}>
              💳 {payment.card_holder} •••• {payment.card_number.slice(-4)} —{" "}
              {payment.expiry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Payment;


// import React, { useState } from "react";
// import "./payment.css"; // ✅ Make sure this is here!

// function Payment() {
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardHolder, setCardHolder] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!cardNumber || !cardHolder || !expiry || !cvv) {
//       setMessage("Please fill in all the fields.");
//       return;
//     }

//     setMessage("Processing payment...");

//     setTimeout(() => {
//       setMessage("✅ Payment successful! Thank you.");
//     }, 2000);
//   };

//   return (
//     <div className="payment-container">
//       <h2 className="payment-title">Make Your Payment</h2>

//       {message && (
//         <div
//           className={`payment-alert ${
//             message.includes("successful") ? "alert-success" : "alert-warning"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="payment-form">
//         <div className="form-group">
//           <label>Card Number</label>
//           <input
//             type="text"
//             placeholder="xxxx xxxx xxxx xxxx"
//             value={cardNumber}
//             onChange={(e) => setCardNumber(e.target.value)}
//           />
//         </div>
//         <div className="form-group">
//           <label>Card Holder Name</label>
//           <input
//             type="text"
//             placeholder="John Doe"
//             value={cardHolder}
//             onChange={(e) => setCardHolder(e.target.value)}
//           />
//         </div>
//         <div className="payment-row">
//           <div className="form-group">
//             <label>Expiry Date</label>
//             <input
//               type="text"
//               placeholder="MM/YY"
//               value={expiry}
//               onChange={(e) => setExpiry(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>CVV</label>
//             <input
//               type="password"
//               placeholder="***"
//               value={cvv}
//               onChange={(e) => setCvv(e.target.value)}
//             />
//           </div>
//         </div>
//         <button className="payment-button" type="submit">
//           Pay Now
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Payment;