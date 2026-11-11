import { money } from '../api.js';

export default function ProductCard({ product, saved, onAddToCart, onToggleWish }) {
  return (
    <article className="card">
      <div className="img-container">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="emoji">{product.emoji || '🛍️'}</div>
        )}
      </div>
      <strong>{product.name}</strong>
      {product.category && <span className="badge-category">{product.category}</span>}
      <p className="muted">{product.description}</p>
      <div className="row">
        <b>{money(product.price)}</b>
        <span>
          <button className="btn" aria-pressed={saved} onClick={() => onToggleWish(product)}>
            {saved ? '❤️ Saved' : '🤍 Save'}
          </button>{' '}
          <button className="btn primary" onClick={() => onAddToCart(product)}>
            Add to cart
          </button>
        </span>
      </div>
    </article>
  );
}
