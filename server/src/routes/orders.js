import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/checkout", requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cart = await client.query(
      `SELECT c.id, c.quantity, p.id AS product_id, p.name, p.price, p.stock
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1
       ORDER BY c.id`,
      [req.user.id]
    );

    if (cart.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.rows) {
      if (item.quantity > item.stock) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    const total = cart.rows.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, user_id, total, created_at",
      [req.user.id, total]
    );

    const order = orderResult.rows[0];

    for (const item of cart.rows) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [order.id, item.product_id, item.quantity, item.price]
      );

      await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
        item.quantity,
        item.product_id
      ]);
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

    await client.query("COMMIT");
    return res.status(201).json({ order });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      "SELECT id, user_id, total, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    const orders = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT oi.id, oi.quantity, oi.price, p.name
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = $1
         ORDER BY oi.id`,
        [order.id]
      );

      orders.push({
        ...order,
        items: itemsResult.rows
      });
    }

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
