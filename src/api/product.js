const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";


export async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.message || JSON.stringify(data);
    } catch {
      message = await res.text();
    }
    throw new Error(message || `${res.status} ${res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

export const ProductAPI = {
  async create(payload, token) {
    return request("/products/create", {
      method: "POST",
      body: payload,
      token,
    });
  },
  async listMine(token) {
    return request("/products/mine", { token });
  },

  async listCategories() {
    return request("/categories");
  },
};