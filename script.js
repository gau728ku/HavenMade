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
// Newsletter Join Form (Supabase)
// =============================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your project URL
const supabaseUrl = 'https://aejltrfuffkagrxivhei.supabase.co'
// Use environment variable key for security
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Handle newsletter form
document.addEventListener("DOMContentLoaded", () => {
  const joinForm = document.querySelector(".join-form")
  if (!joinForm) return

  joinForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const emailInput = joinForm.querySelector("input[type='email']")
    const email = emailInput.value.trim()

    if (!email) {
      alert("Please enter your email address.")
      return
    }

    // Insert subscriber into Supabase
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])

    if (error) {
      if (error.message.includes("duplicate key")) {
        alert("You’re already subscribed 💚")
      } else {
        console.error("Supabase error:", error)
        alert("Something went wrong. Please try again later.")
      }
    } else {
      emailInput.value = ""
      alert("🎉 Thanks for joining the HavenMade family!")
    }
  })
})
