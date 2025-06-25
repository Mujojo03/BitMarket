import { useState } from 'react';
import { buyNow, checkoutComplete } from '../api/cart';
import QRCode from 'react-qr-code'; // Install with: npm install react-qr-code

export default function Checkout() {
  const [invoice, setInvoice] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  const handleBuyNow = async () => {
    try {
      const { payment_request, payment_id } = await buyNow();
      setInvoice(payment_request);
      startPaymentPolling(payment_id); // Poll for payment status
    } catch (err) {
      alert("Failed to create invoice: " + err.message);
    }
  };

  const startPaymentPolling = (paymentId) => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_ROOT}/payments/${paymentId}/status`);
      const { status } = await res.json();
      
      if (status === "paid") {
        clearInterval(interval);
        setIsPaid(true);
        await checkoutComplete(); // Clear cart
        alert("Payment confirmed!");
      }
    }, 3000); // Poll every 3 seconds
  };

  return (
    <div className="checkout-container">
      {!invoice ? (
        <button onClick={handleBuyNow} className="buy-now-btn">
          ⚡ Buy Now with Lightning
        </button>
      ) : (
        <div className="invoice-section">
          {!isPaid ? (
            <>
              <h3>Scan to Pay</h3>
              <QRCode value={invoice} size={200} />
              <p className="invoice-string">{invoice.substring(0, 30)}...</p>
              <p>Waiting for payment confirmation...</p>
            </>
          ) : (
            <div className="success-message">
              ✅ Payment successful! Your order is complete.
            </div>
          )}
        </div>
      )}
    </div>
  );
}