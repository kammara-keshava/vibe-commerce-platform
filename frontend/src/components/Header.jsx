// frontend/src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMoon,
  FiSun,
  FiMapPin,
} from "react-icons/fi";
import Cart from "./Cart";
import "./Header.css";

export default function Header({
  onSearch,
  user,
  onLogout,
  location = "Select location",
  cartCount = 0,
  onToggleTheme,
  isDark,
  // optional: pass cart data & handlers for the inline cart panel
  cart = { items: [], total: 0 },
  onRemoveFromCart,
  onUpdateCart,
  onOpenCheckout,
  // optional external control for cart panel — if not provided component will manage internally
  cartPanelOpen: controlledCartPanelOpen,
  setCartPanelOpen: controlledSetCartPanelOpen,
}) {
  // Internal state for user dropdown and cart panel (only used if external control not provided)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [internalCartOpen, setInternalCartOpen] = useState(false);

  // prefer controlled props if provided, otherwise use internal state
  const cartPanelOpen =
    typeof controlledCartPanelOpen === "boolean"
      ? controlledCartPanelOpen
      : internalCartOpen;
  const setCartPanelOpen =
    typeof controlledSetCartPanelOpen === "function"
      ? controlledSetCartPanelOpen
      : setInternalCartOpen;

  const panelRef = useRef();
  const userRef = useRef();

  // click outside handler to close cart panel / user dropdown
  useEffect(() => {
    function handleDocClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setCartPanelOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (cartPanelOpen || dropdownOpen) {
      document.addEventListener("mousedown", handleDocClick);
      return () => document.removeEventListener("mousedown", handleDocClick);
    }
  }, [cartPanelOpen, dropdownOpen, setCartPanelOpen]);

  // open checkout from header-cart panel
  function handleOpenCheckout() {
    if (onOpenCheckout) onOpenCheckout();
    setCartPanelOpen(false);
  }

  return (
    <header className="header-container glassy">
      <div className="header-left">
        <div className="brand">
          <h1 className="brand-title">Vibe Commerce</h1>
          <small className="brand-tag">Mock Cart</small>
        </div>
      </div>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for products, brands and more..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="header-right">
        <div className="location-display">
          <FiMapPin className="location-icon" />
          <div>
            <span className="label">Deliver to</span>
            <div className="value">{location}</div>
          </div>
        </div>

        <div
          className="theme-toggle"
          onClick={() => onToggleTheme && onToggleTheme()}
          title="Toggle Theme"
        >
          {isDark ? <FiSun /> : <FiMoon />}
        </div>

        <div
          className="user-section"
          onClick={() => setDropdownOpen((s) => !s)}
          ref={userRef}
        >
          <FiUser className="user-icon" />
          {user ? (
            <div className="user-info">
              <span className="user-name">Hi, {user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          ) : (
            <a href="/login" className="login-link">
              Login / Sign Up
            </a>
          )}

          {user && dropdownOpen && (
            <div className="user-dropdown">
              <p style={{ margin: 0, fontSize: 13 }}>{user.email}</p>
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>

        {/* Cart icon + inline panel */}
        <div className="cart-anchor" ref={panelRef}>
          <button
            className="cart-icon-btn"
            title="Cart"
            onClick={() => setCartPanelOpen(!cartPanelOpen)}
            aria-expanded={cartPanelOpen}
            aria-label="Open cart"
          >
            <FiShoppingCart className="cart-svg" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {cartPanelOpen && (
            <div className="cart-panel">
              <div className="cart-panel-header">
                <strong>Your Cart</strong>
                <button
                  className="btn-link"
                  onClick={() => {
                    setCartPanelOpen(false);
                    // optional focus or action
                  }}
                >
                  Close
                </button>
              </div>

              <div className="cart-panel-body">
                {/* re-use existing Cart component. It expects props named `cart`, `onRemove`, `onUpdate`, `onCheckout` */}
                <Cart
                  cart={cart}
                  onRemove={(id) => onRemoveFromCart && onRemoveFromCart(id)}
                  onUpdate={(id, qty) => onUpdateCart && onUpdateCart(id, qty)}
                  onCheckout={handleOpenCheckout}
                />
              </div>

              <div className="cart-panel-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <strong>₹{Number(cart.total || 0).toFixed(2)}</strong>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setCartPanelOpen(false);
                    }}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleOpenCheckout();
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
