import { useState } from 'react';
import { api } from '../api.js';

export default function Login({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { onAuth(await api(`/auth/${mode}`, { method: 'POST', body: form })); }
    catch (err) { setError(err.message); }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Sign in' : 'Create your account'}</h2>
      {mode === 'register' && <input placeholder="Name" value={form.name} onChange={set('name')} required />}
      <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
      <input type="password" placeholder="Password (6+ characters)" value={form.password} onChange={set('password')} required />
      {error && <p className="muted" role="alert">{error}</p>}
      <button className="btn primary">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
      <button type="button" className="btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
      </button>
    </form>
  );
}
