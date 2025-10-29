// frontend/src/App.jsx
import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  getProducts,
  getCart,
  addToCart,
  removeCart,
  updateCart,
  checkout,
} from './api';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import Header from './components/Header';
import Login from './components/Login';
import Receipt from './components/Receipt';
import Footer from './components/Footer'; // ← kept Footer import
import './index.css';

/* ---------------------------------------------------------------------- */
/* 🎨 Light Fallback Contexts (so you can run even without extra files)   */
/* ---------------------------------------------------------------------- */
const ThemeContext = createContext();
export function useTheme() {
  return useContext(ThemeContext) || { isDark: false, toggle: () => {} };
}

const ToastContext = createContext();
export function useToast() {
  return useContext(ToastContext) || {
    push: (msg, opts = {}) => {
      const el = document.createElement('div');
      el.textContent = msg;
      el.style.position = 'fixed';
      el.style.right = '18px';
      el.style.top = '18px';
      el.style.background =
        opts.type === 'error' ? '#ef4444' : opts.type === 'success' ? '#16a34a' : '#2563eb';
      el.style.color = '#fff';
      el.style.padding = '8px 12px';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 6px 18px rgba(2,6,23,0.15)';
      el.style.zIndex = 12000;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2200);
    },
  };
}

/* ---------------------------------------------------------------------- */
/* 🧩 Main Inner Application (your full existing logic)                    */
/* ---------------------------------------------------------------------- */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function InnerApp() {
  const { isDark, toggle } = useTheme();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('Hyderabad, IN');

  // Header cart panel control state (improved UX)
  const [cartPanelOpen, setCartPanelOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadCart();
    const u = localStorage.getItem('vibe_user');
    if (u) setUser(JSON.parse(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Loaders ---------------- */
  async function loadProducts() {
    try {
      const data = await getProducts();
      const normalized = (data || []).map((p) => ({
        ...p,
        image:
          p.image && !/^https?:\/\//i.test(p.image)
            ? `${API_BASE}${p.image.startsWith('/') ? p.image : '/' + p.image}`
            : p.image,
      }));
      setProducts(normalized);
    } catch (err) {
      console.error('Failed to load products', err);
      setProducts([]);
    }
  }

  async function loadCart() {
    try {
      const data = await getCart();
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];
      const total =
        data?.total ??
        items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0);
      setCart({ items, total });
    } catch (err) {
      console.error('Failed to load cart', err);
      setCart({ items: [], total: 0 });
    }
  }

  /* ---------------- Cart Actions ---------------- */
  async function handleAdd(productId) {
    setLoading(true);
    try {
      await addToCart(productId, 1);
      await loadCart();
      toast.push('Added to cart!', { type: 'success' });
      // optionally open cart panel briefly:
      // setCartPanelOpen(true);
    } catch (err) {
      console.error('Add failed', err);
      toast.push('Add to cart failed', { type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(cartId) {
    try {
      await removeCart(cartId);
      await loadCart();
      toast.push('Item removed from cart', { type: 'info' });
    } catch (err) {
      console.error('Remove failed', err);
      toast.push('Remove failed', { type: 'error' });
    }
  }

  async function handleUpdate(cartId, qty) {
    try {
      await updateCart(cartId, qty);
      await loadCart();
    } catch (err) {
      console.error('Update failed', err);
      toast.push('Update failed', { type: 'error' });
    }
  }

  /* ---------------- Checkout ---------------- */
  async function handleCheckout(customer) {
    const payload = {
      cartItems: (cart.items || []).map((i) => ({
        cartId: i.cartId,
        productId: i.productId,
        qty: i.qty,
      })),
      name: customer.name,
      email: customer.email,
      comments: customer.comments,
    };

    try {
      const res = await checkout(payload);
      const orderResponse = res?.order || res?.receipt || res;
      if (orderResponse) {
        setReceipt(orderResponse);
        setLastOrder(orderResponse);
        setShowCheckout(false);
        setShowReceipt(true);
        setCartPanelOpen(false); // close header panel after checkout
        await loadCart();
        toast.push('Checkout successful!', { type: 'success' });
      } else {
        toast.push('Checkout failed', { type: 'error' });
      }
    } catch (err) {
      console.error('Checkout error', err);
      toast.push('Checkout error: ' + err.message, { type: 'error' });
    }
  }

  /* ---------------- Logout ---------------- */
  function handleLogout() {
    localStorage.removeItem('vibe_user');
    setUser(null);
    toast.push('Logged out', { type: 'info' });
    navigate('/');
  }

  /* ---------------- Search Filter ---------------- */
  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  /* ---------------- UI Render ---------------- */
  return (
    <div className={`container ${isDark ? 'dark' : ''}`}>
      <Header
        onSearch={setSearch}
        user={user}
        onLogout={handleLogout}
        location={location}
        cartCount={(cart.items || []).length}
        onToggleTheme={toggle}
        isDark={isDark}
        // header cart panel wiring
        cart={cart}
        onCartOpen={() => setCartPanelOpen(true)}
        cartPanelOpen={cartPanelOpen}
        setCartPanelOpen={setCartPanelOpen}
        onRemoveFromCart={handleRemove}
        onUpdateCart={handleUpdate}
        onOpenCheckout={() => setShowCheckout(true)}
      />

      <main>
        <section className="products">
          <h2>Products</h2>
          <div className="grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => handleAdd(p.id)}
                disabled={loading}
              />
            ))}
          </div>
        </section>

        {/* cart sidebar intentionally removed (header contains cart panel) */}
      </main>

      {/* Checkout modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onRequestClose={() => setShowCheckout(false)}
        onSubmit={handleCheckout}
        cart={cart}
      />

      {/* -------------------------------------------------------------------
          Receipt modal: show as modal when an order is completed.
          Pass products + apiBase so Receipt can look up product names/images.
         ------------------------------------------------------------------- */}
      {showReceipt && lastOrder && (
        <Receipt
          order={lastOrder}
          products={products}
          apiBase={API_BASE}
          onClose={() => {
            setShowReceipt(false);
            setLastOrder(null);
            setReceipt(null);
          }}
        />
      )}

      {/* Debug receipt removed (no longer needed) */}

      {/* Footer (kept site-wide) */}
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 🌙 Wrappers for Theme + Toast Contexts                                 */
/* ---------------------------------------------------------------------- */
function AppProviders({ children }) {
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark((d) => !d);

  const [toasts, setToasts] = useState([]);

  function push(msg, opts = {}) {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, ...opts }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2000);
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <ToastContext.Provider value={{ push }}>
        {children}
        <div className="toast-stack" style={{ position: 'fixed', right: 20, top: 20, zIndex: 9999 }}>
          {toasts.map((t) => (
            <div
              key={t.id}
              style={{
                marginBottom: 8,
                background:
                  t.type === 'error'
                    ? '#ef4444'
                    : t.type === 'success'
                    ? '#16a34a'
                    : '#2563eb',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 8,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              }}
            >
              {t.msg}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}

/* ---------------------------------------------------------------------- */
/* 🚀 Final App with Routing                                              */
/* ---------------------------------------------------------------------- */
export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<InnerApp />} />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  );
}
