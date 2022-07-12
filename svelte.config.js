import adapterStatic from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // options passed to svelte.compile (https://svelte.dev/docs#compile-time-svelte-compile)
  compilerOptions: {},

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({ typescript: false, scss: false }),

  kit: {
    adapter: adapterStatic({
      // default options are shown
      pages: 'dist',
      assets: 'dist',
      fallback: null,
      precompress: false,
    }),
    paths: {
      base: isProduction ? '/perfstack' : '',
    },
    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: true,
      enabled: true,
      crawl: true,
    },
  },

  experimental: {
    // Use extra preprocessors that delegate style and TypeScript preprocessing
    // to native Vite plugins.TypeScript will be transformed with esbuild.
    // Styles will be transformed using Vite's CSS plugin,
    //  which handles @imports, url() references, PostCSS, CSS Modules,
    //  and .scss/.sass/.less/.styl/.stylus files.
    //  Do not use together with TypeScript or style preprocessors from svelte-preprocess as
    //  attempts to transform the content twice will fail!
    useVitePreprocess: true,
  },
};

export default config;
