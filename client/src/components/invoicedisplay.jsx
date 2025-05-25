import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode.react";
import { io } from "socket.io-client";

/**
 * InvoiceDisplay component displays a Lightning invoice for the provided amount and memo.
 * It listens for invoice status via Socket.IO and redirects on successful payment.
 */
function InvoiceDisplay({ amount, memo, orderId, node, onClose }) {
  const [invoiceData, setInvoiceData] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");
  const [paid, setPaid] = useState(false);
  const socket = useRef(null);

  const createInvoice = async () => {
    try {
      const response = await fetch("/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, memo, order_id: orderId, node }),
      });

      if (!response.ok) throw new Error("Failed to create invoice");

      const data = await response.json();
      setInvoiceData(data);
      setCopySuccess("");
      setPaid(false);
      openSocketConnection(data.payment_hash);
    } catch (err) {
      console.error(err);
      alert("Error creating invoice");
    }
  };

  const openSocketConnection = (paymentHash) => {
    if (socket.current) {
      socket.current.disconnect();
    }

    socket.current = io(`http://${window.location.hostname}:5000`, {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log("Socket.IO connected");
      socket.current.emit("subscribe_invoice", { payment_hash: paymentHash });
    });

    socket.current.on("invoice_update", (message) => {
      console.log("Invoice update received:", message);
      if (message.paid) {
        setPaid(true);
        socket.current.disconnect();
        window.location.href = `/cart/checkout_complete?order_id=${orderId}`;
      }
    });

    socket.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket.IO connect error:", err);
    });
  };

  useEffect(() => {
    createInvoice();

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  const copyToClipboard = () => {
    if (invoiceData?.payment_request) {
      navigator.clipboard
        .writeText(invoiceData.payment_request)
        .then(() => setCopySuccess("Copied!"))
        .catch(() => setCopySuccess("Failed to copy"));
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Invoice</h3>
      {invoiceData ? (
        <>
          <QRCode value={invoiceData.payment_request} size={256} />
          <p style={{ wordBreak: "break-all" }}>{invoiceData.payment_request}</p>
          <button className="btn btn-sm btn-secondary" onClick={copyToClipboard}>
            Copy Invoice
          </button>
          {copySuccess && <span style={{ marginLeft: 10 }}>{copySuccess}</span>}
          <p className="mt-3">Waiting for payment...</p>
          {onClose && (
            <button className="btn btn-sm btn-outline-danger mt-2" onClick={onClose}>
              Cancel
            </button>
          )}
        </>
      ) : (
        <p>Creating invoice...</p>
      )}
      {paid && <p style={{ color: "green" }}>Payment successful! Redirecting...</p>}
    </div>
  );
}

export default InvoiceDisplay;

