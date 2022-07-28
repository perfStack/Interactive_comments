// vite.config.js
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
  }, // build
  build: {
    // emptyOutDir: true,
    target: ['es2017'],
    // minify: 'terser',
    // rollupOptions: {
    //   // Sveltekit will override this
    //   // https://github.com/sveltejs/kit/issues/1410
    //   output: {
    //     assetFileNames: '[hash][extname]',
    //   },
    // },
  },
};

export default config;
