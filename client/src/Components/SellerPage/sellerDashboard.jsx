import React, { useState } from 'react';
import './sellerDashboard.css';

const SellerPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="seller-page">
      <h1>Sell on Bit Market</h1>
      <p>List your products and get paid in Bitcoin over the Lightning Network</p>

      <div className="tab-toggle">
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          Create Listing
        </button>
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Seller Dashboard
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "create" ? <CreateListing /> : <SellerDashboard />}
      </div>

      <div className="logout-container">
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("sellerAuth");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

    </div>
  );
};

const CreateListing = () => (
  <div className="form-container">
    <h2>Create a New Listing</h2>
    <p>Fill out the form below to list your product on Satoshi Street.</p>
    <form>
      <label>Product Title</label>
      <input type="text" placeholder="Enter a descriptive title" required />

      <label>Description</label>
      <textarea placeholder="Describe your product in detail" required />

      <label>Price (in sats)</label>
      <input type="number" placeholder="e.g. 100000" required />

      <label>Product Type</label>
      <select>
        <option>Physical Product</option>
        <option>Digital Product</option>
        <option>Service</option>
      </select>

      <label>Image URL</label>
      <input type="text" placeholder="Enter image URL" required />

      <button type="submit" className="create-btn">Create Listing</button>
    </form>
  </div>
);

const SellerDashboard = () => (
  <div className="dashboard-container">
    <h2>Seller Dashboard</h2>
    <p>Manage your products, view orders, and track your earnings.</p>

    <div className="earnings">
      <h3>Your Earnings</h3>
      <p><span>0</span> sats</p>
    </div>

    <div className="active-listings">
      <h3>Your Active Listings</h3>
      <p>No active listings yet.</p>
      <p className="hint">Create your first product to get started.</p>
    </div>

    <div className="recent-orders">
      <h3>Recent Orders</h3>
      <p>No orders yet.</p>
      <p className="hint">Orders will appear here once customers make purchases.</p>
    </div>
    {/* 
    <footer className="footer-hint">
      Need help with selling? Check out our <a href="#">seller guide</a>.
    </footer> */}
  </div>
);

export default SellerPage;