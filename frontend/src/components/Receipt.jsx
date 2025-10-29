// frontend/src/components/Receipt.jsx
import React, { useMemo } from "react";
import "./Receipt.css";

export default function Receipt({ order = {}, products = [], apiBase = "", onClose }) {
  // order may have various shapes from different backends.
  // Normalize to items: [{ productId, name, price, qty }]
  const items = useMemo(() => {
    if (!order) return [];
    // common shapes: order.items, order.cartItems, order.products, order.orderItems
    const cand = order.items || order.cartItems || order.orderItems || order.products || [];
    return (Array.isArray(cand) ? cand : []).map((it) => {
      // it may have productId or id or product_id
      const productId = it.productId ?? it.product_id ?? it.id ?? it.product?.id;
      const qty = Number(it.qty ?? it.quantity ?? it.count ?? 1);
      // find product meta
      const meta = products.find((p) => Number(p.id) === Number(productId)) || it.product || {};
      const name = it.name || meta.name || `Product ${productId || ""}`;
      const price = Number(it.price ?? meta.price ?? 0);
      const image =
        it.image ||
        (meta.image && (meta.image.startsWith("http") ? meta.image : `${apiBase}${meta.image}`)) ||
        "/images/placeholder.png";
      return { productId, name, qty, price, image };
    });
  }, [order, products, apiBase]);

  const totalFromItems = items.reduce((s, i) => s + i.qty * (i.price || 0), 0);
  const total = Number(order.total ?? totalFromItems ?? 0);

  function handlePrint() {
    window.print();
  }

  function handleRemoveOrder() {
    // If you want to call backend to delete the order, add that fetch here.
    if (window.confirm("Remove this order from record (mock)?")) {
      // For now simply call onClose to dismiss
      onClose && onClose();
    }
  }

  return (
    <div className="receipt-modal-overlay" role="dialog" aria-modal="true">
      <div className="receipt-modal">
        <header className="receipt-header">
          <div className="receipt-title">
            <div className="tick">✅</div>
            <div>
              <h1>Order Confirmed</h1>
              <div className="meta">
                <span><strong>Order ID:</strong> {order.id ?? order.orderId ?? order.order_id ?? "—"}</span>
                <span><strong>Date:</strong> {order.date || order.createdAt || new Date().toLocaleString()}</span>
                <span><strong>Payment:</strong> {order.payment || order.paymentMethod || "Cash on Delivery"}</span>
              </div>
            </div>
          </div>

          <button className="btn small btn-outline close-top" onClick={() => onClose && onClose()}>
            Close
          </button>
        </header>

        <div className="receipt-body">
          <div className="items-list">
            {items.length === 0 ? (
              <div className="empty">No items found in the order.</div>
            ) : (
              items.map((it) => (
                <div className="order-row" key={it.productId + "-" + it.name}>
                  <img src={it.image} alt={it.name} onError={(e) => (e.target.src = "/images/placeholder.png")} />
                  <div className="order-info">
                    <div className="order-name">{it.name}</div>
                    <div className="order-qty">Qty: {it.qty}</div>
                  </div>
                  <div className="order-price">₹{(it.price * it.qty).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          {/* centered light-yellow box */}
          <div className="thank-you-box">
            <strong>Thanks for shopping — visit once again!</strong>
            <div className="sub">We appreciate your order. Come back soon for new picks and deals.</div>
          </div>

          <div className="receipt-footer-row">
            <div className="total-label">Total</div>
            <div className="total-value">₹{Number(total).toFixed(2)}</div>
          </div>
        </div>

        <footer className="receipt-actions">
          <div className="left-actions">
            <button className="btn btn-danger" onClick={handleRemoveOrder}>Remove</button>
          </div>

          <div className="right-actions">
            <button className="btn btn-outline" onClick={() => onClose && onClose()}>Back to Home</button>
            <button className="btn btn-primary" onClick={handlePrint}>Print / Save PDF</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
