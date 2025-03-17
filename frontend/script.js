fetch("/products.json")
  .then((response) => response.json())
  .then((data) => {
    const productList = document.getElementById("product-list")
    productList.innerHTML = ""

    data.products.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.classList.add("product-card")

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.price.toFixed(2)} RON</p>
          <button>Adaugă în coș</button>
        </div>
      `

      productList.appendChild(productCard)
    })
  })
  .catch((error) => console.error("Eroare la încărcarea produselor:", error))
