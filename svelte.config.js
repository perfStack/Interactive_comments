import adapterStatic from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({ postcss: true }),

  kit: {
    adapter: adapterStatic({
      // default options are shown
      pages: 'dist',
      assets: 'dist',
      fallback: null,
      precompress: false,
    }),

    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: true,
    },

    // vite: {
    //   plugins: [
    //     legacy({
    //       targets: ['since 2016'],
    //     }),
    //   ],
    // },

    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ['PATCH', 'DELETE'],
    },
  },
};

export default config;
