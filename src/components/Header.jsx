export default function Header({ view, setView, user, token, wishCount, cartCount, onLogout, onNeedAuth }) {
  const tabs = [
    ['shop', 'Shop'],
    ['wishlist', `Wishlist (${wishCount})`],
    ['cart', `Cart (${cartCount})`],
    ['orders', 'Orders'],
    ['add-product', '+ Add Product']
  ];
  return (
    <header className="site-header">
      <h1 className="logo" onClick={() => setView('shop')} style={{ cursor: 'pointer' }}>ShopSphere</h1>
      <nav className="nav">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={view === key ? 'btn on' : 'btn'}
            onClick={() => (token || key === 'shop' || key === 'add-product' ? setView(key) : onNeedAuth())}
          >
            {label}
          </button>
        ))}
        {user ? (
          <button className="btn" onClick={onLogout}>Sign out ({user.name})</button>
        ) : (
          <button className="btn" onClick={() => setView('login')}>Sign in</button>
        )}
      </nav>
    </header>
  );
}
