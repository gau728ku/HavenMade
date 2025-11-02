// ===========================
// HAVENMADE MAIN JS FILE
// ===========================

// Basic product data (edit this array to add/remove products)
const products = [
  {
    id: "p1",
    title: "Brightening Herbal Bar",
    price: 249,
    desc: "Turmeric, aloe & coconut oil — gentle brightening bar.",
    img: "images/product1.jpg"
  },
  {
    id: "p2",
    title: "Charcoal Detox Bar",
    price: 249,
    desc: "Activated charcoal + tea tree for a deep clean.",
    img: "images/product2.jpg"
  },
  {
    id: "p3",
    title: "Rose & Milk Glow Bar",
    price: 299,
    desc: "Rose petals and milk extract for a soft glow.",
    img: "images/product3.jpg"
  }
];

// Utility / DOM elements
const grid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartClose = document.getElementById('cart-close');
const cartCount = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const confirmUpi = document.getElementById('confirm-upi');

// Initialize current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ----------------------------
// Render Products on Homepage
// ----------------------------
function renderProducts(){
  if(!grid) return;
  let html = '';
  products.forEach(p=>{
    html += `
      <div class="card">
        <img src="${p.img}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="price">₹${p.price}</div>
        <div class="actions">
          <button class="btn-outline" onclick="addToCart('${p.id}')">Add to cart</button>
          <button class="btn-primary" onclick="buyNow('${p.id}')">Buy Now</button>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

// ----------------------------
// CART FUNCTIONALITY
// ----------------------------
let cart = JSON.parse(localStorage.getItem('havenmade_cart') || '{}');

function saveCart(){
  localStorage.setItem('havenmade_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const totalCount = Object.values(cart).reduce((s,i)=>s+i.qty,0);
  if (cartCount) cartCount.textContent = totalCount;
}

function addToCart(id){
  cart[id] = cart[id] || { qty:0 };
  cart[id].qty++;
  saveCart();
  alert('Added to cart');
}

function buyNow(id){
  addToCart(id);
  openCart();
}

// Open / Close cart modal
function openCart(){
  if (cartModal) {
    cartModal.classList.remove('hidden');
    renderCartItems();
  }
}

function closeCart(){
  if (cartModal) {
    cartModal.classList.add('hidden');
  }
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);

// Render cart content
function renderCartItems(){
  if(!cartItemsEl) return;

  if(!cart || Object.keys(cart).length===0){
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    if (cartSubtotalEl) cartSubtotalEl.textContent = '₹0';
    return;
  }

  let html = '';
  let subtotal = 0;
  Object.keys(cart).forEach(id=>{
    const prod = products.find(p=>p.id===id);
    if(!prod) return;
    const qty = cart[id].qty;
    const line = prod.price * qty;
    subtotal += line;
    html += `
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <img src="${prod.img}" style="width:72px;height:72px;object-fit:cover;border-radius:6px">
        <div style="flex:1">
          <strong>${prod.title}</strong><br>
          <small>₹${prod.price} × ${qty} = ₹${line}</small>
        </div>
        <div>
          <button onclick="changeQty('${id}', ${Math.max(0,qty-1)})">-</button>
          <button onclick="changeQty('${id}', ${qty+1})">+</button>
        </div>
      </div>
    `;
  });
  cartItemsEl.innerHTML = html;
  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
}

// Change quantity
function changeQty(id, qty){
  if(qty<=0){
    delete cart[id];
  } else {
    cart[id].qty = qty;
  }
  saveCart();
  renderCartItems();
}

// Confirm UPI Order
if (confirmUpi) {
  confirmUpi.addEventListener('click', ()=>{
    const name = prompt('Your name');
    const phone = prompt('Phone number (for shipping)');
    const txn = prompt('Paste UPI txn id or type "paid" and press OK');
    if(!name || !phone || !txn){ alert('Please provide details to confirm order'); return; }

    const order = {
      id: 'ORDER-'+Date.now(),
      name, phone, txn,
      items: cart,
      subtotal: document.getElementById('cart-subtotal')?.innerText
    };

    alert('Order received. Thank you! We will contact you for shipping.\nOrder ID: '+order.id);

    cart = {};
    saveCart();
    renderCartItems();
    closeCart();
  });
}

// ----------------------------
// SEARCH FUNCTIONALITY
// ----------------------------
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", function() {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
  });
}

// ----------------------------
// INITIALIZATION
// ----------------------------
renderProducts();
updateCartUI();
renderCartItems();
