
const API_URL = 'https://fakestoreapi.com/products/category/electronics';
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsList = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const messageModal = document.getElementById('messageModal');
const closeMessage = document.getElementById('closeMessage');
const messageContent = document.getElementById('messageContent');

let products = [];
let cart = loadCart();

const EXTRA_PRODUCTS = [
  {
    id: 1001,
    title: 'Sony WH-1000XM5 Headphones',
    price: 349.99,
    image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
    badge: 'New',
    description: 'Industry-leading noise cancellation, crystal-clear sound, and all-day comfort for music lovers and professionals.'
  },
  {
    id: 1007,
    title: 'Dell Inspiron 15 Laptop',
    price: 549.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    badge: 'Featured',
    description: 'A reliable laptop for work and study.\n\n<b>Model:</b> Dell Inspiron 15 3000<br><b>RAM:</b> 8GB DDR4<br><b>Storage:</b> 256GB SSD<br><b>Hard Disk Drive:</b> 1TB HDD'
  },
  {
    id: 1002,
    title: 'Apple Watch Series 9',
    price: 399.99,
    image: 'https://m.media-amazon.com/images/I/71X6mnUDSzL._AC_SL1500_.jpg',
    badge: 'Trending',
    description: 'Stay connected, track your health, and get notifications on your wrist with the latest Apple Watch.'
  },
  {
    id: 1003,
    title: 'Canon EOS M50 Mark II Camera',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    badge: 'Best Seller',
    description: 'A compact, versatile mirrorless camera perfect for vlogging, photography, and video creation.'
  },
  {
    id: 1004,
    title: 'Samsung Galaxy Tab S8',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    badge: 'Hot',
    description: 'A powerful Android tablet with a stunning display, S Pen support, and long battery life for work and play.'
  },
  {
    id: 1005,
    title: 'Fitbit Charge 6',
    price: 129.99,
    image: 'https://m.media-amazon.com/images/I/61Qe0euJJZL._AC_SL1500_.jpg',
    badge: 'Popular',
    description: 'Track your fitness, heart rate, sleep, and more with this advanced, comfortable fitness tracker.'
  },
  {
    id: 1006,
    title: 'DJI Mini 3 Drone',
    price: 469.99,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    badge: 'New',
    description: 'Capture stunning aerial photos and videos with this lightweight, easy-to-fly drone from DJI.'
  },
];



// Fetch products from API  
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    let apiProducts = await res.json();
    // Ensure no ID collision
    apiProducts = apiProducts.map(p => ({ ...p, badge: undefined }));
    products = [...EXTRA_PRODUCTS, ...apiProducts];
    renderProducts(products);
  } catch (err) {
    products = [...EXTRA_PRODUCTS];
    renderProducts(products);
    showMessage('Failed to load products from API. Showing featured products only.');
  }
}

// SPA Navigation (robust)
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');
function showSection(page) {
  sections.forEach(sec => sec.classList.add('hidden'));
  const section = document.getElementById(page);
  if (section) section.classList.remove('hidden');
  navLinks.forEach(link => link.classList.remove('active'));
  const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (navLink) navLink.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Close burger menu on navigation (mobile/tablet)
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu) navMenu.classList.remove('open');
}
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(link.getAttribute('data-page'));
    if (link.getAttribute('data-page') === 'products') {
      document.getElementById('searchInput').focus();
    }
  });
});
// Show Home by default
showSection('home');

// Shop Now button scrolls to Products page
const shopNowBtn = document.getElementById('shopNowBtn');
if (shopNowBtn) {
  shopNowBtn.addEventListener('click', () => {
    showSection('products');
    document.getElementById('searchInput').focus();
  });
}

// Burger menu toggle for mobile nav
const burgerMenu = document.getElementById('burgerMenu');
const navMenu = document.querySelector('.nav-menu');
if (burgerMenu && navMenu) {
  burgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    burgerMenu.classList.toggle('open'); // Animate burger to X
  });
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burgerMenu.classList.remove('open'); // Reset burger
    });
  });
}

// Responsive nav toggle for .toggle-button and .navbar.active
const toggleButton = document.querySelector('.toggle-button');
const navbar = document.querySelector('.navbar');
if (toggleButton && navbar) {
  toggleButton.addEventListener('click', function(e) {
    e.preventDefault();
    navbar.classList.toggle('active');
  });
  navbar.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
    });
  });
}

// Product rendering (to #productsGrid)
function renderProducts(productList) {
  productsGrid.innerHTML = '';
  if (productList.length === 0) {
    productsGrid.innerHTML = '<p>No products found.</p>';
    return;
  }
  productList.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      ${product.badge ? `<span class=\"badge\">${product.badge}</span>` : ''}
      <img src=\"${product.image}\" alt=\"${product.title}\">
      <h3>${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <div class=\"card-actions\">
        <button data-id=\"${product.id}\" class=\"add-cart-btn\">Add to Cart</button>
        <button data-id=\"${product.id}\" class=\"view-details-btn\">View Details</button>
      </div>
    `;
    div.querySelector('.add-cart-btn').addEventListener('click', () => addToCart(product.id));
    div.querySelector('.view-details-btn').addEventListener('click', () => showProductModal(product.id));
    productsGrid.appendChild(div);
  });
}
