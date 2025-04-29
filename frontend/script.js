// Codul inițial al Roxanei pentru căutare și afișare produse
document.addEventListener("DOMContentLoaded", function () {
  const categoryItems = document.querySelectorAll("aside li");
  const productList = document.getElementById("product-list");
  let products = [];

  // Încarcă produsele din JSON
  fetch("/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Eroare la încărcarea fișierului products.json");
      }
      return response.json();
    })
    .then((data) => {
      // Adaugă categorie produselor
      products = data.products.map((product) => {
        const name = product.name.toLowerCase();
        let category = "altele";

        if (name.includes("ghiozdan")) category = "ghiozdane";
        else if (
          name.includes("pix") ||
          name.includes("creion") ||
          name.includes("marker") ||
          name.includes("pensul")
        )
          category = "arta-creativitate";
        else if (
          name.includes("radier") ||
          name.includes("ascuțitoare") ||
          name.includes("rigl")
        )
          category = "accesorii";
        else if (
          name.includes("caiet") ||
          name.includes("penar") ||
          name.includes("bloc")
        )
          category = "rechizite";

        return { ...product, category };
      });

      // Afișează produsele la încărcare și la filtrare
      renderProducts();
    })
    .catch((error) => {
      console.error("Eroare la încărcare produse:", error);
    });

  // Persistență cart și favorite în localStorage
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let favoriteItems = JSON.parse(localStorage.getItem("favorites")) || [];

  // Funcții pentru actualizarea numerelor din badge-uri
  function updateCartCount() {
    document.getElementById("cart-count").textContent = cartItems.length;
  }
  function updateFavCount() {
    document.getElementById("fav-count").textContent = favoriteItems.length;
  }
  // Actualizează badge-urile la load
  updateCartCount();
  updateFavCount();

  function renderProducts() {
    productList.innerHTML = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-category", product.category);
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:200px;height:200px;object-fit:cover;">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.price.toFixed(2)} RON</p>
          <div class="actions">
            <button class="add-to-cart-btn" data-name="${product.name}">Adaugă în coș</button>
            <i class="bx bx-heart fav-icon" data-name="${product.name}"></i>
          </div>
        </div>
      `;
      productList.appendChild(productCard);
    });

    // Atașează event listeners pentru butoane și favorite
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const prod = products.find((p) => p.name === name);
        cartItems.push(prod);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCartCount();
        alert(`${name} a fost adăugat în coș.`);
      });
    });
    document.querySelectorAll(".fav-icon").forEach((icon) => {
      if (favoriteItems.some((p) => p.name === icon.dataset.name)) {
        icon.classList.add("favorite");
      }
      icon.addEventListener("click", () => {
        const name = icon.dataset.name;
        const prod = products.find((p) => p.name === name);
        const idx = favoriteItems.findIndex((p) => p.name === name);
        if (idx === -1) {
          favoriteItems.push(prod);
          icon.classList.add("favorite");
        } else {
          favoriteItems.splice(idx, 1);
          icon.classList.remove("favorite");
        }
        localStorage.setItem("favorites", JSON.stringify(favoriteItems));
        updateFavCount();
      });
    });
  }

  // Evenimente header cos si favorite
  document.getElementById("cart-btn").addEventListener("click", showCartModal);
  document.getElementById("fav-btn").addEventListener("click", showFavoritesModal);

  // Filtrare categorii
  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.textContent.trim().toLowerCase().replace(/\s+/g, "-");
      document.querySelectorAll(".product-card").forEach((product) => {
        if (product.getAttribute("data-category") === category || category === "toate") {
          product.style.display = "flex";
        } else {
          product.style.display = "none";
        }
      });
    });
  });
});

// Gestionare modale și post-adăugare produs
function showModalWithProducts(products) {
  let modalHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>Rezultate Căutare</h2>
        <div class="modal-products">
  `;
  products.forEach((p) => {
    modalHTML += `
      <div class="modal-product-card">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>Preț: ${p.price} lei</p>
        <p>Cantitate: ${p.quantity ?? "Nespecificat"}</p>
      </div>
    `;
  });
  modalHTML += `
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
function showNoProductFoundModal(query) {
  const modalHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>Produs negăsit</h2>
        <p>Nu am găsit produsul <strong>"${query}"</strong>.</p>
        <p>Dorești să îl adaugi în magazin?</p>
        <div class="modal-buttons">
          <button onclick="openAddProductForm('${query}')">Adaugă produs</button>
          <button onclick="closeModal()">Încearcă din nou</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) modal.remove();
}
function openAddProductForm(query) {
  closeModal();
  const formHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>Adaugă produs nou</h2>
        <form id="add-product-form">
          <label>Nume produs:</label>
          <input type="text" name="name" value="${query}" required />
          <label>Preț:</label>
          <input type="number" name="price" step="0.01" required />
          <label>Cantitate:</label>
          <input type="number" name="quantity" required />
          <label>URL imagine:</label>
          <input type="text" name="image" required />
          <button type="submit">Salvează produs</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", formHTML);
  document.getElementById("add-product-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const product = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      quantity: parseInt(formData.get("quantity")),
      image: formData.get("image"),
    };
    fetch("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => { throw new Error(err.message); });
        return res.json();
      })
      .then(() => {
        alert("Produsul a fost adăugat cu succes!");
        closeModal();
      })
      .catch((err) => {
        alert("Eroare: " + err.message);
      });
  });
}
// Modale pentru Coș și Favorite
function showCartModal() {
  if (cartItems.length === 0) { alert("Coșul tău este gol."); return; }
  let html = `
    <div class="modal-overlay">
      <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>Coșul meu</h2>
        <div class="modal-products">
  `;
  cartItems.forEach((p) => {
    html += `
      <div class="modal-product-card">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>Preț: ${p.price} lei</p>
        <p>Cantitate: ${p.quantity ?? "Nespecificat"}</p>
      </div>`;
  });
  html += `
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}
function showFavoritesModal() {
  if (favoriteItems.length === 0) { alert("Nu ai produse favorite."); return; }
  let html = `
    <div class="modal-overlay">
      <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>Favoritele mele</h2>
        <div class="modal-products">
  `;
  favoriteItems.forEach((p) => {
    html += `
      <div class="modal-product-card">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>Preț: ${p.price} lei</p>
        <p>Cantitate: ${p.quantity ?? "Nespecificat"}</p>
      </div>`;
  });
  html += `
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}