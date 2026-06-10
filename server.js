const express = require("express");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express(); // 👈 MUST BE FIRST

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Products endpoint
const pool = require("./db");

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});