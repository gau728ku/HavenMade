// cart.js - Dedicated cart page functionality
console.log("🛒 cart.js loaded");

// Make sure updateCartCount is available
if (typeof updateCartCount !== 'function') {
    console.warn('updateCartCount not found, defining fallback');
    function updateCartCount() {
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("cart")) || [];
        } catch (e) {
            console.warn("Cart data invalid, clearing...");
            localStorage.removeItem("cart");
            cart = [];
        }

        const validItems = cart.filter(item => 
            item && 
            typeof item.quantity === "number" && 
            item.quantity > 0
        );

        const totalCount = validItems.reduce((sum, item) => sum + item.quantity, 0);
        
        const countElements = document.querySelectorAll('.cart-count');
        countElements.forEach(element => {
            element.textContent = totalCount > 0 ? totalCount : "0";
        });
        
        console.log("🔄 Cart count updated:", totalCount);
        return totalCount;
    }
}

function initializeCart() {
    console.log("Initializing cart...");
    
    const cartItemsContainer = document.getElementById("cart-items");
    const savedItemsContainer = document.getElementById("saved-items");
    const emptyCartMsg = document.getElementById("empty-cart");
    const emptySavedMsg = document.getElementById("empty-saved");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("cart-total");

    if (!cartItemsContainer) {
        console.error("❌ Cart items container not found!");
        return;
    }

    console.log("✅ Cart elements found");

    function loadCartData() {
        let cart = [];
        let saved = [];
        
        try {
            const cartData = localStorage.getItem("cart");
            console.log("📦 Raw cart data:", cartData);
            
            cart = JSON.parse(cartData) || [];
            saved = JSON.parse(localStorage.getItem("saved")) || [];
        } catch (e) {
            console.error("❌ Error parsing cart data:", e);
            cart = [];
            saved = [];
        }

        console.log("🛒 Cart items:", cart);
        console.log("💾 Saved items:", saved);

        // Clear containers
        cartItemsContainer.innerHTML = "";
        if (savedItemsContainer) savedItemsContainer.innerHTML = "";

        // Handle empty states
        if (emptyCartMsg) {
            emptyCartMsg.style.display = cart.length > 0 ? "none" : "block";
        }
        if (emptySavedMsg && savedItemsContainer) {
            emptySavedMsg.style.display = saved.length > 0 ? "none" : "block";
        }

        // Render cart items
        if (cart.length > 0) {
            cart.forEach((item, index) => {
                if (!item || !item.name) {
                    console.warn("⚠️ Invalid cart item:", item);
                    return;
                }

                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <img src="${item.image || 'images/default.jpg'}" alt="${item.name}" class="cart-img" />
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>₹${item.price}</p>
                        <div class="quantity-controls">
                            <button class="qty-btn minus" data-index="${index}">−</button>
                            <span class="item-quantity">${item.quantity || 1}</span>
                            <button class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                        <div class="cart-actions">
                            <button class="remove-btn" data-index="${index}">Remove</button>
                            <button class="save-btn" data-index="${index}">Save for Later</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            console.log(`✅ Rendered ${cart.length} cart items`);
        }

        // Render saved items
        if (saved.length > 0 && savedItemsContainer) {
            saved.forEach((item, index) => {
                if (!item || !item.name) return;
                
                const savedItem = document.createElement("div");
                savedItem.className = "saved-item";
                savedItem.innerHTML = `
                    <img src="${item.image || 'images/default.jpg'}" alt="${item.name}" class="cart-img" />
                    <div>
                        <h4>${item.name}</h4>
                        <p>₹${item.price}</p>
                        <button class="restore-btn" data-index="${index}">Move to Cart</button>
                    </div>
                `;
                savedItemsContainer.appendChild(savedItem);
            });
        }

        updateCartSummary(cart);
        updateCartCount(); // Update cart count on cart page too
    }

    function updateCartSummary(cart) {
        if (!subtotalEl || !totalEl) return;
        
        const subtotal = cart.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0);
        
        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        totalEl.textContent = `₹${subtotal.toFixed(2)}`;
        
        console.log("💰 Cart summary updated - Subtotal:", subtotal);
    }

    // Add this function to handle "You Might Also Like" add to cart buttons
    function setupProductCardListeners() {
        console.log("Setting up product card listeners...");
        
        // Listen for clicks on "You Might Also Like" add to cart buttons
        document.addEventListener('click', function(e) {
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (!addToCartBtn) return;
            
            // Check if this is from the "You Might Also Like" section
            const productCard = addToCartBtn.closest('.product-card');
            if (!productCard) return;
            
            console.log("Add to cart clicked in product card on cart page");
            
            const name = addToCartBtn.dataset.name;
            const price = parseFloat(addToCartBtn.dataset.price);
            const image = addToCartBtn.dataset.image || 'images/default.jpg';
            
            if (!name || isNaN(price)) {
                console.warn("Invalid product data");
                return;
            }
            
            addToCart(name, price, image);
        });
    }

    // Unified add to cart function for cart page
    function addToCart(name, price, image) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.name === name);
        
        if (existingItemIndex !== -1) {
            // Item exists, increase quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Product added to cart from cart page:", { name, price, image });
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showPopup(`✅ ${name} added to cart!`);
        
        // Reload cart display
        loadCartData();
    }

    // Event handlers for cart actions
    function setupEventListeners() {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("plus")) {
                handleQuantityChange(e.target.dataset.index, 1);
            } else if (e.target.classList.contains("minus")) {
                handleQuantityChange(e.target.dataset.index, -1);
            } else if (e.target.classList.contains("remove-btn")) {
                handleRemoveItem(e.target.dataset.index);
            } else if (e.target.classList.contains("save-btn")) {
                handleSaveForLater(e.target.dataset.index);
            } else if (e.target.classList.contains("restore-btn")) {
                handleRestoreItem(e.target.dataset.index);
            }
        });
    }

    function handleQuantityChange(index, change) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        index = parseInt(index);
        
        if (cart[index]) {
            cart[index].quantity = (cart[index].quantity || 1) + change;
            if (cart[index].quantity < 1) cart[index].quantity = 1;
            
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCartData();
            updateCartCount();
        }
    }

    function handleRemoveItem(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        index = parseInt(index);
        
        if (cart[index]) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCartData();
            updateCartCount();
        }
    }

    function handleSaveForLater(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let saved = JSON.parse(localStorage.getItem("saved")) || [];
        index = parseInt(index);
        
        if (cart[index]) {
            saved.push(cart[index]);
            cart.splice(index, 1);
            
            localStorage.setItem("cart", JSON.stringify(cart));
            localStorage.setItem("saved", JSON.stringify(saved));
            loadCartData();
            updateCartCount();
        }
    }

    function handleRestoreItem(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let saved = JSON.parse(localStorage.getItem("saved")) || [];
        index = parseInt(index);
        
        if (saved[index]) {
            cart.push(saved[index]);
            saved.splice(index, 1);
            
            localStorage.setItem("cart", JSON.stringify(cart));
            localStorage.setItem("saved", JSON.stringify(saved));
            loadCartData();
            updateCartCount();
            
            // Show success message
            showPopup(`✅ ${saved[index].name} moved to cart!`);
        }
    }

    // Add this popup function
    function showPopup(message) {
        const popup = document.createElement("div");
        popup.textContent = message;
        popup.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 9999;
            font-weight: 500;
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 2000);
    }

    // Initialize everything
    loadCartData();
    setupEventListeners();
    setupProductCardListeners(); // Add this line
    console.log("🎉 Cart initialized successfully");
}

// Wait for DOM to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCart);
} else {
    initializeCart();
}

// Product descriptions data
const productDescriptions = {
  "Lavender Calm": "Soothe your senses with our calming lavender blend. Perfect for evening relaxation and gentle enough for sensitive skin.",
  "Aloe & Cucumber": "Refresh and hydrate with the cooling duo of aloe vera and cucumber. Ideal for hot days and post-workout freshness.",
  "Charcoal Detox": "Deep cleanse with activated charcoal that draws out impurities. Great for oily and combination skin types.",
  "Rose Petal Bliss": "Indulge in luxury with rose petals and shea butter. Leaves skin feeling soft, nourished, and beautifully fragrant.",
  "Honey-Oats": "Gentle exfoliation meets deep moisturization. Honey and oats work together to soothe and soften even the driest skin.",
  "Lemon-Orange": "Awaken your senses with the zesty duo of lemon and orange. This citrus burst provides a refreshing start to your day while naturally brightening your skin.",
  "Glow & Calm Duo": "Indulge in the perfect balance of radiance and relaxation. This exquisite pairing combines our bestselling Rose Bliss for luminous, hydrated skin with the gentle exfoliation of Honey & Oats. Thoughtfully presented in an eco-friendly kraft box that's as beautiful as it is sustainable - perfect for gifting or treating yourself to everyday luxury.",
  "Refresh Duo": "A vibrant awakening for your senses and skin. Energize your routine with this zesty combination of Lemon + Orange for brightening, Aloe Cucumber for soothing hydration, and Mint Charcoal for deep purification. Three distinct experiences that work in harmony to refresh, revive, and rejuvenate your skin from head to toe.",
  "Luxe Spa Set": "Transform your bathroom into a personal sanctuary. Experience ultimate relaxation with our calming Lavender Calm, nourishing Honey & Oats, and complete the ritual with our elegant Wooden Soap Dish. This curated collection turns everyday bathing into a luxurious spa-like retreat, promoting mindfulness and self-care with every use.",
  "Celebration Hamper": "The ultimate gift for special moments. This generous collection features 4 assorted soaps carefully selected for variety and luxury, accompanied by a handwritten greeting card and stylish jute pouch. Perfect for birthdays, anniversaries, holidays, or simply celebrating life's beautiful moments with someone special."

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
      document.getElementById('modalProductDesc').textContent = description;
      
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

// Mobile Menu Toggle - SIMPLE AND RELIABLE
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-center');
  const body = document.body;

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  if (mobileMenuToggle && navMenu) {
    console.log('📱 Mobile menu initialized');
    
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      
      // Change icon
      const icon = mobileMenuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
      body.style.overflow = '';
      mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
    });

    // Close menu when clicking on a link (optional)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
      }
    });
  } else {
    console.log('❌ Mobile menu elements not found');
  }
});

// ======================
// RAZORPAY CHECKOUT
// ======================

document.addEventListener("click", async (event) => {
  if (!event.target.matches("#razorpay-checkout-btn")) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Calculate total
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Razorpay options
  var options = {
    "key": "rzp_test_RiHoS3p4X706cs",    // <-- your Razorpay test key
    "amount": total * 100,               // convert to paisa
    "currency": "INR",
    "name": "HavenMade",
    "description": "Order Payment",
    "image": "images/home/Logo.png",

    // Prefill customer data (optional)
    "prefill": {
      "name": "",
      "email": "",
      "contact": ""
    },

    // Theme color
    "theme": {
      "color": "#6D9773"
    },

    // SUCCESS
    "handler": function (response) {
      // Save order to localStorage for thank you page
      localStorage.setItem("lastOrder", JSON.stringify({
        payment_id: response.razorpay_payment_id,
        amount: total,
        cart: cart
      }));

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect
      window.location.href = "thankyou.html";
    }
  };

  var rzp = new Razorpay(options);
  rzp.open();
});
