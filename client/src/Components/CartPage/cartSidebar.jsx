import React, { useEffect, useState } from 'react';
import './cartSidebar.css';
import { useNavigate } from 'react-router-dom';


const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(storedCart);
    }
  }, [isOpen]);

  const navigate = useNavigate();

  const updateQuantity = (index, amount) => {
    const newCart = [...cartItems];
    newCart[index].quantity = Math.max(1, newCart[index].quantity + amount);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
  };

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`} onMouseLeave={onClose}>
      <h3>Your Cart</h3>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(index, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(index)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="subtotal">
            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
          </div>
          <div className="purchase-button-container">
            <button className="purchase-btn" onClick={() => navigate('/purchase')}>
              Proceed to Purchase
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartSidebar;
