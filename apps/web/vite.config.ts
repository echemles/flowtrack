import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from https://echemles.github.io/flowtrack/ on GitHub Pages.
  base: '/flowtrack/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
});
