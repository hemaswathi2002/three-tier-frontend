import { money } from '../api.js';

export default function Orders({ orders }) {
  return (
    <>
      <h2>Orders</h2>
      {!orders.length && <p className="muted">No orders yet.</p>}
      {orders.map((o) => (
        <div className="card order" key={o.id}>
          <div className="row">
            <strong>Order #{o.id}</strong>
            <span className="muted">{new Date(o.created_at).toLocaleString()}</span>
          </div>
          <div style={{ margin: '.5rem 0' }}>
            {o.items.map((i, n) => (
              <div key={n} className="order-item-line">
                {i.image_url ? (
                  <img src={i.image_url} alt={i.name} className="order-img" />
                ) : (
                  <span>{i.emoji || '🛍️'}</span>
                )}
                <span style={{ flex: 1 }}>{i.name} × {i.qty}</span>
                <span className="muted">{money(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="row" style={{ borderTop: '1px solid var(--line)', paddingTop: '.5rem' }}>
            <span>Order Total:</span>
            <b>{money(o.total)}</b>
          </div>
        </div>
      ))}
    </>
  );
}
