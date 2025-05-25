import React, { useState, useEffect } from 'react';
import ProductOrder from './ProductOrder';

const API_BASE = 'http://localhost:5000/orders';
const API_BASE_URL = 'http://localhost:5000';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newOrderUserId, setNewOrderUserId] = useState('');
  const [newOrderProducts, setNewOrderProducts] = useState([{ product_id: '', quantity: '' }]);
  const [formErrors, setFormErrors] = useState({});

  const [productOrders, setProductOrders] = useState([]);
  const [productOrdersLoading, setProductOrdersLoading] = useState(true);
  const [productOrdersError, setProductOrdersError] = useState(null);

  const token = localStorage.getItem('access_token');

  // Helper: Fetch with Authorization header and JSON parsing
  async function fetchWithAuth(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }
    return response.json();
  }

  // Fetch all orders
  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(API_BASE);
      setOrders(data);
    } catch (err) {
      setError(`Error fetching orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Fetch a single order detail
  async function fetchOrder(orderId) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`${API_BASE}/${orderId}`);
      setSelectedOrder(data);
    } catch (err) {
      setError(`Error fetching order #${orderId}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Delete order by id
  async function deleteOrder(orderId) {
    if (!window.confirm(`Delete order #${orderId}? This cannot be undone.`)) return;
    setLoading(true);
    setError(null);
    try {
      await fetchWithAuth(`${API_BASE}/${orderId}`, { method: 'DELETE' });
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
      if (selectedOrder?.order_id === orderId) setSelectedOrder(null);
    } catch (err) {
      setError(`Error deleting order #${orderId}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Fetch product orders
  async function fetchProductOrders() {
    setProductOrdersLoading(true);
    setProductOrdersError(null);
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/product_orders`);
      setProductOrders(data.product_orders || []);
    } catch (err) {
      setProductOrdersError(err.message);
    } finally {
      setProductOrdersLoading(false);
    }
  }

  // Validate create order form
  function validateForm() {
    const errors = {};
    if (!newOrderUserId.trim()) errors.userId = 'User ID is required';
    newOrderProducts.forEach((p, i) => {
      if (!p.product_id) errors[`product_id_${i}`] = 'Product ID required';
      if (!p.quantity || isNaN(p.quantity) || p.quantity <= 0)
        errors[`quantity_${i}`] = 'Quantity must be a positive number';
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Create a new order
  async function createOrder(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      buyer_id: newOrderUserId,
      products: newOrderProducts.map(({ product_id, quantity }) => ({
        product_id,
        quantity: Number(quantity),
      })),
    };

    setLoading(true);
    setError(null);
    try {
      const created = await fetchWithAuth(API_BASE, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setOrders((prev) => [...prev, created]);
      setNewOrderUserId('');
      setNewOrderProducts([{ product_id: '', quantity: '' }]);
      setFormErrors({});
    } catch (err) {
      setError(`Error creating order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Handle form product line changes
  function updateProductLine(index, field, value) {
    setNewOrderProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  // Add a new product line in the form
  function addProductLine() {
    setNewOrderProducts((prev) => [...prev, { product_id: '', quantity: '' }]);
  }

  // Remove a product line in the form
  function removeProductLine(index) {
    setNewOrderProducts((prev) => prev.filter((_, i) => i !== index));
  }

  // ProductOrder update & delete handlers for child component
  const handleProductOrderUpdate = (updatedOrder) => {
    setProductOrders((prev) =>
      prev.map((po) => (po.id === updatedOrder.id ? updatedOrder : po))
    );
  };

  const handleProductOrderDelete = (deletedId) => {
    setProductOrders((prev) => prev.filter((po) => po.id !== deletedId));
  };

  // On component mount, fetch orders and product orders if token present
  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchProductOrders();
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h1>Order Manager</h1>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <button onClick={fetchOrders} disabled={loading}>
        Refresh Orders
      </button>

      <h2>Orders</h2>
      {loading && <p>Loading...</p>}
      <ul>
        {orders.map((o) => (
          <li key={o.order_id} style={{ marginBottom: 10 }}>
            <strong>Order #{o.order_id}</strong> - Status: {o.status} - Buyer: {o.buyer_id}
            <button
              style={{ marginLeft: 10 }}
              onClick={() => fetchOrder(o.order_id)}
              disabled={loading}
            >
              View
            </button>
            <button
              style={{ marginLeft: 10 }}
              onClick={() => deleteOrder(o.order_id)}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div
          style={{
            border: '1px solid #ccc',
            padding: 15,
            marginTop: 20,
            borderRadius: 6,
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>Order Details #{selectedOrder.order_id}</h3>
          <p>
            <strong>Status:</strong> {selectedOrder.status}
          </p>
          <p>
            <strong>Buyer ID:</strong> {selectedOrder.buyer_id}
          </p>
          <h4>Products:</h4>
          <ul>
            {selectedOrder.products?.map((p, i) => (
              <li key={i}>
                Product ID: {p.product_id}, Quantity: {p.quantity}
              </li>
            )) || <li>No products listed.</li>}
          </ul>
          <button onClick={() => setSelectedOrder(null)}>Close Details</button>
        </div>
      )}

      <h2>Create New Order</h2>
      <form onSubmit={createOrder} style={{ marginBottom: 40 }}>
        <div>
          <label>
            Buyer User ID:
            <input
              type="text"
              value={newOrderUserId}
              onChange={(e) => setNewOrderUserId(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </label>
          {formErrors.userId && (
            <div style={{ color: 'red' }}>{formErrors.userId}</div>
          )}
        </div>

        <h4>Products</h4>
        {newOrderProducts.map((p, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 10,
              padding: 10,
              border: '1px solid #ddd',
              borderRadius: 6,
            }}
          >
            <label>
              Product ID:
              <input
                type="text"
                value={p.product_id}
                onChange={(e) =>
                  updateProductLine(idx, 'product_id', e.target.value)
                }
                style={{ marginLeft: 10 }}
              />
            </label>
            {formErrors[`product_id_${idx}`] && (
              <div style={{ color: 'red' }}>{formErrors[`product_id_${idx}`]}</div>
            )}
            <br />
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={p.quantity}
                onChange={(e) =>
                  updateProductLine(idx, 'quantity', e.target.value)
                }
                style={{ marginLeft: 10, width: 60 }}
              />
            </label>
            {formErrors[`quantity_${idx}`] && (
              <div style={{ color: 'red' }}>{formErrors[`quantity_${idx}`]}</div>
            )}
            <br />
            {newOrderProducts.length > 1 && (
              <button
                type="button"
                onClick={() => removeProductLine(idx)}
                style={{ marginTop: 5, backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addProductLine} style={{ marginBottom: 10 }}>
          Add Product
        </button>
        <br />
        <button type="submit" disabled={loading}>
          Create Order
        </button>
      </form>

      {/* Product Orders Section */}
      <h2>Product Orders</h2>
      {productOrdersLoading && <p>Loading product orders...</p>}
      {productOrdersError && <p style={{ color: 'red' }}>Error: {productOrdersError}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {productOrders.map((po) => (
          <ProductOrder
            key={po.id}
            productOrder={po}
            onUpdate={handleProductOrderUpdate}
            onDelete={handleProductOrderDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default OrderManager;

// import React, { useState, useEffect } from 'react';
// import $ from 'jquery';

// const API_BASE = 'http://localhost:5000/orders';

// export default function OrderManager() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // New order form state
//   const [newOrderUserId, setNewOrderUserId] = useState('');
//   const [newOrderProducts, setNewOrderProducts] = useState([{ product_id: '', quantity: '' }]);
//   const [formErrors, setFormErrors] = useState({});

//   function validateForm() {
//     const errors = {};
//     if (!newOrderUserId || isNaN(newOrderUserId) || parseInt(newOrderUserId, 10) <= 0) {
//       errors.userId = 'User ID must be a positive number';
//     }
//     newOrderProducts.forEach((p, i) => {
//       if (!p.product_id || isNaN(p.product_id) || parseInt(p.product_id, 10) <= 0) {
//         errors[`product_id_${i}`] = 'Product ID must be a positive number';
//       }
//       if (!p.quantity || isNaN(p.quantity) || parseInt(p.quantity, 10) <= 0) {
//         errors[`quantity_${i}`] = 'Quantity must be a positive number';
//       }
//     });
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   }

//   async function fetchOrders() {
//     setLoading(true);
//     setError(null);
//     $.ajax({
//       url: API_BASE,
//       method: 'GET',
//       headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//       dataType: 'json',
//       success(data) {
//         setOrders(data);
//       },
//       error(jqXHR) {
//         setError(`Error fetching orders: ${jqXHR.statusText || jqXHR.status}`);
//       },
//       complete() {
//         setLoading(false);
//       },
//     });
//   }

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   function fetchOrder(orderId) {
//     setLoading(true);
//     setError(null);
//     $.ajax({
//       url: `${API_BASE}/${orderId}`,
//       method: 'GET',
//       headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//       dataType: 'json',
//       success(data) {
//         setSelectedOrder(data);
//       },
//       error(jqXHR) {
//         setError(`Error fetching order: ${jqXHR.statusText || jqXHR.status}`);
//       },
//       complete() {
//         setLoading(false);
//       },
//     });
//   }

//   function deleteOrder(orderId) {
//     if (!window.confirm('Are you sure you want to delete this order?')) return;

//     const prevOrders = [...orders];
//     setOrders(orders.filter(o => o.order_id !== orderId));
//     if (selectedOrder?.order_id === orderId) setSelectedOrder(null);
//     setError(null);
//     setLoading(true);

//     $.ajax({
//       url: `${API_BASE}/${orderId}`,
//       method: 'DELETE',
//       headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//       success() {
//         // no content expected
//       },
//       error(jqXHR) {
//         setOrders(prevOrders);
//         setError(`Error deleting order: ${jqXHR.statusText || jqXHR.status}`);
//       },
//       complete() {
//         setLoading(false);
//       },
//     });
//   }

//   function updateOrder(orderId, updateData) {
//     setError(null);

//     const prevOrders = [...orders];
//     const prevSelectedOrder = selectedOrder;

//     setOrders(orders.map(o => (o.order_id === orderId ? { ...o, ...updateData } : o)));
//     if (selectedOrder?.order_id === orderId) {
//       setSelectedOrder({ ...selectedOrder, ...updateData });
//     }

//     setLoading(true);
//     $.ajax({
//       url: `${API_BASE}/${orderId}`,
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//       },
//       data: JSON.stringify(updateData),
//       dataType: 'json',
//       success(data) {
//         setSelectedOrder(data);
//         fetchOrders();
//       },
//       error(jqXHR) {
//         setOrders(prevOrders);
//         setSelectedOrder(prevSelectedOrder);
//         setError(`Error updating order: ${jqXHR.statusText || jqXHR.status}`);
//       },
//       complete() {
//         setLoading(false);
//       },
//     });
//   }

//   function createOrder() {
//     if (!validateForm()) return;

//     setError(null);
//     setLoading(true);

//     const products = newOrderProducts.map(p => ({
//       product_id: parseInt(p.product_id, 10),
//       quantity: parseInt(p.quantity, 10),
//     }));

//     const tempOrder = {
//       order_id: Math.random() * -1000,
//       buyer_id: parseInt(newOrderUserId, 10),
//       status: 'pending',
//       products,
//       created_at: new Date().toISOString(),
//     };
//     const prevOrders = [...orders];
//     setOrders([tempOrder, ...orders]);

//     $.ajax({
//       url: API_BASE,
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//       },
//       data: JSON.stringify({
//         user_id: parseInt(newOrderUserId, 10),
//         products,
//       }),
//       dataType: 'json',
//       success(data) {
//         setSelectedOrder(data);
//         setNewOrderUserId('');
//         setNewOrderProducts([{ product_id: '', quantity: '' }]);
//         fetchOrders();
//       },
//       error(jqXHR) {
//         const errMsg = jqXHR.responseJSON?.message || 'Error creating order';
//         setError(errMsg);
//         setOrders(prevOrders);
//       },
//       complete() {
//         setLoading(false);
//       },
//     });
//   }

//   function handleProductChange(index, field, value) {
//     const newProducts = [...newOrderProducts];
//     newProducts[index][field] = value;
//     setNewOrderProducts(newProducts);
//   }

//   function addProductField() {
//     setNewOrderProducts([...newOrderProducts, { product_id: '', quantity: '' }]);
//   }

//   function removeProductField(index) {
//     if (newOrderProducts.length === 1) return;
//     setNewOrderProducts(newOrderProducts.filter((_, i) => i !== index));
//   }

//   return (
//     <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
//       <h1>Order Manager</h1>

//       {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

//       <button onClick={fetchOrders} disabled={loading}>
//         Refresh Orders
//       </button>

//       <h2>Orders</h2>
//       {loading && <p>Loading...</p>}
//       <ul>
//         {orders.map(o => (
//           <li key={o.order_id} style={{ marginBottom: 10 }}>
//             <strong>Order #{o.order_id}</strong> - Status: {o.status} - Buyer: {o.buyer_id}
//             <button style={{ marginLeft: 10 }} onClick={() => fetchOrder(o.order_id)} disabled={loading}>
//               View
//             </button>
//             <button style={{ marginLeft: 10 }} onClick={() => deleteOrder(o.order_id)} disabled={loading}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>

//       <h2>Create New Order</h2>
//       <div>
//         <label>User ID: </label>
//         <input
//           type="number"
//           value={newOrderUserId}
//           onChange={e => setNewOrderUserId(e.target.value)}
//           disabled={loading}
//           style={{ borderColor: formErrors.userId ? 'red' : undefined }}
//         />
//         {formErrors.userId && <div style={{ color: 'red' }}>{formErrors.userId}</div>}
//       </div>

//       <h3>Products</h3>
//       {newOrderProducts.map((p, i) => (
//         <div key={i} style={{ marginBottom: 8 }}>
//           <input
//             type="number"
//             placeholder="Product ID"
//             value={p.product_id}
//             onChange={e => handleProductChange(i, 'product_id', e.target.value)}
//             disabled={loading}
//             style={{ width: 100, marginRight: 8, borderColor: formErrors[`product_id_${i}`] ? 'red' : undefined }}
//           />
//           {formErrors[`product_id_${i}`] && (
//             <div style={{ color: 'red', display: 'inline-block', marginRight: 8 }}>{formErrors[`product_id_${i}`]}</div>
//           )}
//           <input
//             type="number"
//             placeholder="Quantity"
//             value={p.quantity}
//             onChange={e => handleProductChange(i, 'quantity', e.target.value)}
//             disabled={loading}
//             style={{ width: 100, marginRight: 8, borderColor: formErrors[`quantity_${i}`] ? 'red' : undefined }}
//           />
//           {formErrors[`quantity_${i}`] && (
//             <div style={{ color: 'red', display: 'inline-block', marginRight: 8 }}>{formErrors[`quantity_${i}`]}</div>
//           )}
//           <button onClick={() => removeProductField(i)} disabled={loading}>
//             Remove
//           </button>
//         </div>
//       ))}
//       <button onClick={addProductField} disabled={loading}>
//         Add Product
//       </button>

//       <div style={{ marginTop: 10 }}>
//         <button
//           onClick={createOrder}
//           disabled={
//             loading ||
//             !newOrderUserId ||
//             newOrderProducts.length === 0 ||
//             Object.keys(formErrors).length > 0
//           }
//         >
//           Create Order
//         </button>
//       </div>

//       {selectedOrder && (
//         <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 10 }}>
//           <h2>Order Detail (#{selectedOrder.order_id})</h2>
//           <p>Status: {selectedOrder.status}</p>
//           <p>Buyer ID: {selectedOrder.buyer_id}</p>
//           <p>Created At: {selectedOrder.created_at}</p>
//           <h3>Products:</h3>
//           <ul>
//             {selectedOrder.products.map((p, idx) => (
//               <li key={idx}>
//                 Product ID: {p.product_id}, Quantity: {p.quantity}
//               </li>
//             ))}
//           </ul>
//           <button
//             onClick={() => updateOrder(selectedOrder.order_id, { status: 'completed' })}
//             disabled={loading || selectedOrder.status === 'completed'}
//           >
//             Mark as Completed
//           </button>
//           <button onClick={() => setSelectedOrder(null)} disabled={loading} style={{ marginLeft: 10 }}>
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
