//Roxana
document.addEventListener("DOMContentLoaded", function () {
  const categoryItems = document.querySelectorAll("aside li")
  const productList = document.getElementById("product-list")
  let products = []

  fetch("/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Eroare la încărcarea fișierului products.json")
      }
      return response.json()
    })
    .then((data) => {
      products = data.products.map((product) => {
        const name = product.name.toLowerCase()
        let category = "altele"

        if (name.includes("ghiozdan")) category = "ghiozdane"
        else if (
          name.includes("pix") ||
          name.includes("creion") ||
          name.includes("marker") ||
          name.includes("pensul")
        )
          category = "arta-creativitate"
        else if (
          name.includes("radier") ||
          name.includes("ascuțitoare") ||
          name.includes("rigl")
        )
          category = "accesorii"
        else if (
          name.includes("caiet") ||
          name.includes("penar") ||
          name.includes("bloc")
        )
          category = "rechizite"

        return { ...product, category }
      })

      renderProducts()
    })
    .catch((error) => {
      console.error("Eroare la încărcare produse:", error)
    })

  function renderProducts() {
    productList.innerHTML = ""
    products.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.classList.add("product-card")
      productCard.setAttribute("data-category", product.category)
      productCard.innerHTML = `
        <img src="${product.image}" alt="${
        product.name
      }" style="width: 200px; height: 200px; object-fit: cover;">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.price.toFixed(2)} RON</p>
          <button>Adaugă în coș</button>
        </div>
      `
      productList.appendChild(productCard)
    })
  }

  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.textContent
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
      const productCards = document.querySelectorAll(".product-card")

      productCards.forEach((product) => {
        if (
          product.getAttribute("data-category") === category ||
          category === "toate"
        ) {
          product.style.display = "flex"
        } else {
          product.style.display = "none"
        }
      })
    })
  })
})

document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.trim()

  fetch(`/products/${query}`)
    .then((res) => {
      if (!res.ok) throw new Error("Server error: " + res.status)
      return res.json()
    })
    .then((data) => {
      if (data.length > 0) {
        showModalWithProducts(data)
      } else {
        showNoProductFoundModal(query)
      }
    })
    .catch((err) => {
      console.error("Eroare:", err)
    })
})

document.getElementById("buy-now-btn").addEventListener("click", () => {
  const query = "Ghiozdan Clasic"
  fetch(`/products/${query}`)
    .then((res) => {
      if (!res.ok) throw new Error("Server error: " + res.status)
      return res.json()
    })
    .then((data) => {
      if (data.length > 0) {
        showModalWithProducts(data)
      } else {
        showNoProductFoundModal(query)
      }
    })
    .catch((err) => {
      console.error("Eroare:", err)
    })
})

function showModalWithProducts(products) {
  let modalHTML = `
      <div id="product-modal" class="modal-overlay">
        <div class="modal-content">
          <span class="close-btn" onclick="closeModal()">&times;</span>
          <h2>Rezultate Căutare</h2>
          <div class="modal-products">
    `

  products.forEach((product) => {
    modalHTML += `
        <div class="modal-product-card">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>Preț: ${product.price} lei</p>
          <p>Cantitate: ${product.quantity ?? "Nespecificat"}</p>
        </div>
      `
  })

  modalHTML += `
          </div>
        </div>
      </div>
    `

  document.body.insertAdjacentHTML("beforeend", modalHTML)
}

function showNoProductFoundModal(query) {
  const modalHTML = `
      <div id="product-modal" class="modal-overlay">
        <div class="modal-content">
          <span class="close-btn" onclick="closeModal()">&times;</span>
          <h2>Produs negăsit</h2>
          <p>Nu am găsit produsul <strong>"${query}"</strong>.</p>
          <p>Dorești să îl adaugi în magazin?</p>
          <div class="modal-buttons">
          <button onclick="openAddProductForm('${query}')">Adaugă produs</button>
          <button onclick="closeModal()">Încearcă din nou</button></div>
        </div>
      </div>
    `
  document.body.insertAdjacentHTML("beforeend", modalHTML)
}

function closeModal() {
  const modal = document.getElementById("product-modal")
  if (modal) modal.remove()
}

const sidebarToggle = document.getElementById("sidebar-toggle")
const sidebar = document.querySelector(".sidebar")

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open")
})
//Sfarsit cod Roxana
