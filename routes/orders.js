const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// CREATE ORDER (PROTECTED)
// =========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const user_id = req.user.userId;

    const result = await pool.query(
      "INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [user_id, product_id, quantity]
    );

    res.json({
      message: "Order created successfully",
      order: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// GET MY ORDERS (PROTECTED)
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const result = await pool.query(
      `SELECT o.id, o.quantity, o.created_at,
              p.name, p.price
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.user_id = $1`,
      [user_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;