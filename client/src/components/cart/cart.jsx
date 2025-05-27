import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import $ from "jquery";
import "./cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart_items")) || [];
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync a single cart item quantity to backend with jQuery AJAX
  const syncCartItemToBackend = (item) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    $.ajax({
      url: "http://localhost:5000/cart/add",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        product_id: item.id,
        quantity: item.quantity || 1,
      }),
    }).fail((jqXHR) => {
      const errMsg = jqXHR.responseJSON?.message || "Failed to sync cart item";
      console.error("Sync cart item error:", errMsg);
    });
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...cartItems];
    updated[index].quantity = Math.max(1, (updated[index].quantity || 1) + delta);
    setCartItems(updated);
    syncCartItemToBackend(updated[index]);
  };

  const handleRemoveItem = (index) => {
    const updated = [...cartItems];
    const removedItem = updated.splice(index, 1)[0];
    setCartItems(updated);
    if (removedItem) {
      syncCartItemToBackend({ ...removedItem, quantity: 0 });
    }
  };

  // Generate payment invoice for a single item ("Buy Now")
  const handleBuyNow = (item) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to proceed with purchase.");
      navigate("/login");
      return;
    }

    $.ajax({
      url: "http://localhost:5000/cart/buy_now",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        product_id: item.id,
        quantity: item.quantity || 1,
      }),
      success: (data) => {
        setInvoice(data);
      },
      error: (jqXHR) => {
        const errMsg = jqXHR.responseJSON?.message || "Failed to generate invoice";
        console.error("Buy Now error:", errMsg);
        alert("Failed to generate invoice.");
      },
    });
  };

  // Complete checkout for whole cart
  const handleCheckout = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to proceed with checkout.");
      navigate("/login");
      return;
    }

    setLoading(true);

    $.ajax({
      url: "http://localhost:5000/cart/checkout_complete",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: () => {
        alert("Checkout complete!");
        setInvoice(null);
        setCartItems([]);
        localStorage.removeItem("cart_items");
      },
      error: (jqXHR) => {
        const errMsg = jqXHR.responseJSON?.message || "Checkout failed";
        console.error("Checkout error:", errMsg);
        alert("Checkout failed.");
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const copyInvoice = () => {
    if (invoice?.payment_request) {
      navigator.clipboard.writeText(invoice.payment_request);
      alert("Invoice copied to clipboard!");
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 && <p>Your cart is empty.</p>}

      {cartItems.map((item, index) => (
        <div key={item.id} className="cart-item">
          <div className="item-info">
            <h3>{item.name}</h3>
            <p>Price: ${item.price.toFixed(2)}</p>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(index, -1)}>-</button>
              <span>{item.quantity || 1}</span>
              <button onClick={() => handleQuantityChange(index, 1)}>+</button>
            </div>
            <button
              className="remove-btn"
              onClick={() => handleRemoveItem(index)}
              aria-label={`Remove ${item.name} from cart`}
            >
              Remove
            </button>
          </div>
          <div className="buy-now">
            <button onClick={() => handleBuyNow(item)}>Buy Now</button>
          </div>
        </div>
      ))}

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      )}

      {invoice && (
        <div className="invoice-section">
          <h3>Payment Invoice</h3>
          <QRCode value={invoice.payment_request} size={256} />
          <textarea
            readOnly
            value={invoice.payment_request}
            rows={4}
            cols={50}
            style={{ marginTop: "10px" }}
          />
          <br />
          <button onClick={copyInvoice}>Copy Invoice</button>

          {/* Navigate to Payment.jsx to complete payment */}
          <button onClick={() => navigate("/payment", { state: { invoice } })}>
            Proceed to Payment
          </button>

          <button onClick={() => setInvoice(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Cart;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import QRCode from "qrcode.react";
// import $ from "jquery";
// import "./cart.css";

// const Cart = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [invoice, setInvoice] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const savedCart = JSON.parse(localStorage.getItem("cart_items")) || [];
//     setCartItems(savedCart);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart_items", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Sync a single cart item quantity to backend with jQuery AJAX
//   const syncCartItemToBackend = (item) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return;

//     $.ajax({
//       url: "http://localhost:5000/cart/add",
//       method: "POST",
//       contentType: "application/json",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: JSON.stringify({
//         product_id: item.id,
//         quantity: item.quantity || 1,
//       }),
//     }).fail((jqXHR) => {
//       const errMsg = jqXHR.responseJSON?.message || "Failed to sync cart item";
//       console.error("Sync cart item error:", errMsg);
//     });
//   };

//   const handleQuantityChange = (index, delta) => {
//     const updated = [...cartItems];
//     updated[index].quantity = Math.max(1, (updated[index].quantity || 1) + delta);
//     setCartItems(updated);
//     syncCartItemToBackend(updated[index]);
//   };

//   const handleRemoveItem = (index) => {
//     const updated = [...cartItems];
//     const removedItem = updated.splice(index, 1)[0];
//     setCartItems(updated);
//     if (removedItem) {
//       syncCartItemToBackend({ ...removedItem, quantity: 0 });
//     }
//   };

//   // Generate payment invoice for a single item ("Buy Now")
//   const handleBuyNow = (item) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Please log in to proceed with purchase.");
//       navigate("/login");
//       return;
//     }

//     $.ajax({
//       url: "http://localhost:5000/cart/buy_now",
//       method: "POST",
//       contentType: "application/json",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: JSON.stringify({
//         product_id: item.id,
//         quantity: item.quantity || 1,
//       }),
//       success: (data) => {
//         setInvoice(data);
//       },
//       error: (jqXHR) => {
//         const errMsg = jqXHR.responseJSON?.message || "Failed to generate invoice";
//         console.error("Buy Now error:", errMsg);
//         alert("Failed to generate invoice.");
//       },
//     });
//   };

//   // Complete checkout for whole cart
//   const handleCheckout = () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Please log in to proceed with checkout.");
//       navigate("/login");
//       return;
//     }

//     setLoading(true);

//     $.ajax({
//       url: "http://localhost:5000/cart/checkout_complete",
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       success: () => {
//         alert("Checkout complete!");
//         setInvoice(null);
//         setCartItems([]);
//         localStorage.removeItem("cart_items");
//       },
//       error: (jqXHR) => {
//         const errMsg = jqXHR.responseJSON?.message || "Checkout failed";
//         console.error("Checkout error:", errMsg);
//         alert("Checkout failed.");
//       },
//       complete: () => {
//         setLoading(false);
//       },
//     });
//   };

//   const totalPrice = cartItems.reduce(
//     (sum, item) => sum + item.price * (item.quantity || 1),
//     0
//   );

//   const copyInvoice = () => {
//     if (invoice?.payment_request) {
//       navigator.clipboard.writeText(invoice.payment_request);
//       alert("Invoice copied to clipboard!");
//     }
//   };

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 && <p>Your cart is empty.</p>}

//       {cartItems.map((item, index) => (
//         <div key={item.id} className="cart-item">
//           <div className="item-info">
//             <h3>{item.name}</h3>
//             <p>Price: ${item.price.toFixed(2)}</p>
//             <div className="quantity-control">
//               <button onClick={() => handleQuantityChange(index, -1)}>-</button>
//               <span>{item.quantity || 1}</span>
//               <button onClick={() => handleQuantityChange(index, 1)}>+</button>
//             </div>
//             <button
//               className="remove-btn"
//               onClick={() => handleRemoveItem(index)}
//               aria-label={`Remove ${item.name} from cart`}
//             >
//               Remove
//             </button>
//           </div>
//           <div className="buy-now">
//             <button onClick={() => handleBuyNow(item)}>Buy Now</button>
//           </div>
//         </div>
//       ))}

//       {cartItems.length > 0 && (
//         <div className="cart-summary">
//           <p>Total Price: ${totalPrice.toFixed(2)}</p>
//           <button onClick={handleCheckout} disabled={loading}>
//             {loading ? "Processing..." : "Checkout"}
//           </button>
//         </div>
//       )}

//       {invoice && (
//         <div className="invoice-section">
//           <h3>Payment Invoice</h3>
//           <QRCode value={invoice.payment_request} size={256} />
//           <textarea
//             readOnly
//             value={invoice.payment_request}
//             rows={4}
//             cols={50}
//             style={{ marginTop: "10px" }}
//           />
//           <br />
//           <button onClick={copyInvoice}>Copy Invoice</button>
//           <button onClick={() => setInvoice(null)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

