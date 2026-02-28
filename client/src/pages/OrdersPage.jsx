import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api("/orders", {}, token);
        setOrders(data.orders);
      } catch (e) {
        setError(e.message);
      }
    };

    load();
  }, [token]);

  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h1>Orders</h1>
      {orders.length === 0 ? <p>No orders yet.</p> : null}
      <div className="stack">
        {orders.map((order) => (
          <article key={order.id} className="card">
            <h3>Order #{order.id}</h3>
            <p>Date: {new Date(order.created_at).toLocaleString()}</p>
            <p>Total: ${Number(order.total).toFixed(2)}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} (${Number(item.price).toFixed(2)})
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
