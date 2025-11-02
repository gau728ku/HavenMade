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

// Utility / DOM
const grid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartClose = document.getElementById('cart-close');
const cartCount = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const confirmUpi = document.getElementById('confirm-upi');

// initialize year
document.getElementById('year').textContent = new Date().getFullYear();

// render products
function renderProducts(){
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

// CART (localStorage)
let cart = JSON.parse(localStorage.getItem('havenmade_cart')||'{}');

function saveCart(){
  localStorage.setItem('havenmade_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const totalCount = Object.values(cart).reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = totalCount;
  document.getElementById('cart-count').textContent = totalCount;
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

// Open cart modal and render items
function openCart(){
  cartModal.classList.remove('hidden');
  renderCartItems();
}

function closeCart(){
  cartModal.classList.add('hidden');
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);

// Render cart
function renderCartItems(){
  if(!cart || Object.keys(cart).length===0){
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    cartSubtotalEl.textContent = '₹0';
    return;
  }
  let html = '';
  let subtotal = 0;
  Object.keys(cart).forEach(id=>{
    const prod = products.find(p=>p.id===id);
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
  cartSubtotalEl.textContent = `₹${subtotal}`;
}

// change qty
function changeQty(id, qty){
  if(qty<=0){
    delete cart[id];
  } else {
    cart[id].qty = qty;
  }
  saveCart();
  renderCartItems();
}

// Confirm UPI (user clicked 'I paid' after manual UPI)
confirmUpi.addEventListener('click', ()=>{
  // simple flow: collect buyer details via prompt (you can replace with a real form)
  const name = prompt('Your name');
  const phone = prompt('Phone number (for shipping)');
  const txn = prompt('Paste UPI txn id or type "paid" and press OK');
  if(!name || !phone || !txn){ alert('Please provide details to confirm order'); return; }

  // Build order summary
  const order = {
    id: 'ORDER-'+Date.now(),
    name, phone, txn,
    items: cart,
    subtotal: document.getElementById('cart-subtotal').innerText
  };

  // Here: you should send "order" to your email or Google Sheet.
  // For now we display a success message and clear cart.
  alert('Order received. Thank you! We will contact you for shipping.\nOrder ID: '+order.id);

  // clear cart
  cart = {};
  saveCart();
  renderCartItems();
  closeCart();
});

// init
renderProducts();
updateCartUI();
renderCartItems();

<script>
  document.getElementById("searchBtn").addEventListener("click", function() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    if (query) {
      // Redirect to a search results page (you’ll create this later)
      window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
  });
</script>

// --- ADD TO CART FUNCTIONALITY ---

// Get all Add to Cart buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Load existing cart from localStorage (or start empty)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add click event to each button
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'));
    const image = button.getAttribute('data-image');

    // Check if already in cart
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));

    // Small visual feedback
    alert(`${name} added to cart 🛒`);
  });
});

