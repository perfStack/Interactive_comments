/* eslint-disable @typescript-eslint/no-var-requires */
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

module.exports = {
  plugins: [
    !dev && autoprefixer,

    !dev &&
      cssnano({
        preset: 'default',
      }),
  ],
};
