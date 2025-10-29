// frontend/src/components/CheckoutModal.jsx
import React, { useEffect, useRef, useState } from 'react';

/*
Props:
  isOpen: boolean
  onRequestClose: fn
  onSubmit: fn({ name, email, comments })
  cart: { items: [...], total }
*/
export default function CheckoutModal({ isOpen, onRequestClose, onSubmit, cart = { items: [], total: 0 } }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const panelRef = useRef(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onRequestClose && onRequestClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onRequestClose]);

  // reset inputs when modal closed/opened (optional but nicer)
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setComments('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email) return alert('Please provide name and email');
    const payload = { name, email, comments };
    onSubmit && onSubmit(payload);
  }

  // click on overlay to close
  function onOverlayClick(e) {
    // close only if clicked the overlay itself, not children
    if (e.target === e.currentTarget) {
      onRequestClose && onRequestClose();
    }
  }

  // formatting helpers
  const total = Number(cart?.total || 0).toFixed(2);
  const items = Array.isArray(cart?.items) ? cart.items : [];

  // Inline styles — ensures overlay sits above sticky header without needing CSS edits
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999, // high so it sits over header
    background: 'rgba(10,12,18,0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '28px',
    backdropFilter: 'blur(3px)',
  };

  const panelStyle = {
    width: 'min(1100px, 96vw)',
    maxHeight: '92vh',
    overflow: 'auto',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 20px 60px rgba(2,6,23,0.2)',
    display: 'flex',
    gap: 24,
    padding: 20,
    position: 'relative',
    zIndex: 10000,
  };

  return (
    <div
      className="checkout-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onOverlayClick}
      style={overlayStyle}
    >
      <div
        className="checkout-panel"
        ref={panelRef}
        style={panelStyle}
        onClick={(e) => e.stopPropagation()} /* prevent clicks inside panel from closing */
      >
        <div className="checkout-left" style={{ flex: 1, minWidth: 0 }}>
          <h2>Checkout</h2>
          <p className="text-muted">Enter your contact details to complete the mock checkout.</p>

          <form className="form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)' }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)' }}
              />
            </div>

            <div className="comments-box" style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Comments / Suggestions</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any delivery notes, suggestions, or feedback..."
                rows={6}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#2563eb',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Place Order
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={onRequestClose}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <aside
          className="checkout-right"
          style={{
            width: 320,
            flex: '0 0 320px',
            background: '#fafafa',
            borderRadius: 8,
            padding: 16,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
            height: 'fit-content',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>

          <div>
            {items && items.length > 0 ? (
              items.map((it) => (
                <div key={it.cartId || it.productId || it.id} className="order-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 14 }}>{it.name || `Product ${it.productId ?? it.id}`}</div>
                  <div style={{ fontWeight: 700 }}>₹{Number((it.qty || 1) * (it.price || 0)).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div className="text-muted" style={{ color: '#6b7280' }}>Cart is empty</div>
            )}
          </div>

          <div className="order-total" style={{ marginTop: 14, fontWeight: 800, fontSize: 16 }}>
            Total: ₹{total}
          </div>
        </aside>
      </div>

      {/* top-right close button kept for quick access */}
      <div style={{ position: 'fixed', right: 28, top: 28, zIndex: 11000 }}>
        <button onClick={onRequestClose} className="btn btn-outline" style={{ padding: '8px 10px', borderRadius: 8 }}>
          Close
        </button>
      </div>
    </div>
  );
}
