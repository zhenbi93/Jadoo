import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { PORT = '3001' } = loadEnv(mode, fileURLToPath(new URL('../api/', import.meta.url)), '');
  const proxy = { '/api': `http://127.0.0.1:${PORT}` };
  return {
    plugins: [react(), tailwindcss()],
    server: { host: '127.0.0.1', strictPort: true, proxy },
    preview: { host: '127.0.0.1', proxy },
  };
});
