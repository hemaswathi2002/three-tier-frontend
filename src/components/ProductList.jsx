import ProductCard from './ProductCard.jsx';

export default function ProductList({ products, query, setQuery, isSaved, onAddToCart, onToggleWish }) {
  return (
    <>
      <input className="search" placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} saved={isSaved(p.id)} onAddToCart={onAddToCart} onToggleWish={onToggleWish} />
        ))}
        {!products.length && <p className="muted">No products match your search.</p>}
      </div>
    </>
  );
}
