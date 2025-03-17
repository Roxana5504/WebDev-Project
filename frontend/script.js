<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function () {
    const categoryItems = document.querySelectorAll("aside li");
    const productList = document.getElementById("product-list");

    // Array de produse (simulat, poate veni dintr-o bază de date sau API)
    const products = [
        { name: "Caiet A5", price: "5.00 RON", image: "caiet.jpg", category: "rechizite" },
        { name: "Pix Albastru", price: "2.50 RON", image: "pix.jpg", category: "instrumente-de-scris" },
        { name: "Creioane Colorate", price: "15.00 RON", image: "creioane.jpg", category: "arta-creativitate" },
        { name: "Ghiozdan Ergonomic", price: "120.00 RON", image: "ghiozdan.jpg", category: "ghiozdane" },
        { name: "Radieră", price: "3.00 RON", image: "radiera.jpg", category: "accesorii" },
        { name: "Ascuțitoare Metalică", price: "4.00 RON", image: "ascutitoare.jpg", category: "accesorii" },
        { name: "Riglă 30cm", price: "6.00 RON", image: "rigla.jpg", category: "rechizite" },
        { name: "Penar Simplu", price: "25.00 RON", image: "penar.jpg", category: "rechizite" },
        { name: "Set Markere", price: "40.00 RON", image: "markere.jpg", category: "arta-creativitate" },
        { name: "Ghiozdan Clasic", price: "90.00 RON", image: "ghiozdan-clasic.jpg", category: "ghiozdane" }
    ];

    // Generăm HTML pentru fiecare produs
    function renderProducts() {
        productList.innerHTML = ""; // Ștergem produsele existente
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.setAttribute("data-category", product.category);
            productCard.innerHTML = `
                <img src="/backend/images/${product.image}" alt="${product.name}" style="width: 200px; height: 200px; object-fit: cover;">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <button>Adaugă în coș</button>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    renderProducts(); // Generăm produsele la încărcarea paginii

    // Filtrare produse după categorie
    categoryItems.forEach(item => {
        item.addEventListener("click", function () {
            const category = this.textContent.trim().toLowerCase().replace(/\s+/g, "-");
            const productCards = document.querySelectorAll(".product-card");

            productCards.forEach(product => {
                if (product.getAttribute("data-category") === category || category === "toate") {
                    product.style.display = "flex"; 
                } else {
                    product.style.display = "none";
                }
            });
        });
    });
});
=======
document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      const productList = document.getElementById("product-list")

      data.products.forEach((product) => {
        const productItem = document.createElement("div")
        productItem.classList.add("product")
        productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Preț: ${product.price.toFixed(2)} RON</p>
                    <button>Adaugă în coș</button>
                `
        productList.appendChild(productItem)
      })
    })
    .catch((error) => console.error("Eroare la încărcarea produselor:", error))
})
>>>>>>> 28ae6373c23822abb13fae528df2897c163904c2
