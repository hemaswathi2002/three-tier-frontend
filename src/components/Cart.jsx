import { money } from '../api.js';

export default function Cart({ items, onQty, onRemove, onCheckout }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <>
      <h2>Your cart</h2>
      {!items.length && <p className="muted">Your cart is empty.</p>}
      {items.map((i) => (
        <div className="line" key={i.product_id}>
          <span className="emoji">{i.emoji}</span>
          <span className="grow">{i.name}<br /><span className="muted">{money(i.price)} each</span></span>
          <button className="btn" onClick={() => onQty(i.product_id, i.qty - 1)}>−</button>
          <b>{i.qty}</b>
          <button className="btn" onClick={() => onQty(i.product_id, i.qty + 1)}>+</button>
          <button className="btn" onClick={() => onRemove(i.product_id)}>Remove</button>
        </div>
      ))}
      {!!items.length && (
        <div className="row cart-total">
          <h3>Total {money(total)}</h3>
          <button className="btn primary" onClick={onCheckout}>Place order</button>
        </div>
      )}
    </>
  );
}
