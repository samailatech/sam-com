import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, oauthGoogleUrl } from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/products", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    const oauthToken = searchParams.get("token");
    const userRaw = searchParams.get("user");
    if (oauthToken && userRaw) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userRaw));
        login(oauthToken, parsedUser);
        navigate("/products", { replace: true });
      } catch (_e) {
        setError("OAuth login failed");
      }
    }
  }, [searchParams, login, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const path = mode === "register" ? "/auth/register" : "/auth/login";
      const body = mode === "register" ? { name, email, password } : { email, password };
      const data = await api(path, {
        method: "POST",
        body: JSON.stringify(body)
      });
      login(data.token, data.user);
      navigate("/products", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h1>{mode === "login" ? "Login" : "Create Account"}</h1>
      <form onSubmit={submit} className="form">
        {mode === "register" ? (
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        ) : null}
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <button className="btn-muted oauth" onClick={() => (window.location.href = oauthGoogleUrl())}>
        Continue with Google
      </button>

      <button
        className="btn-link"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
      </button>
    </section>
  );
}
