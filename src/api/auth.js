const API_ROOT = "http://localhost:5000";

export async function login({ email, phone, password }) {
  const body = { email, phone, password };
  const res = await fetch(`${API_ROOT}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().then((data) => ({ ok: res.ok, data }));
}

export async function signup(role, payload) {
  console.log("SIGNUP PAYLOAD:", payload);
  const url = `${API_ROOT}/register/${role}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json().then((data) => ({ ok: res.ok, data }));
}