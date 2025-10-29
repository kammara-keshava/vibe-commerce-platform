const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}

async function getCart() {
  const res = await fetch(`${API_BASE}/cart`);
  return res.json();
}

async function addToCart(productId, qty = 1) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
  return res.json();
}

async function removeCart(cartId) {
  const res = await fetch(`${API_BASE}/cart/${cartId}`, { method: 'DELETE' });
  return res.json();
}

async function updateCart(cartId, qty) {
  const res = await fetch(`${API_BASE}/cart/${cartId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty })
  });
  return res.json();
}

async function checkout(payload) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export { getProducts, getCart, addToCart, removeCart, updateCart, checkout };
