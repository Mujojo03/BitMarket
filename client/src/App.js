// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './components/cart/cart';
import Register from './components/register/register';
import Login from './components/login/login';
import Payment from './components/payments/payment';
import OrderManager from './components/orders/orderManager';
import ProductManager from './components/products/productManager';
import { Transaction } from 'bitcoinjs-lib';

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
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/product" element={<ProductManager />} />
        <Route path="/order" element={<OrderManager />} />
      </Routes>
    </Router>
  );
}

export default App;