import React from 'react';

const Privacy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy 🔐</h1>
      <p className="mb-6"><strong>Effective Date:</strong> 25th May 2025</p>

      <h2 className="text-xl font-semibold mt-4">1. What We Collect 📒</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>Email, name, and password during registration.</li>
        <li>Lightning wallet information (QR, LNURL, or address).</li>
        <li>Order details and activity on our site.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">2. Why We Collect It</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>To help you buy, sell, and track orders.</li>
        <li>To send order updates and important notifications.</li>
        <li>To improve your experience on SatSoko.</li>
        <li>To detect fraud and ensure security.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">3. How We Store It</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>Your data is stored securely.</li>
        <li>Passwords are encrypted.</li>
        <li>We do not store your wallet funds.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">4. Sharing</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>We never sell your personal data.</li>
        <li>We only share data when required by law or to complete your order.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">5. Your Choices</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>You can update or delete your profile at any time.</li>
        <li>You can disconnect your wallet from settings.</li>
        <li>Contact us at [Insert Email] for any data requests.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">6. Children</h2>
      <p className="mb-4">Our platform is intended for users aged 18 and older only.</p>

      <h2 className="text-xl font-semibold mt-4">7. Changes</h2>
      <p>We may update this policy and will notify you of any major changes.</p>
    </div>
  );
};

export default Privacy;
// This code defines a React component for the Privacy Policy page of a web application.
// It includes sections on data collection, usage, storage, sharing, user choices, and more.