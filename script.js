const products = [
  { name: "Smartphone", price: 50, category: "electronics", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?fm=jpg&q=60&w=3000" },
  { name: "Laptop", price: 90, category: "electronics", img: "https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg?auto=webp" },
  { name: "T-Shirt", price: 20, category: "clothing", img: "https://zed.com.pk/cdn/shop/files/050A7239.jpg?v=1694254964" },
  { name: "Jeans", price: 30, category: "clothing", img: "https://img.drz.lazcdn.com/static/pk/p/7c63b65d085369c8c5336a8110701997.jpg_720x720q80.jpg_.webp" },
  { name: "Sofa", price: 80, category: "home", img: "https://i5.walmartimages.com/seo/Black-Velvet-Sofa-82-3-Seat-Sofa-Couch-Velvet-Upholstered-Couch-Living-Room-Modern-Futon-Tufted-Sofa-Gold-Metal-Legs-Accent-Arm-Sofa-Furniture-Home-A.jpeg" }
];

let cart = [];
function showToast(message) {
  const toastContainer = document.getElementById("toast");
  
  toastContainer.innerHTML = `
    <div class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slideIn">
      ${message}
    </div>
  `;
  
  toastContainer.classList.remove("hidden");

  setTimeout(() => {
    toastContainer.classList.add("opacity-0", "transition-opacity", "duration-500");
    setTimeout(() => {
      toastContainer.classList.add("hidden");
      toastContainer.classList.remove("opacity-0");
    }, 500);
  }, 2000); // 2 sec delay before fade-out
}

// Example usage
// showToast("Product added to cart!");


// Render Products
function renderProducts() {
  const search = searchBar.value.toLowerCase();
  const category = categoryFilter.value;
  const sortOrder = sortOrderSelect.value;
  const maxPrice = priceSlider.value;

  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (category === "all" || p.category === category) &&
    p.price <= maxPrice
  );

  if (sortOrder === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sortOrder === "high-low") filtered.sort((a, b) => b.price - a.price);

  productList.innerHTML = filtered.map(p => `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
      <img src="${p.img}" alt="${p.name}" class="w-full h-48 object-cover">
      <div class="p-4 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold flex-grow">${p.name}</h2>
        <p class="text-blue-600 font-bold mb-3">$${p.price}</p>
        <button onclick="addToCart('${p.name}', ${p.price})" 
          class="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  `).join("");
}

// Add to Cart
function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
  showToast(`${name} added to cart!`);
}

// Remove from Cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    cartItems.innerHTML += `
      <div class="flex justify-between items-center border p-2 rounded-lg">
        <div>
          <h4 class="font-semibold">${item.name}</h4>
          <p>$${item.price} x ${item.quantity}</p>
        </div>
        <button onclick="removeFromCart('${item.name}')" class="text-red-500 hover:text-red-700">&times;</button>
      </div>
    `;
  });

  let tax = subtotal * 0.1;
  let total = subtotal + tax;

  cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
  subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
  taxElem.textContent = `$${tax.toFixed(2)}`;
  totalElem.textContent = `$${total.toFixed(2)}`;
}

// Element Shortcuts
const searchBar = document.getElementById("search-bar");
const categoryFilter = document.getElementById("category-filter");
const sortOrderSelect = document.getElementById("sort-order");
const priceSlider = document.getElementById("price-slider");
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const subtotalElem = document.getElementById("subtotal");
const taxElem = document.getElementById("tax");
const totalElem = document.getElementById("total");

// Listeners
searchBar.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortOrderSelect.addEventListener("change", renderProducts);
priceSlider.addEventListener("input", () => {
  document.getElementById("price-value").textContent = priceSlider.value;
  renderProducts();
});

document.getElementById("cart-btn").addEventListener("click", () => {
  document.getElementById("cart-drawer").classList.remove("translate-x-full");
});
document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart-drawer").classList.add("translate-x-full");
});

// Start
renderProducts();
