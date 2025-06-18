const API_ROOT = "http://localhost:5000";

// Helper function to add authorization headers
function getAuthHeaders() {
  const token = localStorage.getItem('token'); // Assuming you store token after login
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

// Create a new order
export async function createOrder(orderData) {
  const res = await fetch(`${API_ROOT}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });
  return res.json().then(data => ({ ok: res.ok, data }));
}

// Get all orders for current user
export async function getOrders() {
  const res = await fetch(`${API_ROOT}/orders`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  return res.json().then(data => ({ ok: res.ok, data }));
}

// Update an order
export async function updateOrder(orderId, updates) {
  const res = await fetch(`${API_ROOT}/orders/${orderId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  return res.json().then(data => ({ ok: res.ok, data }));
}

// Delete an order
export async function deleteOrder(orderId) {
  const res = await fetch(`${API_ROOT}/orders/${orderId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return res.json().then(data => ({ ok: res.ok, data }));
}