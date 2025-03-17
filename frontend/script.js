document.addEventListener("DOMContentLoaded", () => {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById("product-list");

            data.products.forEach(product => {
                const productItem = document.createElement("div");
                productItem.classList.add("product");
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Preț: ${product.price.toFixed(2)} RON</p>
                    <button>Adaugă în coș</button>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error("Eroare la încărcarea produselor:", error));
});
