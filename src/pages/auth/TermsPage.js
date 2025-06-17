import React from 'react';

const Terms = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-6"><strong>Effective Date:</strong> 25th May 2025</p>

      <h2 className="text-xl font-semibold mt-4">1. 🔐 Accounts</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>You must be 18 years or older to use SatSoko.</li>
        <li>Email verification is required at sign-up.</li>
        <li>You’re responsible for activity under your account.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">2. 🛒 Buying</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>Browse items, add to cart, and pay using a Lightning wallet.</li>
        <li>Wallet connection is required at checkout (QR, LNURL, or address).</li>
        <li>No KYC is needed for basic buying.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">3. 🛍️ Selling</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>Complete a seller profile to start selling.</li>
        <li>You must provide a Lightning address to receive payments.</li>
        <li>You're responsible for honest listings and fulfilling orders.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">4. ₿ 💲 Payments</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>All payments are processed through the Lightning Network.</li>
        <li>We do not hold or control your funds.</li>
        <li>Ensure your wallet is properly set up before use.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">5. ❌ Prohibited Activities</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>No selling illegal or harmful products.</li>
        <li>No scams or misleading behavior.</li>
        <li>Violating these terms may result in account suspension.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">6. Liability</h2>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>We strive for a smooth experience, but issues may occur.</li>
        <li>We are not responsible for third-party actions or lost funds.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">7. Changes to Terms</h2>
      <p className="mb-4">We may update these terms and will notify you of important changes.</p>
      <p className="mt-2">By continuing to use SatSoko after changes, you agree to the updated terms.</p>

      <h2 className="text-xl font-semibold mt-4">8. Contact</h2>
      <p>Need help? Contact us at [Insert Contact Email].</p>
    </div>
  );
};

export default Terms;
// This code defines a simple Terms of Service page for a fictional e-commerce platform called SatSoko.
// It outlines the terms for accounts, buying, selling, payments, prohibited activities, liability, changes to terms, and contact information.