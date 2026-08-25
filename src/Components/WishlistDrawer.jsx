import React from "react";
import "./WishlistDrawer.css";

function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onToggleWishlist,
  onAddToCart,
  onAddAllToCart
}) {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="wishlist-backdrop" onClick={onClose}>
      <div className="wishlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-header">
          <div className="wishlist-header-title">
            <span className="wishlist-header-icon">❤️</span>
            <h3>My Wishlist</h3>
            <span className="wishlist-badge-pill">{wishlistedProducts.length}</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close Wishlist">
            ✕
          </button>
        </div>

        <div className="wishlist-body">
          {wishlistedProducts.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-wishlist-icon">🤍</div>
              <h4>Your wishlist is empty</h4>
              <p>Save items you love by tapping the heart icon on any product.</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Explore Products
              </button>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlistedProducts.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <img src={item.image} alt={item.name} className="wishlist-item-img" />

                  <div className="wishlist-item-details">
                    <div className="wishlist-item-top">
                      <h4 className="wishlist-item-name">{item.name}</h4>
                      <button
                        className="remove-wishlist-btn"
                        onClick={() => onToggleWishlist(item.id)}
                        title="Remove from wishlist"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="wishlist-item-price">{item.price}</div>

                    <div className="wishlist-item-actions">
                      <button
                        className="wishlist-add-cart-btn"
                        onClick={() => onAddToCart(item)}
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="wishlist-footer">
            <button
              className="wishlist-add-all-btn"
              onClick={() => {
                wishlistedProducts.forEach((p) => onAddToCart(p));
              }}
            >
              Add All to Cart ({wishlistedProducts.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistDrawer;
