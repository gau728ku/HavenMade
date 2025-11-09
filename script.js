// ===========================
// HAVENMADE MAIN JS FILE (FINAL MULTI-PAGE VERSION)
// ===========================

// --- BASIC PRODUCT DATA ---
const products = [
  { id: "p1", title: "Brightening Herbal Bar", price: 249, img: "images/product1.jpg" },
  { id: "p2", title: "Charcoal Detox Bar", price: 249, img: "images/product2.jpg" },
  { id: "p3", title: "Rose & Milk Glow Bar", price: 299, img: "images/product3.jpg" }
];

// --- CART COUNT ---
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
}

// =============================
// Supabase Setup
// =============================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://aejltrfuffkagrxivhei.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlamx0cmZ1ZmZrYWdyeGl2aGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzkxODMsImV4cCI6MjA3NzY1NTE4M30.FtqWMawlfvvUyDtmkomIHhNn1pIhDfuwOHFPYZyvvDo";
const supabase = createClient(supabaseUrl, supabaseKey);

// =============================
// PAGE-SPECIFIC CODE
// =============================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // ---------- NEWSLETTER ----------
  const subscribeForm = document.getElementById("subscribe-form");
  if (subscribeForm) {
    const emailInput = document.getElementById("subscribe-email");
    const message = document.getElementById("subscribe-message");
    subscribeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return (message.textContent = "Please enter a valid email.");
      const { error } = await supabase.from("subscribers").insert([{ email }]);
      message.textContent = error
        ? "Already subscribed or error."
        : "🎉 Thanks for joining HavenMade!";
    });
  }

  // ---------- FAQ PAGE (WORKS WITH HAVENMADE FAQ STRUCTURE) ----------
const faqItems = document.querySelectorAll(".faq-item");
if (faqItems.length) {
  faqItems.forEach((item) => {
    const question = item.querySelector("h3");
    const answer = item.querySelector("p");

    // Start collapsed
    answer.style.maxHeight = "0";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.3s ease";
    question.style.cursor = "pointer";

    // Toggle on click
    question.addEventListener("click", () => {
      const isOpen = item.classList.toggle("active");

      // Optional: close all others
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("active");
          other.querySelector("p").style.maxHeight = "0";
        }
      });

      // Open/close current
      if (isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0";
      }
    });
  });
}


  // ---------- TRACK ORDER PAGE ----------
  const trackForm = document.getElementById("trackForm");
  if (trackForm) {
    trackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const trackingId = document.getElementById("trackingInput").value.trim();
      if (trackingId) {
        window.open(`https://shiprocket.co/tracking/${trackingId}`, "_blank");
      } else {
        alert("Please enter a valid Tracking ID or AWB.");
      }
    });
  }


// =============================
// COMPLETE SEARCH FUNCTIONALITY
// =============================

// Complete product database
const productDatabase = [
    { 
        id: 1, 
        name: "Lavender Calm", 
        category: "Body Care", 
        price: 299, 
        image: "images/shop all/Lavender Calm.jpeg",
        tags: ["lavender", "calm", "relaxing", "soothing", "aromatherapy"]
    },
    { 
        id: 2, 
        name: "Aloe & Cucumber", 
        category: "Face Care", 
        price: 349, 
        image: "images/shop all/Aloe & Cucumber.jpeg",
        tags: ["aloe", "cucumber", "soothing", "hydrating", "cooling"]
    },
    { 
        id: 3, 
        name: "Charcoal Detox", 
        category: "Face Care", 
        price: 279, 
        image: "images/shop all/Charcoal Detox.jpeg",
        tags: ["charcoal", "detox", "cleansing", "purifying", "deep-clean"]
    },
    { 
        id: 4, 
        name: "Rose Petal Bliss", 
        category: "Body Care", 
        price: 399, 
        image: "images/shop all/Rose Bliss.jpeg",
        tags: ["rose", "luxury", "moisturizing", "floral", "pampering"]
    },
    { 
        id: 5, 
        name: "Brightening Herbal Bar", 
        category: "Face Care", 
        price: 249, 
        image: "images/product1.jpg",
        tags: ["herbal", "brightening", "glow", "ayurvedic", "natural"]
    },
    { 
        id: 6, 
        name: "Rose & Milk Glow Bar", 
        category: "Body Care", 
        price: 299, 
        image: "images/product3.jpg",
        tags: ["rose", "milk", "glow", "nourishing", "softening"]
    }
];

// Search functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeShopPage();
});

function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        console.log('🔍 Search functionality initialized');
        
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSearch();
        });
        
        function handleSearch() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (!searchTerm) {
                showPopup('Please enter a product name to search', 'warning');
                return;
            }
            
            console.log('🔍 Searching for:', searchTerm);
            
            // Store search term and redirect to shop page
            localStorage.setItem('searchQuery', searchTerm);
            window.location.href = 'shop.html';
        }
    }
}

function initializeShopPage() {
    // Only run on shop page
    if (!window.location.pathname.includes('shop.html')) return;
    
    console.log('🛍️ Initializing shop page');
    
    const productGrid = document.getElementById('product-grid');
    const shopTitle = document.getElementById('shop-title');
    const shopSubtitle = document.getElementById('shop-subtitle');
    
    if (!productGrid) {
        console.log('❌ Product grid not found on shop page');
        return;
    }
    
    // Check if we have a search query
    const searchQuery = localStorage.getItem('searchQuery');
    
    if (searchQuery) {
        // Filter products based on search
        const filteredProducts = productDatabase.filter(product => 
            product.name.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
        
        displayProducts(filteredProducts, `Search Results for "${searchQuery}"`, `Found ${filteredProducts.length} product(s)`);
        
        // Clear search query after displaying results
        localStorage.removeItem('searchQuery');
        
    } else {
        // Show all products
        displayProducts(productDatabase, "All Products", "Discover our natural skincare collection");
    }
}

function displayProducts(products, title, subtitle) {
    const productGrid = document.getElementById('product-grid');
    const shopTitle = document.getElementById('shop-title');
    const shopSubtitle = document.getElementById('shop-subtitle');
    
    if (!productGrid) return;
    
    // Update titles
    if (shopTitle) shopTitle.textContent = title;
    if (shopSubtitle) shopSubtitle.textContent = subtitle;
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>No products found</h3>
                <p>Try searching for different keywords like "lavender", "charcoal", or "rose"</p>
                <button onclick="clearSearch()" style="
                    background: #4b7c3b;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Show All Products</button>
            </div>
        `;
        return;
    }
    
    // Display products
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='images/default.jpg'"
                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px;">
            <h3>${product.name}</h3>
            <p class="desc">${product.category}</p>
            <span class="price">₹${product.price}</span>
            <button class="add-to-cart" 
                data-name="${product.name}" 
                data-price="${product.price}" 
                data-image="${product.image}">
                Add to Cart
            </button>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Re-initialize add to cart buttons for new products
    initializeAddToCartButtons();
}

function initializeAddToCartButtons() {
    // Re-attach event listeners to new add-to-cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            
            if (!name || isNaN(price)) {
                console.warn('Invalid product data');
                return;
            }
            
            addProductToCart(name, price, image);
        }
    });
}

function addProductToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showPopup(`✅ ${name} added to cart!`, 'success');
}

function clearSearch() {
    localStorage.removeItem('searchQuery');
    window.location.href = 'shop.html';
}

function showPopup(message, type = 'info') {
    const popup = document.createElement('div');
    const bgColor = type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#333';
    
    popup.textContent = message;
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 18px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }, 3000);
}

// Make functions available globally
window.clearSearch = clearSearch;


   // =============== CART FUNCTIONALITY ===============

// Function to show a temporary popup message
function showPopup(message) {
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.background = '#333';
  popup.style.color = '#fff';
  popup.style.padding = '10px 15px';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = '1000';
  popup.style.fontSize = '14px';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2500);
}

// Function to update the cart count in the navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcon = document.querySelector('.fa-shopping-cart');
  if (cartIcon) {
    cartIcon.setAttribute('data-count', totalItems);
  }
}

// ---------- ADD TO CART (IMPROVED VERSION) ----------
document.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");
  if (!button) return;

  const name = button.dataset.name;
  const price = parseFloat(button.dataset.price);
  const image = button.dataset.image || "images/default.jpg";

  if (!name || isNaN(price)) {
    console.warn("⚠️ Skipped adding invalid product (missing name or price).");
    return;
  }

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    console.warn("Cart data corrupted, resetting...");
    cart = [];
  }

  // Find existing item
  const existingIndex = cart.findIndex(item => item && item.name === name);
  
  if (existingIndex !== -1) {
    // Item exists, increase quantity
    cart[existingIndex].quantity += 1;
  } else {
    // Add new item
    cart.push({ 
      name, 
      price, 
      image, 
      quantity: 1 
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Show confirmation popup
  showPopup(`🛒 ${name} added to cart!`);
});

// Improved popup function
function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.background = "#333";
  popup.style.color = "#fff";
  popup.style.padding = "12px 18px";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "9999";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.3s ease";
  popup.style.fontSize = "14px";
  popup.style.fontWeight = "500";
  
  document.body.appendChild(popup);
  
  // Animate in
  requestAnimationFrame(() => (popup.style.opacity = "1"));
  
  // Remove after delay
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 300);
  }, 2000);
}


// ==================== CART PAGE LOGIC ====================
// MOVED TO cart.js for better separation and reliability

// ==================== CART COUNT UPDATE ====================
// ==================== CART COUNT UPDATE ====================
function updateCartCount() {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
        console.warn("Cart data invalid, clearing...");
        localStorage.removeItem("cart");
        cart = [];
    }

    // Filter out any invalid items
    const validItems = cart.filter(item => 
        item && 
        typeof item.quantity === "number" && 
        item.quantity > 0
    );

    const totalCount = validItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update all cart count elements on the page
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(element => {
        element.textContent = totalCount > 0 ? totalCount : "0";
    });
    
    console.log("🔄 Cart count updated:", totalCount);
    
    return totalCount;
}

// Make it available globally
window.updateCartCount = updateCartCount;


// Debug function to test cart functionality
function debugCart() {
  console.log("=== CART DEBUG INFO ===");
  console.log("LocalStorage cart data:", localStorage.getItem("cart"));
  console.log("Cart count elements:", document.querySelectorAll('.cart-count'));
  console.log("Cart items container:", document.getElementById("cart-items"));
  console.log("Current cart count:", updateCartCount());
  console.log("======================");
}

// Call this in browser console to debug
window.debugCart = debugCart;

  // ---------- PROFILE PAGE ----------
  if (document.getElementById("auth-section")) {
    // DOM Elements
    const authSection = document.getElementById("auth-section");
    const profileSection = document.getElementById("profile-section");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const saveProfileBtn = document.getElementById("save-profile");
    const emailInput = document.getElementById("auth-email");
    const passwordInput = document.getElementById("auth-password");
    const nameInput = document.getElementById("profile-name");
    const addressInput = document.getElementById("profile-address");
    const userEmail = document.getElementById("user-email");
    const authMessage = document.getElementById("auth-message");
    const profileMessage = document.getElementById("profile-message");
    const ordersList = document.getElementById("orders-list");

    async function handleLogin() {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value,
      });
      authMessage.textContent = error ? error.message : "Login successful!";
      if (!error) checkSession();
    }

    async function handleSignup() {
      const { error } = await supabase.auth.signUp({
        email: emailInput.value,
        password: passwordInput.value,
      });
      authMessage.textContent = error
        ? error.message
        : "Signup successful! Check your email.";
    }

    async function handleLogout() {
      await supabase.auth.signOut();
      authSection.style.display = "block";
      profileSection.style.display = "none";
    }

    async function saveProfile() {
      const user = (await supabase.auth.getUser()).data.user;
      const updates = {
        id: user.id,
        email: user.email,
        name: nameInput.value,
        address: addressInput.value,
      };
      const { error } = await supabase.from("profiles").upsert(updates);
      profileMessage.textContent = error ? error.message : "Profile updated!";
    }

    async function loadProfile(user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        nameInput.value = data.name || "";
        addressInput.value = data.address || "";
        userEmail.textContent = user.email;
      }
    }

    async function loadOrders(email) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("email", email);
      ordersList.innerHTML =
        error || !data.length
          ? "<li>No orders found</li>"
          : data.map((o) => `<li>${o.order_id} - ${o.status}</li>`).join("");
    }

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        const user = session.user;
        authSection.style.display = "none";
        profileSection.style.display = "block";
        await loadProfile(user);
        await loadOrders(user.email);
      } else {
        authSection.style.display = "block";
        profileSection.style.display = "none";
      }
    }

    // Event listeners (safe)
    if (loginBtn) loginBtn.addEventListener("click", handleLogin);
    if (signupBtn) signupBtn.addEventListener("click", handleSignup);
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (saveProfileBtn) saveProfileBtn.addEventListener("click", saveProfile);

    checkSession();
  }
});

// Product descriptions data
const productDescriptions = {
  "Lavender Calm": "Soothe your senses with our calming lavender blend. Perfect for evening relaxation and gentle enough for sensitive skin.<br><strong>Net Quantity:</strong> 100g</br>",
  "Aloe & Cucumber": "Refresh and hydrate with the cooling duo of aloe vera and cucumber. Ideal for hot days and post-workout freshness.<br><strong>Net Quantity:</strong> 100g",
  "Charcoal Detox": "Deep cleanse with activated charcoal that draws out impurities. Great for oily and combination skin types.<br><strong>Net Quantity:</strong> 100g",
  "Rose Petal Bliss": "Indulge in luxury with rose petals and shea butter. Leaves skin feeling soft, nourished, and beautifully fragrant.<br><strong>Net Quantity:</strong> 100g",
  "Honey-Oats": "Gentle exfoliation meets deep moisturization. Honey and oats work together to soothe and soften even the driest skin.<br><strong>Net Quantity:</strong> 100g",
  "Lemon-Orange": "Awaken your senses with the zesty duo of lemon and orange. This citrus burst provides a refreshing start to your day while naturally brightening your skin.<br><strong>Net Quantity:</strong> 100g",
  "Glow & Calm Duo": "Indulge in the perfect balance of radiance and relaxation. This exquisite pairing combines our bestselling Rose Bliss for luminous, hydrated skin with the gentle exfoliation of Honey & Oats. Thoughtfully presented in an eco-friendly kraft box that's as beautiful as it is sustainable - perfect for gifting or treating yourself to everyday luxury.<br><strong>Net Quantity:</strong> 100g+100g=200g",
  "Refresh Duo": "A vibrant awakening for your senses and skin. Energize your routine with this zesty combination of Lemon + Orange for brightening, Aloe Cucumber for soothing hydration, and Mint Charcoal for deep purification. Three distinct experiences that work in harmony to refresh, revive, and rejuvenate your skin from head to toe.<br><strong>Net Quantity:</strong> 100g+100g=200g",
  "Luxe Spa Set": "Transform your bathroom into a personal sanctuary. Experience ultimate relaxation with our calming Lavender Calm, nourishing Honey & Oats, and complete the ritual with our elegant Wooden Soap Dish. This curated collection turns everyday bathing into a luxurious spa-like retreat, promoting mindfulness and self-care with every use.<br><strong>Net Quantity:</strong> 100g+100g=200g",
  "Celebration Hamper": "The ultimate gift for special moments. This generous collection features 4 assorted soaps carefully selected for variety and luxury, accompanied by a handwritten greeting card and stylish jute pouch. Perfect for birthdays, anniversaries, holidays, or simply celebrating life's beautiful moments with someone special.<br><strong>Net Quantity:</strong> 100g+100g+100g+100g=400g"

};

// Product Quick View functionality - SIMPLE FIX
document.addEventListener('DOMContentLoaded', function() {
  const productModal = document.getElementById('productModal');
  if (!productModal) return;

  // Make product cards clickable
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't open modal if Add to Cart button was clicked
      if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        return;
      }
      
      // Get product data from data attributes (most reliable method)
      const addToCartBtn = this.querySelector('.add-to-cart');
      const productName = addToCartBtn?.getAttribute('data-name') || 'Product Name';
      const productPrice = addToCartBtn?.getAttribute('data-price') || 'Price not available';
      const productImage = addToCartBtn?.getAttribute('data-image') || '';
      const img = this.querySelector('img');
      
      // Set modal content
      document.getElementById('modalProductImage').src = productImage || img?.src || '';
      document.getElementById('modalProductName').textContent = productName;
      document.getElementById('modalProductPrice').textContent = '₹' + productPrice;
      
      // Get description from our data
      const description = productDescriptions[productName] || 'Product description not available';
      document.getElementById('modalProductDesc').innerHTML = description;
      
      // Set up modal add to cart button
      document.getElementById('modalAddToCart').onclick = function() {
        if (addToCartBtn) addToCartBtn.click();
        productModal.classList.add('hidden');
      };
      
      // Show modal
      productModal.classList.remove('hidden');
    });
  });

  // Close modal
  document.querySelector('#productModal .close').addEventListener('click', function() {
    productModal.classList.add('hidden');
  });

  // Close modal when clicking outside
  productModal.addEventListener('click', function(e) {
    if (e.target === productModal) {
      productModal.classList.add('hidden');
    }
  });
});


// Shiprocket Payment Integration
class ShiprocketPayment {
    constructor() {
        this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
        this.token = null;
    }

    // Login to get authentication token
    async login() {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'havenmadecare@gmail.com', // Replace with your email
                    password: '^OYIZNpH8g1F^iPU' // Replace with your password
                })
            });
            
            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                localStorage.setItem('shiprocket_token', data.token);
                return data.token;
            } else {
                throw new Error('Shiprocket authentication failed');
            }
        } catch (error) {
            console.error('Shiprocket login error:', error);
            throw error;
        }
    }

    // Create order with payment in Shiprocket
    async createOrderWithPayment(orderData) {
        if (!this.token) {
            await this.login();
        }

        try {
            const response = await fetch(`${this.baseURL}/orders/create/adhoc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(orderData)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Shiprocket order creation error:', error);
            throw error;
        }
    }

    // Generate payment link
    async generatePaymentLink(orderId, amount, customerInfo) {
        if (!this.token) {
            await this.login();
        }

        try {
            // Note: Shiprocket might have specific endpoints for payment links
            // This is a simplified version - you may need to adjust based on Shiprocket's API
            const paymentData = {
                order_id: orderId,
                amount: amount,
                customer_name: customerInfo.name,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone,
                return_url: `${window.location.origin}/thankyou.html`,
                webhook_url: `${window.location.origin}/webhook/shiprocket-payment`
            };

            // This endpoint might vary - check Shiprocket documentation
            const response = await fetch(`${this.baseURL}/payments/link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(paymentData)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Payment link generation error:', error);
            throw error;
        }
    }
}

// Initialize Shiprocket Payment
const shiprocketPayment = new ShiprocketPayment();

// Enhanced Checkout Function with Shiprocket Payments
async function proceedToShiprocketCheckout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const shippingInfo = getShippingInfo();
    
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Show loading state
    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;

    try {
        const subtotal = calculateSubtotal(cartItems);
        const shipping = 50; // Default shipping
        const total = subtotal + shipping;

        // Prepare order data for Shiprocket
        const orderData = {
            order_id: `HM${Date.now()}`,
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: 'Primary',
            channel_id: '',
            comment: 'Order from HavenMade website',
            reseller_name: 'HavenMade',
            billing_customer_name: shippingInfo.name,
            billing_last_name: '',
            billing_address: shippingInfo.address,
            billing_address_2: '',
            billing_city: shippingInfo.city,
            billing_state: shippingInfo.state,
            billing_country: 'India',
            billing_pincode: shippingInfo.pincode,
            billing_email: shippingInfo.email,
            billing_phone: shippingInfo.phone,
            shipping_is_billing: true,
            shipping_customer_name: shippingInfo.name,
            shipping_last_name: '',
            shipping_address: shippingInfo.address,
            shipping_address_2: '',
            shipping_city: shippingInfo.city,
            shipping_state: shippingInfo.state,
            shipping_country: 'India',
            shipping_pincode: shippingInfo.pincode,
            shipping_email: shippingInfo.email,
            shipping_phone: shippingInfo.phone,
            order_items: cartItems.map(item => ({
                name: item.name,
                sku: item.name.replace(/\s+/g, '_').toUpperCase(),
                units: item.quantity,
                selling_price: item.price,
                discount: '0',
                tax: '0',
                hsn: 33049900
            })),
            payment_method: 'Prepaid',
            sub_total: subtotal,
            length: 10,
            breadth: 10,
            height: 10,
            weight: Math.max(0.1, cartItems.length * 0.1)
        };

        // Create order in Shiprocket
        const shiprocketResponse = await shiprocketPayment.createOrderWithPayment(orderData);
        
        if (shiprocketResponse.order_id) {
            // Generate payment link
            const paymentLinkResponse = await shiprocketPayment.generatePaymentLink(
                shiprocketResponse.order_id,
                total,
                {
                    name: shippingInfo.name,
                    email: shippingInfo.email,
                    phone: shippingInfo.phone
                }
            );

            // Redirect to Shiprocket payment page
            if (paymentLinkResponse.payment_url) {
                window.location.href = paymentLinkResponse.payment_url;
            } else {
                // Fallback: Use Shiprocket's built-in payment in order response
                if (shiprocketResponse.payment_url) {
                    window.location.href = shiprocketResponse.payment_url;
                } else {
                    throw new Error('Payment URL not available');
                }
            }
            
        } else {
            throw new Error(shiprocketResponse.message || 'Failed to create order');
        }
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Order failed: ' + error.message);
        
        // Reset button
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }
}

// Alternative: Direct Shiprocket Checkout Integration
function redirectToShiprocketCheckout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const shippingInfo = getShippingInfo();
    
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const subtotal = calculateSubtotal(cartItems);
    const shipping = 50;
    const total = subtotal + shipping;

    // Create order data for direct integration
    const orderData = {
        order_id: `HM${Date.now()}`,
        amount: total,
        currency: 'INR',
        customer_name: shippingInfo.name,
        customer_email: shippingInfo.email,
        customer_phone: shippingInfo.phone,
        return_url: `${window.location.origin}/thankyou.html`,
        products: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }))
    };

    // Store order data temporarily
    sessionStorage.setItem('pending_order', JSON.stringify(orderData));

    // Redirect to Shiprocket checkout (URL format may vary)
    const checkoutUrl = `https://checkout.shiprocket.com/payment?${new URLSearchParams({
        order_id: orderData.order_id,
        amount: orderData.amount,
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        return_url: orderData.return_url
    })}`;

    window.location.href = checkoutUrl;
}

// Utility functions (same as before)
function getShippingInfo() {
    return {
        name: document.getElementById('shipping-name').value,
        email: document.getElementById('shipping-email').value,
        phone: document.getElementById('shipping-phone').value,
        address: document.getElementById('shipping-address').value,
        city: document.getElementById('shipping-city').value,
        state: document.getElementById('shipping-state').value,
        pincode: document.getElementById('shipping-pincode').value
    };
}

function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

}






