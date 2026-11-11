import { useState } from 'react';
import { api } from '../api.js';

const SAMPLES = [
  {
    name: 'Wireless Ergonomic Mouse',
    price: 34.99,
    category: 'Tech',
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
    desc: 'Precision optical sensor with silent clicks.'
  },
  {
    name: 'Classic Aviator Sunglasses',
    price: 49.00,
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    desc: 'Polarized UV400 protective steel frame sunglasses.'
  },
  {
    name: 'Aroma Soy Wax Candle',
    price: 24.50,
    category: 'Home',
    url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
    desc: 'Sandalwood and vanilla scented clean soy candle.'
  }
];

export default function AddProduct({ onProductAdded, onCancel }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Tech');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const applySample = (s) => {
    setName(s.name);
    setPrice(s.price);
    setCategory(s.category);
    setImageUrl(s.url);
    setDescription(s.desc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setError('Product name and price are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newProduct = await api('/products', {
        method: 'POST',
        body: {
          name: name.trim(),
          price: Number(price),
          category: category.trim(),
          image_url: imageUrl.trim(),
          description: description.trim(),
          emoji: '🛍️'
        }
      });

      onProductAdded(newProduct);
    } catch (err) {
      setError(err.message || 'Failed to add product to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <h2>Add New Product to Database</h2>
      <p className="muted" style={{ marginBottom: '1.2rem' }}>
        This will insert a new row directly into your PostgreSQL database.
      </p>

      {/* Quick sample chips */}
      <div style={{ marginBottom: '1.2rem' }}>
        <span className="muted" style={{ display: 'block', marginBottom: '.4rem', fontSize: '.85rem' }}>
          💡 Try a sample with image:
        </span>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          {SAMPLES.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="btn"
              style={{ fontSize: '.82rem', padding: '.3rem .6rem' }}
              onClick={() => applySample(s)}
            >
              + {s.name}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="toast" style={{ background: '#991b1b', marginBottom: '1rem' }}>{error}</div>}

      <form className="auth-form" style={{ maxWidth: '100%' }} onSubmit={handleSubmit}>
        <div>
          <label className="muted" style={{ display: 'block', marginBottom: '.3rem' }}>Product Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Ergonomic Office Chair"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem' }}>
          <div>
            <label className="muted" style={{ display: 'block', marginBottom: '.3rem' }}>Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="49.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="muted" style={{ display: 'block', marginBottom: '.3rem' }}>Category</label>
            <input
              type="text"
              placeholder="e.g. Home, Tech, Kitchen"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <label className="muted" style={{ display: 'block', marginBottom: '.3rem' }}>Product Image URL</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Live Image Preview */}
        {imageUrl && (
          <div style={{ textAlign: 'center', background: '#f0ece1', padding: '.8rem', borderRadius: '4px' }}>
            <span className="muted" style={{ display: 'block', fontSize: '.8rem', marginBottom: '.4rem' }}>Image Preview:</span>
            <img
              src={imageUrl}
              alt="Preview"
              style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div>
          <label className="muted" style={{ display: 'block', marginBottom: '.3rem' }}>Description</label>
          <input
            type="text"
            placeholder="Short product description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '.8rem', marginTop: '.6rem' }}>
          <button type="submit" className="btn primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Saving to Database...' : 'Save Product to DB'}
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
