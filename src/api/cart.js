const API_ROOT = "http://localhost:5000"; // Match your Flask server address

export async function buyNow() {
  const res = await fetch(`${API_ROOT}/cart/buy_now`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.json();
}

export async function checkoutComplete() {
  const res = await fetch(`${API_ROOT}/cart/checkout_complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.json();
}