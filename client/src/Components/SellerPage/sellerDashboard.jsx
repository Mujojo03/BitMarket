import React, { useState, useEffect } from 'react';
import './sellerDashboard.css';

const SellerPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [listings, setListings] = useState([]);

  // Load listings from localStorage on component mount
  useEffect(() => {
    const storedListings = localStorage.getItem("sellerListings");
    if (storedListings) {
      setListings(JSON.parse(storedListings));
    }
  }, []);

  // Save listings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sellerListings", JSON.stringify(listings));
  }, [listings]);

  const addListing = (listing) => {
    setListings([...listings, listing]);
  };

  const removeListing = (indexToRemove) => {
    const updated = listings.filter((_, index) => index !== indexToRemove);
    setListings(updated);
  };

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
        {activeTab === "create" ? (
          <CreateListing onAddListing={addListing} />
        ) : (
          <SellerDashboard listings={listings} onRemoveListing={removeListing} />
        )}
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


const CreateListing = ({ onAddListing }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Physical Product");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newListing = { title, description, price, type, imageUrl };
    onAddListing(newListing);

    // Reset form
    setTitle("");
    setDescription("");
    setPrice("");
    setType("Physical Product");
    setImageUrl("");
    alert("Listing created!");
  };

  return (
    <div className="form-container">
      <h2>Create a New Listing</h2>
      <form onSubmit={handleSubmit}>
        <label>Product Title</label>
        <input
          type="text"
          placeholder="Enter a descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Describe your product in detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Price (in sats)</label>
        <input
          type="number"
          placeholder="e.g. 100000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Product Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Physical Product</option>
          <option>Digital Product</option>
          <option>Service</option>
        </select>

        <label>Image URL</label>
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <button type="submit" className="create-btn">Create Listing</button>
        <button type="button" className="connect-wallet-button">Connect Wallet</button>
      </form>
    </div>
  );
};

const SellerDashboard = ({ listings, onRemoveListing }) => (
  <div className="dashboard-container">
    <h2>Seller Dashboard</h2>
    <p>Manage your products, view orders, and track your earnings.</p>

    <div className="earnings">
      <h3>Your Earnings</h3>
      <p><span>0</span> sats</p>
    </div>

    <div className="active-listings">
      <h3>Your Active Listings</h3>
      {listings.length === 0 ? (
        <>
          <p>No active listings yet.</p>
          <p className="hint">Create your first product to get started.</p>
        </>
      ) : (
        <ul className="listing-grid">
          {listings.map((item, index) => (
            <li key={index} className="listing-item">
              <img src={item.imageUrl} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <strong>{item.price} sats</strong>
              <small>{item.type}</small>
              <button
                className="remove-btn"
                onClick={() => onRemoveListing(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="recent-orders">
      <h3>Recent Orders</h3>
      <p>No orders yet.</p>
      <p className="hint">Orders will appear here once customers make purchases.</p>
    </div>
  </div>
);

export default SellerPage;