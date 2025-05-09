import React, { useState } from 'react';
import './homePage.css';
import CartSidebar from '../CartPage/cartSidebar';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const search = () => {
    const input = document.getElementById('searchInput').value;
    alert(`Searching for: ${input}`);
  };

const handleSellClick = () => {
  const isSellerAuthenticated = localStorage.getItem("sellerAuth") === "true";
  if (isSellerAuthenticated) {
    navigate("/sell");
  } else {
    navigate("/seller-login", { state: { from: "/sell" } });
  }
};

  return (
    <div>
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="container">
          <h1 className="logo">Bit Market</h1>
          <h2 className="logo">Welcome to the Bit Marketplace</h2>
          <p className="logo">Discover, shop, and sell your favorite items all in one place.</p>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a onClick={handleSellClick} style={{ cursor: "pointer" }}>Sell</a>
            <a href="#">About</a>
            <button className="cart-icon" onClick={() => setIsCartOpen(!isCartOpen)}>🛒 View Cart</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <div className="search-bar">
            <input type="text" id="searchInput" placeholder="Search products..." />
            <button onClick={search}>Search</button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories">
        <div className="container">
          <h3>Featured Categories</h3>
          <div className="category-grid">
            <div className="category-card">
              <img src="https://www.codrey.com/wp-content/uploads/2017/12/Consumer-Electronics.png" alt="Electronics" />
              <h4>Electronics</h4>
              <button onClick={() => addToCart({ name: 'Electronics', price: 100, img: 'https://via.placeholder.com/150' })}>Add to Cart</button>
            </div>
            <div className="category-card">
              <img src="https://earth.org/wp-content/uploads/2022/06/Untitled-1024-%C3%97-683px-26.jpg" alt="Fashion" />
              <h4>Fashion</h4>
              <button onClick={() => addToCart({ name: 'Fashion', price: 50, img: 'https://via.placeholder.com/150' })}>Add to Cart</button>
            </div>
            <div className="category-card">
              <img src="https://d1hy6t2xeg0mdl.cloudfront.net/image/726909/308cb4788c/800-width" alt="Home & Living" />
              <h4>Home & Living</h4>
              <button onClick={() => addToCart({ name: 'Home & Living', price: 70, img: 'https://via.placeholder.com/150' })}>Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 MarketPlace. All rights reserved.</p>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default HomePage;