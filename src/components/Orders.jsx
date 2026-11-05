import { money } from '../api.js';

export default function Orders({ orders }) {
  return (
    <>
      <h2>Orders</h2>
      {!orders.length && <p className="muted">No orders yet.</p>}
      {orders.map((o) => (
        <div className="card order" key={o.id}>
          <div className="row"><strong>Order #{o.id}</strong><span className="muted">{new Date(o.created_at).toLocaleString()}</span></div>
          {o.items.map((i, n) => <div key={n}>{i.emoji} {i.name} × {i.qty}</div>)}
          <b>{money(o.total)}</b>
        </div>
      ))}
    </>
  );
}
