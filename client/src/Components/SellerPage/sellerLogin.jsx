import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sellerDashboard.css';

const SellerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = location.state?.from || "/sell";

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("sellerUser"));

    if (
      savedUser &&
      savedUser.username === username &&
      savedUser.password === password
    ) {
      localStorage.setItem("sellerAuth", "true");
      navigate(redirectTo);
    } else {
      alert("Invalid credentials. Try again or register.");
    }
  };

  const handleRegister = () => {
    if (!email || !username || !password) {
      alert("All fields are required.");
      return;
    }

    const newUser = { email, username, password };
    localStorage.setItem("sellerUser", JSON.stringify(newUser));
    localStorage.setItem("sellerAuth", "true");
    navigate(redirectTo);
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      {!isLogin && (
        <div className="input-field" required>
          <label>Email</label>
          <input
            type="email" required
            placeholder="seller@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <div className="input-field" required>
        <label>Username</label>
        <input
          type="text"
          placeholder="seller123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="input-field" required>
        <label>Password</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={isLogin ? handleLogin : handleRegister}>
        {isLogin ? "Login" : "Sign Up"}
      </button>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="toggle-button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default SellerLogin;