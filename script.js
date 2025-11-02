// ===========================
// HAVENMADE MAIN JS FILE
// ===========================

// --- BASIC PRODUCT DATA (optional for product pages) ---
const products = [
  { id: "p1", title: "Brightening Herbal Bar", price: 249, img: "images/product1.jpg" },
  { id: "p2", title: "Charcoal Detox Bar", price: 249, img: "images/product2.jpg" },
  { id: "p3", title: "Rose & Milk Glow Bar", price: 299, img: "images/product3.jpg" }
];

// --- DOM ELEMENTS ---
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- SEARCH FUNCTIONALITY ---
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
      } else {
        alert("Please enter a product name to search.");
      }
    });
  }

  // --- ADD TO CART BUTTONS ---
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));
      const image = button.getAttribute("data-image");
      addToCart({ name, price, image });
      alert(`${name} added to cart!`);
    });
  });

  updateCartCount();
});

// --- CART LOGIC ---
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

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
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your Supabase project URL
const supabaseUrl = 'https://aejltrfuffkagrxivhei.supabase.co'
// Your public (anon) API key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlamx0cmZ1ZmZrYWdyeGl2aGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzkxODMsImV4cCI6MjA3NzY1NTE4M30.FtqWMawlfvvUyDtmkomIHhNn1pIhDfuwOHFPYZyvvDo'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)


// =============================
// Newsletter Join Form Handler
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('subscribe-email');
  const message = document.getElementById('subscribe-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      message.textContent = 'Please enter a valid email.';
      message.style.color = 'red';
      return;
    }

    // Insert subscriber email into Supabase table
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      console.error("Supabase Error:", error);
      if (error.message.includes("duplicate")) {
        message.textContent = "You’re already subscribed 💚";
        message.style.color = 'orange';
      } else {
        message.textContent = 'Something went wrong. Please try again.';
        message.style.color = 'red';
      }
    } else {
      message.textContent = '🎉 Thanks for joining the HavenMade family!';
      message.style.color = 'green';
      form.reset();
    }
  });
});




