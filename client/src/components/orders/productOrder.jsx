import React, { useState } from 'react';
import $ from 'jquery';

function ProductOrder({ productOrder, onUpdate, onDelete }) {
  const [quantity, setQuantity] = useState(productOrder.quantity);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(productOrder.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';
  const token = localStorage.getItem('access_token');

  const handleSave = () => {
    setLoading(true);
    setError(null);

    $.ajax({
      url: `${API_BASE_URL}/product_orders/${productOrder.id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify({ quantity, status }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (updatedOrder) {
        onUpdate(updatedOrder);
        setIsEditing(false);
      },
      error: function (xhr) {
        setError(xhr.responseText || 'Failed to update product order');
      },
      complete: function () {
        setLoading(false);
      },
    });
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this product order?')) return;

    setLoading(true);
    setError(null);

    $.ajax({
      url: `${API_BASE_URL}/product_orders/${productOrder.id}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function () {
        onDelete(productOrder.id);
      },
      error: function (xhr) {
        setError(xhr.responseText || 'Failed to delete product order');
      },
      complete: function () {
        setLoading(false);
      },
    });
  };

  return (
    <li style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '0.5rem' }}>
      <strong>{productOrder.product.name}</strong> — Subtotal: {productOrder.subtotal} sats
      {isEditing ? (
        <>
          <div>
            Quantity:{' '}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </div>
          <div>
            Status:{' '}
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button onClick={handleSave} disabled={loading}>
            Save
          </button>{' '}
          <button onClick={() => setIsEditing(false)} disabled={loading}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <div>Quantity: {quantity}</div>
          <div>Status: {status}</div>
          <button onClick={() => setIsEditing(true)} disabled={loading}>
            Edit
          </button>{' '}
          <button onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </>
      )}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </li>
  );
}

export default ProductOrder;
