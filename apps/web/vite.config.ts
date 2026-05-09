import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // Served from https://echemles.github.io/flowtrack/ on GitHub Pages (prod only).
  // Dev keeps base '/' so /app etc. work without the prefix.
  base: command === 'build' ? '/flowtrack/' : '/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
}));
