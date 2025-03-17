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
const PORT = 5000
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)

console.log("Server restarted!")
