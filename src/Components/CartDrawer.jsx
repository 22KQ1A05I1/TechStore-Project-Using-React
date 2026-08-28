import React from "react";
import "./CartDrawer.css";

function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  cartTotal = 0,
  cartCount = 0
}) {
  if (!isOpen) return null;

  const parsePrice = (priceStr) => {
    if (typeof priceStr === "number") return priceStr;
    return parseFloat(String(priceStr).replace(/[^0-9.]/g, "")) || 0;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert(`🎉 Thank you for your purchase! Total: $${cartTotal.toFixed(2)}`);
    onClearCart();
    onClose();
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-header-title">
            <span className="cart-header-icon">🛒</span>
            <h3>Shopping Cart</h3>
            <span className="cart-badge-pill">{cartCount}</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close Cart">
            ✕
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛍️</div>
              <h4>Your cart is empty</h4>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const numericPrice = parsePrice(item.price);
                const itemTotal = (numericPrice * item.quantity).toFixed(2);

                return (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    
                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <button
                          className="remove-item-btn"
                          onClick={() => onRemoveItem(item.id)}
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="cart-item-price-unit">
                        ${numericPrice.toFixed(2)} each
                      </div>

                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-total">
                          ${itemTotal}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Total Items</span>
              <span className="summary-val">{cartCount}</span>
            </div>
            <div className="cart-summary-row total-row">
              <span>Subtotal</span>
              <span className="summary-total-val">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="cart-footer-buttons">
              <button className="clear-cart-btn" onClick={onClearCart}>
                Clear Cart
              </button>
              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout (${cartTotal.toFixed(2)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
