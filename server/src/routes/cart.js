import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.quantity, p.id AS product_id, p.name, p.price
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1
       ORDER BY c.id DESC`,
      [req.user.id]
    );

    return res.json({ items: result.rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "productId and positive quantity are required" });
    }

    const productCheck = await pool.query("SELECT id, stock FROM products WHERE id = $1", [productId]);
    if (productCheck.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = await pool.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [req.user.id, productId]
    );

    let result;
    if (existing.rowCount > 0) {
      const nextQuantity = existing.rows[0].quantity + Number(quantity);
      result = await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING id, user_id, product_id, quantity",
        [nextQuantity, existing.rows[0].id]
      );
    } else {
      result = await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id, user_id, product_id, quantity",
        [req.user.id, productId, quantity]
      );
    }

    return res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be >= 1" });
    }

    const result = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING id, user_id, product_id, quantity",
      [quantity, req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.json({ item: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id", [
      req.params.id,
      req.user.id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
