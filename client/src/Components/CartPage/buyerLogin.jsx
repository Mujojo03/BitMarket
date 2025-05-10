import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './cartSidebar'; // You can reuse or adjust sellerDashboard.css

const BuyerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = location.state?.from || "/purchase";

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("buyerUser"));

    if (
      savedUser &&
      savedUser.username === username &&
      savedUser.password === password
    ) {
      localStorage.setItem("buyerAuth", "true");
      navigate(redirectTo);
    } else {
      alert("Invalid credentials. Please try again or register.");
    }
  };

  const handleRegister = () => {
    if (!email || !username || !password) {
      alert("All fields are required.");
      return;
    }

    const newUser = { email, username, password };
    localStorage.setItem("buyerUser", JSON.stringify(newUser));
    localStorage.setItem("buyerAuth", "true");
    navigate(redirectTo);
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Buyer Login" : "Buyer Registration"}</h2>

      {!isLogin && (
        <div className="input-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="buyer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <div className="input-field">
        <label>Username</label>
        <input
          type="text"
          placeholder="buyer123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="input-field">
        <label>Password</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={isLogin ? handleLogin : handleRegister}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="toggle-button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default BuyerLogin;