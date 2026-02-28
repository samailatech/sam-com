import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items]
  );

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await api("/cart", {}, token);
      setItems(data.items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (id, quantity) => {
    await api(
      `/cart/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ quantity })
      },
      token
    );
    loadCart();
  };

  const removeItem = async (id) => {
    await api(
      `/cart/${id}`,
      {
        method: "DELETE"
      },
      token
    );
    loadCart();
  };

  const checkout = async () => {
    try {
      await api(
        "/orders/checkout",
        {
          method: "POST"
        },
        token
      );
      alert("Order placed");
      navigate("/orders");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h1>Cart</h1>
      {items.length === 0 ? <p>Your cart is empty.</p> : null}
      <div className="stack">
        {items.map((item) => (
          <article key={item.id} className="card cart-item">
            <div>
              <h3>{item.name}</h3>
              <p>${Number(item.price).toFixed(2)}</p>
            </div>
            <div className="row">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQty(item.id, Number(e.target.value))}
              />
              <button className="btn-muted" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
      <h2>Total: ${total.toFixed(2)}</h2>
      <button disabled={items.length === 0} onClick={checkout}>
        Checkout
      </button>
    </section>
  );
}
