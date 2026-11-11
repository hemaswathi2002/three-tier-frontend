import { money } from '../api.js';

export default function Wishlist({ items, onMoveToCart, onRemove }) {
  return (
    <>
      <h2>Wishlist</h2>
      {!items.length && <p className="muted">Nothing saved yet. Tap Save on any product.</p>}
      {items.map((w) => (
        <div className="line" key={w.product_id}>
          {w.image_url ? (
            <img src={w.image_url} alt={w.name} className="line-img" />
          ) : (
            <span className="emoji">{w.emoji || '🛍️'}</span>
          )}
          <span className="grow">
            <strong>{w.name}</strong>
            <br />
            <span className="muted">{money(w.price)}</span>
          </span>
          <button className="btn primary" onClick={() => onMoveToCart(w)}>Move to cart</button>
          <button className="btn" onClick={() => onRemove(w)}>Remove</button>
        </div>
      ))}
    </>
  );
}
