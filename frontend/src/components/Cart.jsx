import React from 'react';

export default function Cart({ cart, onRemove, onUpdate, onCheckout }) {
  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.items.map(it => (
              <li key={it.cartId} className="cart-item">
                <div className="cart-left">
                  <strong>{it.name}</strong>
                  <div>₹{Number(it.price).toFixed(2)} x
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={e => onUpdate(it.cartId, Number(e.target.value))}
                      style={{ width: 60, marginLeft: 8 }}
                    />
                  </div>
                </div>
                <div>
                  <div>₹{Number(it.subtotal).toFixed(2)}</div>
                  <button onClick={() => onRemove(it.cartId)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total: ₹{Number(cart.total).toFixed(2)}</strong>
          </div>
          <button
              className="btn-primary"
              onClick={() => onCheckout && onCheckout()}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Checkout
            </button>
        </>
      )}
    </div>
  );
}
