// vite.config.js
// @ts-expect-error: Can't find module 'vite'
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  json: {
    stringify: true,
  },
  server: {
    host: '127.0.0.1',
    port: 8951,
    strictPort: true,
  },
};

export default config;
