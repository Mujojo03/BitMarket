import React, { useEffect, useState } from 'react';
import "./sellerDashboard.css";
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  // Fetch existing orders (from your backend later)
  useEffect(() => {
    fetch('http://localhost:3000/api/seller/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Failed to fetch orders:", err));
  }, []);

  // Listen for real-time payment updates
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.paid && data.hash) {
        setPaidOrders(prev => ({ ...prev, [data.hash]: true }));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Seller Dashboard</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
              Order for {order.itemName} — {order.amount} sats
              <span className={`badge ${paidOrders[order.r_hash] ? "bg-success" : "bg-secondary"}`}>
                {paidOrders[order.r_hash] ? "Payment Received" : "Waiting for Payment"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerDashboard;
