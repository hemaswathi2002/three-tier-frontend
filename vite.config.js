import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Dev proxy: run each service locally on its port (3001-3005)
const p = (port) => ({ target: `http://localhost:${port}`, changeOrigin: true });
export default defineConfig({ plugins: [react()], server: { proxy: {
  '/api/auth': p(3001), '/api/products': p(3002), '/api/cart': p(3003), '/api/wishlist': p(3004), '/api/orders': p(3005) } } });
