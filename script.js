
const money = n =>
  new Intl.NumberFormat("uz-UZ").format(n) + " so‘m";

const phones = [
  {
    id: 1, brand: "Apple", name: "iPhone 16 Pro",
    price: 14500000, memory: "256 GB", ram: "8 GB",
    screen: "6.3 dyuym OLED", camera: "48 MP",
    battery: "3582 mAh", chip: "A18 Pro",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=85",
    description: "Premium smartfon, kuchli protsessor va sifatli kamera."
  },
  {
    id: 2, brand: "Apple", name: "iPhone 15",
    price: 9500000, memory: "128 GB", ram: "6 GB",
    screen: "6.1 dyuym OLED", camera: "48 MP",
    battery: "3349 mAh", chip: "A16 Bionic",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=85",
    description: "Yengil korpus, sifatli kamera va tezkor ishlash."
  },
  {
    id: 3, brand: "Apple", name: "iPhone 14",
    price: 7200000, memory: "128 GB", ram: "6 GB",
    screen: "6.1 dyuym OLED", camera: "12 MP",
    battery: "3279 mAh", chip: "A15 Bionic",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=600&q=85",
    description: "Chiroyli dizayn va kundalik foydalanishga mos telefon."
  },
  {
    id: 4, brand: "Samsung", name: "Galaxy S25 Ultra",
    price: 16500000, memory: "256 GB", ram: "12 GB",
    screen: "6.9 dyuym AMOLED", camera: "200 MP",
    battery: "5000 mAh", chip: "Snapdragon 8 Elite",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=85",
    description: "Katta ekran, ilg‘or kamera va yuqori unumdorlik."
  },
  {
    id: 5, brand: "Samsung", name: "Galaxy A55",
    price: 4800000, memory: "128 GB", ram: "8 GB",
    screen: "6.6 dyuym AMOLED", camera: "50 MP",
    battery: "5000 mAh", chip: "Exynos 1480",
    image: "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=600&q=85",
    description: "Katta ekran va kundalik foydalanishga mos batareya."
  },
  {
    id: 6, brand: "Samsung", name: "Galaxy S24",
    price: 8900000, memory: "256 GB", ram: "8 GB",
    screen: "6.2 dyuym AMOLED", camera: "50 MP",
    battery: "4000 mAh", chip: "Exynos 2400",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=85",
    description: "Ixcham premium telefon va tezkor ishlash."
  },
  {
    id: 7, brand: "Xiaomi", name: "Redmi Note 13",
    price: 2300000, memory: "128 GB", ram: "6 GB",
    screen: "6.67 dyuym AMOLED", camera: "108 MP",
    battery: "5000 mAh", chip: "Snapdragon 685",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=85",
    description: "Katta ekran va kundalik foydalanishga qulay telefon."
  },
  {
    id: 8, brand: "Xiaomi", name: "Redmi Note 14",
    price: 2800000, memory: "256 GB", ram: "8 GB",
    screen: "6.67 dyuym AMOLED", camera: "108 MP",
    battery: "5500 mAh", chip: "Helio G99-Ultra",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=85",
    description: "Katta xotira va ravshan ekran."
  }
];

const $ = id => document.getElementById(id);

let authMode = "login";
let currentUser = null;
let activeBrand = "Barchasi";
let cart = [];
let toastTimer;

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("noir_users") || "[]");
  } catch {
    return [];
  }
}

// KIRISH VA REGISTRATSIYA
function setAuthMode(mode) {
  authMode = mode;

  $("loginTab").classList.toggle("active", mode === "login");
  $("registerTab").classList.toggle("active", mode === "register");
  $("nameField").classList.toggle("hidden", mode !== "register");
  $("fullName").required = mode === "register";

  $("authTitle").textContent =
    mode === "login" ? "Xush kelibsiz" : "Hisob yarating";

  $("authSubtitle").textContent =
    mode === "login"
      ? "Do‘konga kirish uchun hisobingizga kiring."
      : "Ro‘yxatdan o‘ting va xaridni boshlang.";

  $("authSubmit").textContent =
    mode === "login" ? "Kirish →" : "Ro‘yxatdan o‘tish →";

  $("password").autocomplete =
    mode === "login" ? "current-password" : "new-password";

  $("authError").textContent = "";
}

$("loginTab").addEventListener("click", () => setAuthMode("login"));
$("registerTab").addEventListener("click", () => setAuthMode("register"));

$("authForm").addEventListener("submit", e => {
  e.preventDefault();

  const email = $("email").value.trim().toLowerCase();
  const password = $("password").value;
  const users = getUsers();

  if (authMode === "register") {
    const name = $("fullName").value.trim();

    if (!name) return;

    if (users.some(u => u.email === email)) {
      $("authError").textContent =
        "Bu email oldin ro‘yxatdan o‘tgan.";
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("noir_users", JSON.stringify(users));

    currentUser = { name, email };
    enterStore();
  } else {
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      $("authError").textContent =
        "Email yoki parol noto‘g‘ri. Registratsiyadan o‘ting.";
      return;
    }

    currentUser = { name: user.name, email: user.email };
    enterStore();
  }
});

function enterStore() {
  $("authPage").classList.add("hidden");
  $("storePage").classList.remove("hidden");
  $("orderName").value = currentUser?.name || "";

  renderProducts();
  updateCart();
  window.scrollTo(0, 0);
}

$("logoutBtn").addEventListener("click", () => {
  currentUser = null;
  cart = [];

  $("storePage").classList.add("hidden");
  $("authPage").classList.remove("hidden");
  $("authForm").reset();

  setAuthMode("login");
});

$("shopNow").addEventListener("click", () => {
  $("catalog").scrollIntoView({ behavior: "smooth" });
});

// TELEFONLAR VA QIDIRUV
function renderProducts() {
  const q = $("searchInput").value.trim().toLowerCase();

  const filtered = phones.filter(p =>
    (activeBrand === "Barchasi" || p.brand === activeBrand) &&
    (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.memory.toLowerCase().includes(q)
    )
  );

  $("products").innerHTML = filtered.length
    ? filtered.map(p => `
      <article class="product">
        <div class="product-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-body">
          <div class="brand">${p.brand}</div>
          <h3>${p.name}</h3>
          <p class="spec">${p.memory} · ${p.ram} RAM<br>${p.screen}</p>
          <div class="price">${money(p.price)}</div>
          <div class="product-actions">
            <button class="add-btn" data-add="${p.id}">+ Savatga</button>
            <button class="details-btn" data-details="${p.id}">Batafsil</button>
          </div>
        </div>
      </article>
    `).join("")
    : `<div class="empty">Telefon topilmadi. Boshqa nom yozib ko‘ring.</div>`;
}

$("searchInput").addEventListener("input", renderProducts);

$("filters").addEventListener("click", e => {
  const btn = e.target.closest("[data-brand]");
  if (!btn) return;

  activeBrand = btn.dataset.brand;

  document.querySelectorAll(".filter").forEach(b => {
    b.classList.toggle("active", b === btn);
  });

  renderProducts();
});

$("products").addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const details = e.target.closest("[data-details]");

  if (add) addToCart(Number(add.dataset.add));
  if (details) showDetails(Number(details.dataset.details));
});

// TELEFON HAQIDA BATAFSIL
function showDetails(id) {
  const p = phones.find(x => x.id === id);
  if (!p) return;

  $("detailTitle").textContent = p.name;

  $("detailContent").innerHTML = `
    <img src="${p.image}" alt="${p.name}"
      style="width:100%;height:200px;object-fit:contain;background:#222;border-radius:10px;margin-bottom:18px">
    <div class="brand">${p.brand}</div>
    <h2 style="margin:8px 0 14px">${p.name}</h2>
    <p class="info-text">${p.description}</p>
    <p class="info-text">
      <b>Xotira:</b> ${p.memory}<br>
      <b>RAM:</b> ${p.ram}<br>
      <b>Ekran:</b> ${p.screen}<br>
      <b>Kamera:</b> ${p.camera}<br>
      <b>Batareya:</b> ${p.battery}<br>
      <b>Protsessor:</b> ${p.chip}
    </p>
    <h2 style="margin-bottom:18px">${money(p.price)}</h2>
    <button class="primary" id="detailAdd">Savatga qo‘shish</button>
  `;

  $("detailsModal").classList.remove("hidden");

  $("detailAdd").addEventListener("click", () => {
    addToCart(id);
    $("detailsModal").classList.add("hidden");
  });
}

// SAVATCHA
function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });

  updateCart();
  showToast("Telefon savatga qo‘shildi ✓");
}

function updateCart() {
  $("cartCount").textContent =
    cart.reduce((sum, item) => sum + item.qty, 0);

  const total = cart.reduce((sum, item) => {
    const p = phones.find(x => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  $("cartTotal").textContent = money(total);
  $("orderTotal").textContent = money(total);

  if (!cart.length) {
    $("cartItems").innerHTML =
      '<p class="info-text">Savatcha bo‘sh. Katalogdan telefon tanlang.</p>';

    $("checkoutBtn").disabled = true;
  } else {
    $("checkoutBtn").disabled = false;

    $("cartItems").innerHTML = cart.map(item => {
      const p = phones.find(x => x.id === item.id);

      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-info">
            <b>${p.name}</b>
            <p>${money(p.price)} × ${item.qty}</p>
            <div class="qty">
              <button data-minus="${p.id}">−</button>
              <span>${item.qty}</span>
              <button data-plus="${p.id}">+</button>
            </div>
          </div>
          <button class="remove" data-remove="${p.id}">O‘chirish</button>
        </div>
      `;
    }).join("");
  }
}

$("cartItems").addEventListener("click", e => {
  const minus = e.target.closest("[data-minus]");
  const plus = e.target.closest("[data-plus]");
  const remove = e.target.closest("[data-remove]");

  if (minus) {
    const item = cart.find(i => i.id === Number(minus.dataset.minus));
    if (item) item.qty--;
    cart = cart.filter(i => i.qty > 0);
  }

  if (plus) {
    const item = cart.find(i => i.id === Number(plus.dataset.plus));
    if (item) item.qty++;
  }

  if (remove) {
    cart = cart.filter(i => i.id !== Number(remove.dataset.remove));
  }

  updateCart();
});

$("openCart").addEventListener("click", () => {
  $("cartModal").classList.remove("hidden");
});

$("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;

  $("cartModal").classList.add("hidden");
  $("orderModal").classList.remove("hidden");
  updateCart();
});

// BUYURTMA
$("orderForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!cart.length) return;

  const order = {
    number: "NM-" + Date.now().toString().slice(-8),
    customer: $("orderName").value.trim(),
    phone: $("orderPhone").value.trim(),
    address: $("orderAddress").value.trim(),
    comment: $("orderComment").value.trim(),
    items: cart.map(item => {
      const p = phones.find(x => x.id === item.id);

      return {
        name: p.name,
        qty: item.qty,
        price: p.price
      };
    }),
    total: cart.reduce((sum, item) =>
      sum + phones.find(p => p.id === item.id).price * item.qty, 0
    ),
    createdAt: new Date().toISOString()
  };

  let orders = [];

  try {
    orders = JSON.parse(localStorage.getItem("noir_orders") || "[]");
  } catch {
    orders = [];
  }

  orders.push(order);
  localStorage.setItem("noir_orders", JSON.stringify(orders));

  $("orderModal").classList.add("hidden");
  $("orderForm").reset();

  cart = [];
  updateCart();

  showToast("Buyurtma #" + order.number + " demo rejimida saqlandi.");
});

// MODAL OYNALAR
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    $(btn.dataset.close).classList.add("hidden");
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.classList.add("hidden");
    });
  }
});

function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.remove("hidden");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    $("toast").classList.add("hidden");
  }, 2600);
}
