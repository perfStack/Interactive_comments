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
    assetsInlineLimit: 0,
    target: ['es2017'],
    minify: 'terser',
    terserOptions: {
      compress: {
        // warnings: false,
        ecma: '2017',
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
    },
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
