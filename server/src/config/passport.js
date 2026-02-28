import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [id]);
    done(null, result.rows[0] || null);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || "Google User";

        if (!email) {
          return done(new Error("Google profile has no email"));
        }

        let userResult = await pool.query("SELECT id, name, email FROM users WHERE email = $1", [email]);

        if (userResult.rowCount === 0) {
          userResult = await pool.query(
            "INSERT INTO users (name, email, provider) VALUES ($1, $2, 'google') RETURNING id, name, email",
            [name, email]
          );
        }

        return done(null, userResult.rows[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
