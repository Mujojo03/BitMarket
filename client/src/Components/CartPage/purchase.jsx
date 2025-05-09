import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Purchase = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('bitcoin');

  useEffect(() => {
    if (localStorage.getItem("buyerAuth") !== "true") {
      navigate("/buyer-login", { state: { from: "/purchase" } });
    }
  }, [navigate]);

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePurchase = () => {
    if (selectedPayment === 'bitcoin') {
      alert('Payment with Bitcoin initiated. (Mock transaction)');
    } else {
      alert(`Payment method ${selectedPayment} not supported yet.`);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Purchase Summary</h2>
      <ul>
        {cart.map((item, i) => (
          <li key={i}>
            {item.name} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>

      <h3>Total: ${total.toFixed(2)}</h3>

      <div style={{ marginTop: '2rem' }}>
        <h4>Select Payment Method:</h4>
        <label>
          <input
            type="radio"
            value="bitcoin"
            checked={selectedPayment === 'bitcoin'}
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          Pay with Bitcoin
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="card"
            checked={selectedPayment === 'card'}
            onChange={(e) => setSelectedPayment(e.target.value)}
            disabled
          />
          Credit/Debit Card (Coming Soon)
        </label>
      </div>

      <button
        onClick={handlePurchase}
        style={{
          marginTop: '2rem',
          padding: '12px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Confirm Purchase
      </button>
    </div>
  );
};

export default Purchase;