import React from "react";
import "./ProductCard.css";

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.brand && (
          <span className="product-badge">{product.brand}</span>
        )}
        <button
          className={`wishlist-btn-overlay ${isWishlisted ? "active" : ""}`}
          onClick={() => onToggleWishlist(product.id)}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3>{product.name}</h3>
        </div>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">
          <span className="product-price">
            {product.price}
          </span>

          <div className="product-actions">
            <button
              className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={() => onToggleWishlist(product.id)}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>

            <button
              className="add-cart-btn"
              onClick={() => onAddToCart(product)}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;