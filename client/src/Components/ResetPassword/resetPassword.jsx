import React, { useState } from 'react';
import './resetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You'd normally send this email to the server here
    setSubmitted(true);
  };

  return (
    <div className="reset-container">
      <h2>Reset Password</h2>
      {submitted ? (
        <p className="notification">✅ Email sent to prompt you to reset password.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Email</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
