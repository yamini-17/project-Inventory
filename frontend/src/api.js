// api.js — fetch to /api will be proxied to Flask backend at localhost:5000
const API_BASE = "/api";

async function fetchJSON(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return res.json();
}

export const productsAPI = {
  list: () => fetchJSON("/products"),
  create: (p) => fetchJSON("/products", { method: "POST", body: JSON.stringify(p) }),
  update: (id, p) => fetchJSON(`/products/${id}`, { method: "PUT", body: JSON.stringify(p) }),
  delete: (id) => fetchJSON(`/products/${id}`, { method: "DELETE" })
};

export const locationsAPI = {
  list: () => fetchJSON("/locations"),
  create: (l) => fetchJSON("/locations", { method: "POST", body: JSON.stringify(l) }),
  update: (id, l) => fetchJSON(`/locations/${id}`, { method: "PUT", body: JSON.stringify(l) }),
  delete: (id) => fetchJSON(`/locations/${id}`, { method: "DELETE" })
};

export const movementsAPI = {
  list: () => fetchJSON("/movements"),
  create: (m) => fetchJSON("/movements", { method: "POST", body: JSON.stringify(m) }),
  update: (id, m) => fetchJSON(`/movements/${id}`, { method: "PUT", body: JSON.stringify(m) }),
  delete: (id) => fetchJSON(`/movements/${id}`, { method: "DELETE" })
};

export const reportAPI = {
  balance: () => fetchJSON("/report/balance")
};
