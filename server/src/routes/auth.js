import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import pool from "../db.js";
import { signUserToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, provider) VALUES ($1, $2, $3, 'local') RETURNING id, name, email",
      [name, email, passwordHash]
    );

    const user = result.rows[0];
    const token = signUserToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const result = await pool.query("SELECT id, name, email, password_hash FROM users WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = user.password_hash ? await bcrypt.compare(password, user.password_hash) : false;
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email };
    const token = signUserToken(safeUser);

    return res.json({ user: safeUser, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    const user = { id: req.user.id, name: req.user.name, email: req.user.email };
    const token = signUserToken(user);
    const encodedUser = encodeURIComponent(JSON.stringify(user));
    return res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&user=${encodedUser}`);
  }
);

export default router;
