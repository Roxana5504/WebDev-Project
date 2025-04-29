const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("frontend"))

app.use("/backend/images", express.static(path.join(__dirname, "images")))
app.use(express.static(path.join(__dirname, "../frontend")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"))
})
app.get("/products.json", (req, res) => {
  res.sendFile(path.join(__dirname, "products.json"))
})

app.get("/products/:query", (req, res) => {
  const query = req.params.query.toLowerCase()

  fs.readFile(path.join(__dirname, "products.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Eroare la citirea fișierului:", err)
      return res.status(500).send("Eroare server")
    }

    try {
      const jsonData = JSON.parse(data)
      const products = jsonData.products
      const results = products.filter((p) =>
        p.name.toLowerCase().includes(query)
      )
      res.json(results)
    } catch (parseError) {
      console.error("Eroare la parsarea JSON:", parseError)
      res.status(500).send("Eroare internă la parsare JSON")
    }
  })
})

const PORT = 5000
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)

console.log("Server restarted!")



// ADAUGA PRODUS-Elena
app.post("/products", (req, res) => {
  const newProduct = req.body

  const filePath = path.join(__dirname, "products.json")
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Eroare la citirea fișierului JSON:", err)
      return res.status(500).json({ message: "Eroare server" })
    }

    try {
      const jsonData = JSON.parse(data)
      const exists = jsonData.products.some(
        (p) => p.name.toLowerCase() === newProduct.name.toLowerCase()
      )

      if (exists) {
        return res.status(400).json({ message: "Produsul există deja!" })
      }

      jsonData.products.push(newProduct)

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Eroare la salvare:", writeErr)
          return res.status(500).json({ message: "Eroare la salvare" })
        }

        res.status(200).json({ message: "Produs adăugat cu succes" })
      })
    } catch (parseErr) {
      console.error("Eroare parsare JSON:", parseErr)
      res.status(500).json({ message: "Eroare la parsare JSON" })
    }
  })
})
