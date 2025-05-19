// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './components/cart/cart';
import Register from './components/register/register';
import Login from './components/login/login';
import Payment from './components/payments/payment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/seller" element={<sellerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;