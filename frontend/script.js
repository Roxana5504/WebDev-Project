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

//MODIFICAT ELENA PT ADAUGAPRODUS: fiind două tipuri de modale:#product-modal pentru rezultatul căutării #add-product-modal pentru formularul de adăugare
//folosim querySelector(".modal-overlay") pt a ne asigură că oricare dintre ele se închide corect.
function closeModal() {
  const modal = document.querySelector(".modal-overlay")
  if (modal) modal.remove()
}

const sidebarToggle = document.getElementById("sidebar-toggle")
const sidebar = document.querySelector(".sidebar")

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open")
})
//Sfarsit cod Roxana



//ELENA-AGAUGA PRODUS-
function openAddProductForm(query) {
  closeModal()

  const formHTML = `
    <div id="add-product-modal" class="modal-overlay">
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
          <input type="text" name="image" />

          <button type="submit">Salvează produs</button>
        </form>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", formHTML)

  document
    .getElementById("add-product-form")
    .addEventListener("submit", function (e) {
      e.preventDefault()

      const formData = new FormData(this)
      
     const imageUrl = formData.get("image") || "/backend/images/default.jpg"

const product = {
  name: formData.get("name"),
  price: parseFloat(formData.get("price")),
  quantity: parseInt(formData.get("quantity")),
  image: imageUrl
}


      fetch("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw new Error(err.message || "Eroare necunoscută")
            })
          }
          return res.json()
        })
        .then((data) => {
          alert("Produsul a fost adăugat cu succes!")
          closeModal()
        })
        .catch((err) => {
          alert("Eroare: " + err.message)
        })
    })
}


