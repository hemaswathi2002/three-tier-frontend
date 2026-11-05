import { money } from '../api.js';

export default function ProductCard({ product, saved, onAddToCart, onToggleWish }) {
  return (
    <article className="card">
      <div className="emoji">{product.emoji}</div>
      <strong>{product.name}</strong>
      <p className="muted">{product.description}</p>
      <div className="row">
        <b>{money(product.price)}</b>
        <span>
          <button className="btn" aria-pressed={saved} onClick={() => onToggleWish(product)}>{saved ? '♥ Saved' : '♡ Save'}</button>{' '}
          <button className="btn primary" onClick={() => onAddToCart(product)}>Add to cart</button>
        </span>
      </div>
    </article>
  );
}
