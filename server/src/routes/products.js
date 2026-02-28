import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, image_url, rating, review_count, category, brand, price, stock, created_at
       FROM products
       ORDER BY id DESC`
    );
    return res.json({ products: result.rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
