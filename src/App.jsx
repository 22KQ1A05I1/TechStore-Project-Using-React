import React, { useState, useEffect } from "react";
import "./App.css";
import ProductCard from "./Components/ProductCard";
import CartDrawer from "./Components/CartDrawer";
import WishlistDrawer from "./Components/WishlistDrawer";
import products from "./Data";

function App() {
  // Extract unique brands
  const allBrands = ["All", ...new Set(products.map((p) => p.brand).filter(Boolean))];

  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("shopzone_theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
    } catch (error) {
      console.error("Error reading theme from localStorage:", error);
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Cart state with localStorage persistence
  const [cartItem, setCartItem] = useState(() => {
    try {
      const savedCart = localStorage.getItem("tech-cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error reading tech-cart from localStorage:", error);
    }
    return [];
  });

  // Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWish = localStorage.getItem("save-wish");
      if (savedWish) {
        const parsed = JSON.parse(savedWish);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error reading save-wish from localStorage:", error);
    }
    return [];
  });

  // Sync cart to localStorage whenever cartItem changes
  useEffect(() => {
    try {
      localStorage.setItem("tech-cart", JSON.stringify(cartItem));
    } catch (error) {
      console.error("Error saving tech-cart to localStorage:", error);
    }
  }, [cartItem]);

  // Sync wishlist to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("save-wish", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving save-wish to localStorage:", error);
    }
  }, [wishlist]);





  const [searchTerm, setSearchTerm] = useState("");
  const [selectBrand, setSelectBrand] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Toggle dark/light theme
  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("shopzone_theme", next ? "dark" : "light");
      showToast(next ? "🌙 Switched to Dark Mode" : "☀️ Switched to Light Mode");
      return next;
    });
  };

  // Toast notification helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Helper to get numeric price
  const parsePrice = (priceStr) => {
    if (typeof priceStr === "number") return priceStr;
    return parseFloat(String(priceStr).replace(/[^0-9.]/g, "")) || 0;
  };

  // Add to cart function
  function addToCart(product) {
    setCartItem((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showToast(`🛒 "${product.name}" added to cart!`);
  }

  // Update item quantity
  function updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItem((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  }

  // Remove from cart
  function removeFromCart(productId) {
    setCartItem((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item) {
        showToast(`Removed "${item.name}" from cart`);
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  }

  // Clear cart
  function clearCart() {
    setCartItem([]);
    showToast("Cart cleared");
  }

  // Calculate total number of cart items
  const cartCount = cartItem.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const cartTotal = cartItem.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0
  );

  // Wishlist toggle function
  function toggleWishlist(productId) {
    const product = products.find((p) => p.id === productId);
    const productName = product ? product.name : "Product";

    setWishlist((prevWishlist) => {
      const isWishlisted = prevWishlist.includes(productId);
      if (isWishlisted) {
        showToast(`🤍 Removed "${productName}" from wishlist`);
        return prevWishlist.filter((id) => id !== productId);
      } else {
        showToast(`❤️ Added "${productName}" to wishlist!`);
        return [...prevWishlist, productId];
      }
    });
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectBrand("All");
    setSortBy("");
  };

  const isFiltering = searchTerm !== "" || selectBrand !== "All" || sortBy !== "";

  // Step 1: Filter based on search term & brand selection
  let filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchBrand =
      selectBrand === "All" ||
      product.brand.toLowerCase() === selectBrand.toLowerCase();

    return matchSearch && matchBrand;
  });

  // Step 2: Sort based on sortBy value
  if (sortBy === "price-low-high") {
    filteredProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortBy === "price-high-low") {
    filteredProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sortBy === "name-a-z") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-z-a") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className={`app ${darkMode ? "dark-theme" : "light-theme"}`} data-theme={darkMode ? "dark" : "light"}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItem}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        cartTotal={cartTotal}
        cartCount={cartCount}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
      />

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Shop<span>Zone</span>
        </div>

        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#products">Products</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        <div className="nav-actions">
          {/* Subtle Modern Theme Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className={`theme-icon ${darkMode ? "active" : ""}`}>
              {darkMode ? "🌙" : "☀️"}
            </span>
            <span className="theme-toggle-text">
              {darkMode ? "Dark" : "Light"}
            </span>
          </button>

          {/* Wishlist Button in Navbar */}
          <button
            className="nav-btn wishlist-nav-btn"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="View Wishlist"
            title="View Wishlist"
          >
            <span className="nav-btn-icon">❤️</span>
            <span className="nav-btn-label">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="nav-badge wishlist-badge">{wishlist.length}</span>
            )}
          </button>

          {/* Cart Button in Navbar */}
          <button
            className="nav-btn cart-nav-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="View Cart"
            title="View Cart"
          >
            <span className="nav-btn-icon">🛒</span>
            <span className="nav-btn-label">Cart</span>
            {cartCount > 0 && (
              <span className="nav-badge cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Find Your Perfect Product</h1>
          <p>
            Discover high-quality products at affordable prices. Shop your
            favorites today!
          </p>
          <a href="#products" className="shop-btn">
            Shop Now
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">
        <h2>Our Products</h2>
        <p className="section-description">
          Explore our latest and most popular products
        </p>

        {/* Filter and Search Controls Bar */}
        <div className="filter-controls-card">
          {/* Search Box */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products by name, brand, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-row">
            {/* Brand Filter Pills */}
            <div className="brand-filter-group">
              <span className="filter-label">Brand:</span>
              <div className="brand-pills">
                {allBrands.map((brand) => (
                  <button
                    key={brand}
                    className={`brand-pill ${
                      selectBrand.toLowerCase() === brand.toLowerCase()
                        ? "active"
                        : ""
                    }`}
                    onClick={() => setSelectBrand(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown & Reset */}
            <div className="sort-group">
              <span className="filter-label">Sort by:</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Featured / Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>

              {isFiltering && (
                <button
                  className="reset-filters-btn"
                  onClick={handleResetFilters}
                  title="Reset all filters"
                >
                  🔄 Reset
                </button>
              )}
            </div>
          </div>

          {/* Results summary bar */}
          <div className="filter-results-info">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of{" "}
              <strong>{products.length}</strong> products
            </span>
            {isFiltering && (
              <span className="active-filters-tag">
                {searchTerm && `Search: "${searchTerm}" `}
                {selectBrand !== "All" && `Brand: ${selectBrand} `}
                {sortBy && `Sorted`}
              </span>
            )}
          </div>
        </div>

        {/* Product Cards Container */}
        {filteredProducts.length > 0 ? (
          <div className="product-container">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="no-products-found">
            <div className="no-products-icon">🔎</div>
            <h3>No products found</h3>
            <p>We couldn't find any products matching your search or filters.</p>
            <button className="reset-search-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2>About ShopZone</h2>
        <p>
          ShopZone is a simple online shopping platform where you can discover
          amazing products at great prices. We focus on quality, affordability
          and customer satisfaction.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-column">
            <h3>ShopZone</h3>
            <p>Your favorite place to shop quality products online.</p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <p>📧 shopzone@example.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 Bangalore, India</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ShopZone. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;