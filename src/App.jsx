import { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import ProductList from './components/ProductList.jsx';
import Wishlist from './components/Wishlist.jsx';
import Cart from './components/Cart.jsx';
import Orders from './components/Orders.jsx';
import AddProduct from './components/AddProduct.jsx';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [view, setView] = useState('shop');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  const call = useCallback((path, opts) => api(path, { ...opts, token }), [token]);
  const say = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };
  const guard = (fn) => async (...args) => { try { await fn(...args); } catch (e) { say(e.message); } };

  const loadProducts = useCallback(() => {
    api('/products' + (query ? `?q=${encodeURIComponent(query)}` : ''))
      .then(setProducts)
      .catch(() => {});
  }, [query]);

  const logout = () => {
    localStorage.clear(); setToken(null); setUser(null);
    setCart([]); setWish([]); setOrders([]); setView('shop');
  };
  const onAuth = ({ token, user }) => {
    localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user));
    setToken(token); setUser(user); setView('shop');
  };
  const needAuth = () => { say('Sign in to continue'); setView('login'); };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!token) return;
    Promise.all([call('/cart'), call('/wishlist'), call('/orders')])
      .then(([c, w, o]) => { setCart(c); setWish(w); setOrders(o); })
      .catch(logout);
  }, [token, call]);

  // Snapshot keeps full product info including image_url so cart and wishlist persist it in DB
  const snapshot = (p) => ({
    productId: p.id ?? p.product_id,
    name: p.name,
    price: p.price,
    image_url: p.image_url || '',
    emoji: p.emoji || '🛍️'
  });

  const isSaved = (id) => wish.some((w) => w.product_id === id);

  const addToCart = guard(async (p) => {
    if (!token) return needAuth();
    setCart(await call('/cart', { method: 'POST', body: snapshot(p) }));
    say(`Added "${p.name}" to cart`);
  });

  const setQty = guard(async (id, qty) => setCart(await call('/cart/' + id, { method: 'PUT', body: { qty } })));
  const removeFromCart = guard(async (id) => setCart(await call('/cart/' + id, { method: 'DELETE' })));

  const toggleWish = guard(async (p) => {
    if (!token) return needAuth();
    const id = p.id ?? p.product_id;
    setWish(isSaved(id)
      ? await call('/wishlist/' + id, { method: 'DELETE' })
      : await call('/wishlist', { method: 'POST', body: snapshot(p) }));
    say(isSaved(id) ? `Removed "${p.name}" from wishlist` : `Saved "${p.name}" to wishlist`);
  });

  const checkout = guard(async () => {
    const order = await call('/orders', { method: 'POST' });
    setCart([]); setOrders(await call('/orders')); setView('orders'); say(`Order #${order.id} placed! Stored in database.`);
  });

  const handleProductAdded = (newProd) => {
    loadProducts();
    setView('shop');
    say(`✔ "${newProd.name}" added to PostgreSQL DB!`);
  };

  return (
    <>
      <Header
        view={view}
        setView={setView}
        user={user}
        token={token}
        wishCount={wish.length}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onLogout={logout}
        onNeedAuth={needAuth}
      />
      {message && <div className="toast" role="status">{message}</div>}
      <main className="page">
        {view === 'login' && <Login onAuth={onAuth} />}
        {view === 'shop' && (
          <ProductList
            products={products}
            query={query}
            setQuery={setQuery}
            isSaved={isSaved}
            onAddToCart={addToCart}
            onToggleWish={toggleWish}
          />
        )}
        {view === 'wishlist' && <Wishlist items={wish} onMoveToCart={addToCart} onRemove={toggleWish} />}
        {view === 'cart' && <Cart items={cart} onQty={setQty} onRemove={removeFromCart} onCheckout={checkout} />}
        {view === 'orders' && <Orders orders={orders} />}
        {view === 'add-product' && (
          <AddProduct onProductAdded={handleProductAdded} onCancel={() => setView('shop')} />
        )}
      </main>
    </>
  );
}
